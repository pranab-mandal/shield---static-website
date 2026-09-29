import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { supabase } from "../lib/supabaseClient";

const createPlayerDetails = () => ({
  fullName: "",
  rollNumber: "",
  collegeEmail: "",
  contactNumber: "",
});

const branchOptions = [
  "B.Tech CSE",
  "B.Tech ECE",
  "B.Tech Other",
  "Dual Degree / M.Tech",
];

const yearOptions = [
  "1st Year",
];

const domainOptions = [
  "Web Security",
  "Network Security",
  "Offensive Security",
  "Defensive Security",
  "Cryptography",
  "Cloud Security",
  "Digital Forensics",
  "AI Security",
];

const experienceOptions = [
  "Complete Beginner (Curious & enthusiastic)",
  "Novice (Basic Linux/Python/Networking)",
  "Intermediate (Played picoCTF/OverTheWire)",
  "Experienced (Active CTF player / Bug hunter)",
];

const NITH_EMAIL_PATTERN = String.raw`^26[a-z]{3}\d{3}@nith\.ac\.in$`;

const Activities = () => {
  const { hash } = useLocation();
  const { isSignedIn, user } = useUser();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [playerCount, setPlayerCount] = useState(1);
  const [player1, setPlayer1] = useState({
    fullName: "",
    rollNumber: "",
    collegeEmail: "",
    contactNumber: "",
    branch: "",
    year: "1st Year",
    domain: "",
    experience: "",
  });
  const [player2, setPlayer2] = useState(createPlayerDetails());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [isLoadingReg, setIsLoadingReg] = useState(false);

  // Fetch registration for the authenticated user from Supabase
  const fetchUserRegistration = async () => {
    if (!user) return;
    setIsLoadingReg(true);
    try {
      const userEmail = user.primaryEmailAddress?.emailAddress || "";
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .or(
          `user_id.eq.${user.id},user_email.eq.${userEmail},player1_email.eq.${userEmail},player2_email.eq.${userEmail}`
        )
        .order("registered_at", { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setExistingRegistration(data[0]);
      } else {
        setExistingRegistration(null);
      }
    } catch (err) {
      console.error("Error checking registration:", err);
    } finally {
      setIsLoadingReg(false);
    }
  };

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserRegistration();
    }
  }, [isSignedIn, user, isRegisterOpen]);

  // Sync Clerk authenticated user info into Player 1 details
  useEffect(() => {
    if (isSignedIn && user) {
      setPlayer1((prev) => ({
        ...prev,
        fullName:
          prev.fullName ||
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "",
        collegeEmail:
          prev.collegeEmail ||
          user.primaryEmailAddress?.emailAddress ||
          "",
      }));
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (!hash) return;

    const targetId = hash.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  useEffect(() => {
    if (!isRegisterOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsRegisterOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isRegisterOpen]);

  useEffect(() => {
    if (!isSignedIn && isRegisterOpen) {
      setIsRegisterOpen(false);
      setIsSubmitted(false);
    }
  }, [isSignedIn, isRegisterOpen]);

  // Handle fresh registration submission
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (!isSignedIn || !user) {
      setSubmitError("Please sign in with your account to register.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      user_id: user.id,
      user_email: user.primaryEmailAddress?.emailAddress || player1.collegeEmail,
      team_size: playerCount,
      player1_name: player1.fullName,
      player1_roll: player1.rollNumber,
      player1_email: player1.collegeEmail,
      player1_contact: player1.contactNumber,
      branch: player1.branch,
      year: player1.year,
      domain: player1.domain,
      experience: player1.experience,
      player2_name: playerCount === 2 ? player2.fullName : null,
      player2_roll: playerCount === 2 ? player2.rollNumber : null,
      player2_email: playerCount === 2 ? player2.collegeEmail : null,
      player2_contact: playerCount === 2 ? player2.contactNumber : null,
      registered_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("registrations")
        .insert([payload])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        setSubmitError(error.message || "Failed to save registration to database.");
      } else {
        if (data && data[0]) {
          setExistingRegistration(data[0]);
        }
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding Player 2 to existing Solo registration (Team Formation)
  const handleTeamFormationSubmit = async (event) => {
    event.preventDefault();
    if (!existingRegistration) return;

    setIsSubmitting(true);
    setSubmitError("");

    const updatePayload = {
      team_size: 2,
      player2_name: player2.fullName,
      player2_roll: player2.rollNumber,
      player2_email: player2.collegeEmail,
      player2_contact: player2.contactNumber,
    };

    try {
      let query = supabase.from("registrations").update(updatePayload);

      if (existingRegistration.id) {
        query = query.eq("id", existingRegistration.id);
      } else if (existingRegistration.user_id) {
        query = query.eq("user_id", existingRegistration.user_id);
      } else {
        query = query.eq("user_email", existingRegistration.user_email);
      }

      const { data, error } = await query.select();

      if (error) {
        console.error("Team formation error:", error);
        setSubmitError(error.message || "Failed to update team details. Check database UPDATE permissions.");
      } else {
        setPlayerCount(2);
        setExistingRegistration((prev) => ({
          ...prev,
          ...updatePayload,
          ...(data && data[0] ? data[0] : {}),
        }));
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error("Team formation exception:", err);
      setSubmitError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayer1Change = (field, value) => {
    setPlayer1((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlayer2Change = (field, value) => {
    setPlayer2((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <main className="bg-neutral-950 min-h-screen text-white pt-32 pb-24 px-6 sm:px-12 md:px-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        {/* Top Hero Section */}
        <section className="flex flex-col gap-6 max-w-5xl">
          <p className="text-[#61dca3] font-mono text-sm tracking-wider uppercase mb-1">
            Practice & Engagement
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            Society Activities & Events
          </h1>
          <div className="w-24 h-1 bg-[#61b3dc] rounded mt-2"></div>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-medium leading-snug max-w-4xl mt-4">
            From overnight Capture-The-Flag battles and defensive red-vs-blue
            scrims to weekend bootcamps, we provide students with hands-on
            technical rigor.
          </p>
        </section>

        {/* Upcoming Events Header */}
        <div className="flex flex-col gap-3 max-w-4xl border-t border-white/5 pt-16 -mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Upcoming Flagship Events
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Official schedule for orientations, practical hack-labs, and
            competitive cyber leagues.
          </p>
        </div>

        {/* Latest Event Banner */}
        <section className="relative pt-12 scroll-mt-32" id="latest-events">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-[#61dca3] rounded-full blur-[120px] opacity-[0.15] pointer-events-none"></div>

          <div className="relative z-10 bg-[#0a0a0a] border border-[#61dca3]/40 rounded-3xl p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12 shadow-2xl">
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="px-3 py-1 bg-[#61dca3] text-black text-xs font-bold tracking-widest uppercase rounded">
                  Upcoming Event
                </span>
                <span className="text-[#61b3dc] font-mono text-sm">
                  Registrations Open
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Cybersecurity 101: Hands-On Defensive Workshop
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                Join us for an intensive, beginner-friendly workshop covering
                the absolute fundamentals of network defense, web
                vulnerabilities, and secure coding practices.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 pt-2 border-l-2 border-white/10 pl-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
                    Date & Time
                  </span>
                  <span className="text-gray-200 font-mono text-sm">
                    Oct 24, 2026 • 10:00 AM
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
                    Location
                  </span>
                  <span className="text-gray-200 font-mono text-sm">
                    Computer Center, NIT Hamirpur
                  </span>
                </div>
              </div>

              <div className="pt-4">
                {isSignedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!existingRegistration) setIsRegisterOpen(true);
                    }}
                    disabled={Boolean(existingRegistration)}
                    className={`px-8 py-3.5 font-bold rounded transition-colors shadow-lg ${
                      existingRegistration
                        ? "bg-white/10 text-gray-500 cursor-not-allowed"
                        : "bg-[#61dca3] text-neutral-950 hover:bg-[#4fbe8b] cursor-pointer"
                    }`}
                  >
                    {existingRegistration ? "Already registered" : "Register Now"}
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="px-8 py-3.5 bg-[#61dca3] text-neutral-950 font-bold rounded hover:bg-[#4fbe8b] transition-colors shadow-lg"
                    >
                      Sign In to Register
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>

            {/* Visual Graphic Area */}
            <div className="w-full md:w-[35%] aspect-square bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(97,220,163,0.05)_50%,transparent_75%,transparent_100%)] bg-size-[20px_20px]"></div>
              <div className="text-[#61dca3] font-mono text-8xl font-light opacity-30 group-hover:scale-110 transition-transform duration-700">
                {"</>"}
              </div>
            </div>
          </div>
        </section>

        {/* Activities List Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start relative border-t border-white/5 pt-16">
          <div className="md:col-span-4 md:sticky md:top-32">
            <p className="text-[#61b3dc] font-mono text-sm tracking-wider uppercase mb-3">
              Engagement
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              What We Organize
            </h2>
          </div>

          <div className="md:col-span-8 flex flex-col gap-6">
            {/* Activity 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition-colors hover:bg-white/10 group">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white transition-colors group-hover:text-[#61dca3]">
                  Capture The Flag (CTF)
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                We regularly host and participate in local and international CTF
                tournaments. Members team up to solve challenges across web
                exploitation, cryptography, reverse engineering, and digital
                forensics.
              </p>
            </div>

            {/* Activity 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition-colors hover:bg-white/10 group">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white transition-colors group-hover:text-[#61dca3]">
                  Red vs Blue Scrimmages
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                Live-fire cyber exercises where the Red Team attempts to breach
                simulated corporate infrastructure while the Blue Team actively
                monitors SIEM alerts and defends the network in real-time.
              </p>
            </div>

            {/* Activity 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition-colors hover:bg-white/10 group">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white transition-colors group-hover:text-[#61dca3]">
                  Weekend Bootcamps
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                Intensive 2-day hands-on workshops focused on mastering specific
                tools and techniques, such as Advanced Burp Suite fuzzing,
                malware reverse engineering, or AWS cloud security auditing.
              </p>
            </div>

            {/* Activity 4 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition-colors hover:bg-white/10 group">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white transition-colors group-hover:text-[#61dca3]">
                  Speaker Sessions
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                Guest lectures and knowledge-sharing sessions featuring alumni
                and industry professionals from top cybersecurity firms,
                discussing real-world threat landscapes and career roadmaps.
              </p>
            </div>
          </div>
        </section>
      </div>

      {isRegisterOpen && isSignedIn && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setIsRegisterOpen(false);
              setIsSubmitted(false);
            }}
            aria-hidden="true"
          />

          <div
            className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-8 shadow-2xl scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-modal-title"
          >
            <div className="flex items-start justify-between gap-4 mb-6 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider bg-[#61dca3]/15 text-[#61dca3] border border-[#61dca3]/30 rounded">
                    Cycle 2026
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    Official Registration
                  </span>
                </div>
                <h2
                  id="register-modal-title"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
                >
                  Event & Team Registration
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsRegisterOpen(false);
                  setIsSubmitted(false);
                }}
                className="text-gray-400 hover:text-white transition-colors text-2xl leading-none cursor-pointer"
                aria-label="Close registration form"
              >
                ×
              </button>
            </div>

            {isSubmitted ? (
              /* Registration Success Confirmation */
              <div className="py-10 px-4 flex flex-col items-center text-center max-w-lg mx-auto space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-3xl">
                  ✓
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#61dca3] font-mono font-bold">
                    Registration Complete
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1 mb-2">
                    Application Confirmed!
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Registered for:{" "}
                    <span className="text-white font-mono font-semibold">
                      {existingRegistration?.player1_email || player1.collegeEmail}
                    </span>
                  </p>
                </div>

                <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Team Format:</span>
                    <span className="text-white font-semibold">
                      {existingRegistration?.team_size === 2 || playerCount === 2
                        ? "Team (2 Players)"
                        : "Solo (1 Player)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Player 1:</span>
                    <span className="text-white font-semibold">
                      {existingRegistration?.player1_name || player1.fullName} ({existingRegistration?.player1_roll || player1.rollNumber})
                    </span>
                  </div>
                  {(existingRegistration?.player2_name || (playerCount === 2 && player2.fullName)) && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Player 2:</span>
                      <span className="text-white font-semibold">
                        {existingRegistration?.player2_name || player2.fullName} ({existingRegistration?.player2_roll || player2.rollNumber})
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterOpen(false);
                    setIsSubmitted(false);
                  }}
                  className="px-8 py-3 bg-[#61dca3] text-black font-bold rounded-xl hover:bg-[#4fbe8b] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : isLoadingReg ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-10 h-10 border-2 border-[#61dca3] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-mono text-gray-400">Checking your registration status...</p>
              </div>
            ) : existingRegistration && (Number(existingRegistration.team_size) === 2 || (existingRegistration.player2_name && existingRegistration.player2_name.trim() !== "")) ? (
              /* State 1: Already Registered with Full Team */
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">Already Registered with Full Team</h4>
                      <p className="text-xs text-gray-400">Your registration is confirmed. Team formation is complete.</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#61dca3]/20 text-[#61dca3] border border-[#61dca3]/40 rounded-lg text-xs font-bold uppercase tracking-wider font-mono">
                    Team of 2
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Player 1 Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs uppercase font-mono tracking-wider text-[#61dca3] font-bold">Player 1 (Candidate / Leader)</span>
                      <span className="text-xs text-gray-500 font-mono">Verified</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Full Name:</span><span className="text-white font-semibold">{existingRegistration.player1_name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Roll Number:</span><span className="text-white font-mono">{existingRegistration.player1_roll}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">College Email:</span><span className="text-white font-mono">{existingRegistration.player1_email}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Contact:</span><span className="text-white font-mono">{existingRegistration.player1_contact}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Branch & Year:</span><span className="text-white">{existingRegistration.branch} • {existingRegistration.year}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Domain:</span><span className="text-[#61b3dc]">{existingRegistration.domain}</span></div>
                    </div>
                  </div>

                  {/* Player 2 Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs uppercase font-mono tracking-wider text-[#61b3dc] font-bold">Player 2 (Teammate)</span>
                      <span className="text-xs text-gray-500 font-mono">Confirmed</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Full Name:</span><span className="text-white font-semibold">{existingRegistration.player2_name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Roll Number:</span><span className="text-white font-mono">{existingRegistration.player2_roll}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">College Email:</span><span className="text-white font-mono">{existingRegistration.player2_email}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Contact:</span><span className="text-white font-mono">{existingRegistration.player2_contact}</span></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-8 py-3 bg-[#61dca3] text-black font-bold rounded-xl hover:bg-[#4fbe8b] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : existingRegistration && Number(existingRegistration.team_size) === 1 && (!existingRegistration.player2_name || existingRegistration.player2_name.trim() === "") ? (
              /* State 2: Registered Solo -> Only Show Team Formation (Add Player 2) */
              <form className="space-y-7" onSubmit={handleTeamFormationSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#61b3dc]/10 border border-[#61b3dc]/30 text-xs">
                  <div className="flex items-center gap-2 text-[#61b3dc] font-medium">
                    <span>ℹ️</span>
                    <span>
                      You have registered as a Solo Candidate. Form your team by registering Player 2 below.
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#61b3dc]/20 text-[#61b3dc] font-mono font-bold uppercase">
                    Team Formation Mode
                  </span>
                </div>

                {/* Player 1 (Already Registered Leader) Summary */}
                <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <span className="text-xs uppercase font-mono tracking-wider text-[#61dca3] font-bold">
                      1. Player 1 Details (Registered)
                    </span>
                    <span className="text-xs text-gray-500 font-mono">Already Completed</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div><span className="text-gray-500 block">Name:</span> <span className="text-white font-semibold">{existingRegistration.player1_name}</span></div>
                    <div><span className="text-gray-500 block">Roll Number:</span> <span className="text-white font-mono">{existingRegistration.player1_roll}</span></div>
                    <div><span className="text-gray-500 block">Email:</span> <span className="text-white font-mono">{existingRegistration.player1_email}</span></div>
                    <div><span className="text-gray-500 block">Contact:</span> <span className="text-white font-mono">{existingRegistration.player1_contact}</span></div>
                    <div><span className="text-gray-500 block">Branch & Year:</span> <span className="text-white">{existingRegistration.branch} • {existingRegistration.year}</span></div>
                    <div><span className="text-gray-500 block">Domain:</span> <span className="text-[#61dca3]">{existingRegistration.domain}</span></div>
                  </div>
                </div>

                {submitError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono space-y-1">
                    <div className="font-bold">Notice:</div>
                    <div>{submitError}</div>
                  </div>
                )}

                {/* Player 2 Details Section for Team Formation */}
                <div className="rounded-2xl border border-white/10 bg-[#050505] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        2. Player 2 Details (Teammate)
                      </h3>
                      <p className="text-xs text-gray-400">
                        Enter your second team member's details to complete team formation.
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-widest text-[#61dca3] font-mono">
                      Required
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label
                        htmlFor="team-player2-name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="team-player2-name"
                        name="player2FullName"
                        type="text"
                        required
                        value={player2.fullName}
                        onChange={(event) =>
                          handlePlayer2Change("fullName", event.target.value)
                        }
                        placeholder="Player 2 full name"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="team-player2-roll"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Roll Number *
                      </label>
                      <input
                        id="team-player2-roll"
                        name="player2RollNumber"
                        type="text"
                        required
                        value={player2.rollNumber}
                        onChange={(event) =>
                          handlePlayer2Change("rollNumber", event.target.value)
                        }
                        placeholder="Roll number"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="team-player2-email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        College Email *
                      </label>
                      <input
                        id="team-player2-email"
                        name="player2CollegeEmail"
                        type="email"
                        required
                        value={player2.collegeEmail}
                        onChange={(event) =>
                          handlePlayer2Change(
                            "collegeEmail",
                            event.target.value,
                          )
                        }
                        placeholder="player2@college.edu"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="team-player2-contact"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Contact Number *
                      </label>
                      <input
                        id="team-player2-contact"
                        name="player2ContactNumber"
                        type="tel"
                        required
                        value={player2.contactNumber}
                        onChange={(event) =>
                          handlePlayer2Change(
                            "contactNumber",
                            event.target.value,
                          )
                        }
                        placeholder="Contact number"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3.5 rounded-xl bg-[#61dca3] text-neutral-950 font-bold transition-colors hover:bg-[#4fbe8b] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? "Forming Team..." : "Form Team (Add Player 2)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-7 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold transition-colors hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* State 3: Brand New Registration Form */
              <form className="space-y-7" onSubmit={handleRegisterSubmit}>
                {/* Auth status indicator */}
                {isSignedIn && user ? (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#61dca3]/10 border border-[#61dca3]/30 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#61dca3] animate-pulse"></span>
                      <span className="text-gray-300">
                        Authenticated as:{" "}
                        <strong className="text-white">{user.primaryEmailAddress?.emailAddress}</strong>
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#61dca3]/20 text-[#61dca3] text-[10px] font-bold uppercase">
                      Verified
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                    <div className="flex items-center gap-2 text-amber-300 font-medium">
                      <span>⚠️</span>
                      <span>
                        Authentication required to submit team registration.
                      </span>
                    </div>
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        className="px-4 py-1.5 rounded-lg bg-[#61dca3] text-neutral-950 font-bold hover:bg-[#4fbe8b] transition-colors text-xs cursor-pointer"
                      >
                        Sign In Now
                      </button>
                    </SignInButton>
                  </div>
                )}

                {submitError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono space-y-1">
                    <div className="font-bold">Submission Notice:</div>
                    <div>{submitError}</div>
                  </div>
                )}

                {/* Player 1 Details Grid */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span>1. Candidate / Team Leader Details</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="register-name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="register-name"
                        name="fullName"
                        type="text"
                        required
                        value={player1.fullName}
                        onChange={(e) =>
                          handlePlayer1Change("fullName", e.target.value)
                        }
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="register-roll"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Roll Number *
                      </label>
                      <input
                        id="register-roll"
                        name="rollNumber"
                        type="text"
                        required
                        value={player1.rollNumber}
                        onChange={(e) =>
                          handlePlayer1Change("rollNumber", e.target.value)
                        }
                        placeholder="Roll number"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="register-email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        College Email *
                      </label>
                      <input
                        id="register-email"
                        name="collegeEmail"
                        type="email"
                        required
                        pattern={NITH_EMAIL_PATTERN}
                        title="Use the format 26bcs041@nith.ac.in"
                        value={player1.collegeEmail}
                        onChange={(e) =>
                          handlePlayer1Change("collegeEmail", e.target.value)
                        }
                        placeholder="26xyz123@nith.ac.in"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="register-contact"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Contact Number *
                      </label>
                      <input
                        id="register-contact"
                        name="contactNumber"
                        type="tel"
                        required
                        value={player1.contactNumber}
                        onChange={(e) =>
                          handlePlayer1Change("contactNumber", e.target.value)
                        }
                        placeholder="Contact number"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="register-branch"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Branch *
                      </label>
                      <select
                        id="register-branch"
                        name="branch"
                        required
                        value={player1.branch}
                        onChange={(e) =>
                          handlePlayer1Change("branch", e.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      >
                        <option value="" disabled>
                          Select branch
                        </option>
                        {branchOptions.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-[#0a0a0a]"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="register-year"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Year *
                      </label>
                      <select
                        id="register-year"
                        name="year"
                        required
                        value={player1.year}
                        onChange={(e) =>
                          handlePlayer1Change("year", e.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      >
                        {yearOptions.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-[#0a0a0a]"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="register-domain"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Primary Domain of Interest *
                      </label>
                      <select
                        id="register-domain"
                        name="domain"
                        required
                        value={player1.domain}
                        onChange={(e) =>
                          handlePlayer1Change("domain", e.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      >
                        <option value="" disabled>
                          Choose a domain
                        </option>
                        {domainOptions.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-[#0a0a0a]"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="register-experience"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Prior Experience *
                      </label>
                      <select
                        id="register-experience"
                        name="experience"
                        required
                        value={player1.experience}
                        onChange={(e) =>
                          handlePlayer1Change("experience", e.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      >
                        <option value="" disabled>
                          Choose your experience level
                        </option>
                        {experienceOptions.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-[#0a0a0a]"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="register-players"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Total Number of Players *
                      </label>
                      <select
                        id="register-players"
                        name="playersCount"
                        value={playerCount}
                        onChange={(event) =>
                          setPlayerCount(Number(event.target.value) || 1)
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                      >
                        <option value={1} className="bg-[#0a0a0a]">
                          1 (Solo Candidate)
                        </option>
                        <option value={2} className="bg-[#0a0a0a]">
                          2 (Team of 2)
                        </option>
                      </select>
                      <p className="mt-2 text-xs text-gray-500">
                        Select 2 if you are participating as a team of 2.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conditional Player 2 Details Section */}
                {playerCount === 2 && (
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-semibold text-white">
                        2. Player 2 Details
                      </h3>
                      <p className="text-xs text-gray-400">
                        Add details for the second team member.
                      </p>
                    </div>

                    <section className="rounded-2xl border border-white/10 bg-[#050505] p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <h4 className="text-base font-semibold text-white">
                          Player 2 Information
                        </h4>
                        <span className="text-xs uppercase tracking-widest text-[#61dca3] font-mono">
                          Required for Team of 2
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="player2-name"
                            className="block text-sm font-medium text-gray-300 mb-2"
                          >
                            Full Name *
                          </label>
                          <input
                            id="player2-name"
                            name="player2FullName"
                            type="text"
                            required
                            value={player2.fullName}
                            onChange={(event) =>
                              handlePlayer2Change("fullName", event.target.value)
                            }
                            placeholder="Player 2 full name"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="player2-roll"
                            className="block text-sm font-medium text-gray-300 mb-2"
                          >
                            Roll Number *
                          </label>
                          <input
                            id="player2-roll"
                            name="player2RollNumber"
                            type="text"
                            required
                            value={player2.rollNumber}
                            onChange={(event) =>
                              handlePlayer2Change("rollNumber", event.target.value)
                            }
                            placeholder="Roll number"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="player2-email"
                            className="block text-sm font-medium text-gray-300 mb-2"
                          >
                            College Email *
                          </label>
                          <input
                            id="player2-email"
                            name="player2CollegeEmail"
                            type="email"
                            required
                            pattern={NITH_EMAIL_PATTERN}
                            title="Use the format 26bcs041@nith.ac.in"
                            pattern={NITH_EMAIL_PATTERN}
                            title="Use the format 26bcs041@nith.ac.in"
                            value={player2.collegeEmail}
                            onChange={(event) =>
                              handlePlayer2Change(
                                "collegeEmail",
                                event.target.value,
                              )
                            }
                            placeholder="player2@college.edu"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="player2-contact"
                            className="block text-sm font-medium text-gray-300 mb-2"
                          >
                            Contact Number *
                          </label>
                          <input
                            id="player2-contact"
                            name="player2ContactNumber"
                            type="tel"
                            required
                            value={player2.contactNumber}
                            onChange={(event) =>
                              handlePlayer2Change(
                                "contactNumber",
                                event.target.value,
                              )
                            }
                            placeholder="Contact number"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3.5 rounded-xl bg-[#61dca3] text-neutral-950 font-bold transition-colors hover:bg-[#4fbe8b] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? "Submitting Registration..." : "Submit Application"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-7 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold transition-colors hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Activities;
