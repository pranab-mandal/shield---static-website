import React, { useState, useRef, useEffect } from 'react';
import BorderGlow from '../components/BorderGlow';
import { 
  FaGithub, 
  FaLinkedinIn, 
  FaXTwitter, 
  FaDiscord, 
  FaEnvelope, 
  FaLocationDot, 
  FaPhone, 
  FaPaperPlane, 
  FaCircleCheck, 
  FaUserGraduate, 
  FaShieldHalved,
  FaClock,
  FaChevronDown,
  FaBuildingUser
} from 'react-icons/fa6';

const ScrollRevealCard = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`h-full transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
};

// FAQ Accordion Item Component
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-white/10 rounded bg-neutral-900/60 overflow-hidden transition-colors duration-300 hover:border-white/20">
      <button
        onClick={onClick}
        className="w-full p-6 text-left flex justify-between items-center gap-4 focus:outline-none"
      >
        <span className="text-lg font-semibold text-white tracking-tight">{question}</span>
        <FaChevronDown
          className={`text-[#61dca3] transition-transform duration-300 shrink-0 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-gray-300 leading-relaxed text-sm sm:text-base border-t border-white/5 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 1200);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const faqs = [
    {
      question: "How can NIT Hamirpur students join SHIELD?",
      answer: "SHIELD conducts annual recruitment drives at the beginning of each academic session for 1st, 2nd, and 3rd year students. Keep an eye on our social media and campus announcements for orientation dates and CTF qualification rounds."
    },
    {
      question: "Are SHIELD workshops open to beginners with no coding background?",
      answer: "Absolutely! We organize foundational bootcamps covering networking basics, Linux CLI, web fundamentals, and ethical hacking essentials tailored specifically for beginners."
    },
    {
      question: "How can companies or sponsors collaborate with SHIELD for CTFs?",
      answer: "We welcome industry partnerships, CTF prize sponsorships, speaker sessions, and recruitment opportunities. Please send an email directly to shield@nith.ac.in or fill out the contact form selecting 'Sponsorship & CTFs'."
    },
    {
      question: "How can I reach out to the Faculty Incharge for official approvals?",
      answer: "Official correspondence intended for Faculty Incharge Dr. Alan Turing can be addressed to fi.shield@nith.ac.in or submitted via the Department of Computer Science & Engineering, NIT Hamirpur."
    },
    {
      question: "Does SHIELD handle vulnerability reports for campus infrastructure?",
      answer: "Yes, SHIELD works closely with NITH Computer Centre under ethical guidelines. If you have identified a vulnerability, please report it responsibly to shield@nith.ac.in with detailed steps to reproduce."
    }
  ];

  return (
    <main className="bg-neutral-950 min-h-screen text-white pt-32 pb-24 px-6 sm:px-12 md:px-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        
        {/* Top Hero Section */}
        <section className="flex flex-col gap-6 max-w-5xl">
          <p className="text-[#61dca3] font-mono text-sm tracking-wider uppercase mb-1">
            Active Communications
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            Contact Headquarters
          </h1>
          <div className="w-24 h-1 bg-[#61dca3] rounded mt-2"></div>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-medium leading-snug max-w-4xl mt-4">
            Have questions about our security workshops, CTF competitions, or research initiatives? Connect with our team, faculty incharge, or drop us a message below.
          </p>
        </section>

        {/* Section 1: Main Contact Grid (Form + Contact Details) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <BorderGlow
              className="h-full"
              backgroundColor="#0a0a0a"
              glowColor="150 65 62"
              colors={['#61dca3', '#61b3dc', '#2b4539']}
              borderRadius={8}
            >
              <div className="p-8 sm:p-10 flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Fill out the form and our core committee will get back to you within 24 hours.
                  </p>
                </div>

                {submitted && (
                  <div className="flex items-center gap-3 bg-[#61dca3]/10 border border-[#61dca3]/40 p-4 rounded text-[#61dca3] animate-fadeIn">
                    <FaCircleCheck size={20} className="shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Message Transmitted!</h4>
                      <p className="text-xs text-[#61dca3]/80">Thank you for reaching out. We have logged your request.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="bg-neutral-900/80 border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#61dca3] focus:ring-1 focus:ring-[#61dca3] transition-all placeholder:text-gray-600"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="bg-neutral-900/80 border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#61dca3] focus:ring-1 focus:ring-[#61dca3] transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Inquiry Category *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="bg-neutral-900/80 border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#61dca3] focus:ring-1 focus:ring-[#61dca3] transition-all"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Join SHIELD">Joining the Society</option>
                      <option value="Workshop / Event Partnership">Workshop / Event Partnership</option>
                      <option value="Sponsorship & CTFs">Sponsorship & CTFs</option>
                      <option value="Vulnerability Disclosure">Vulnerability Disclosure</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Your Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your query or message here..."
                      className="bg-neutral-900/80 border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#61dca3] focus:ring-1 focus:ring-[#61dca3] transition-all placeholder:text-gray-600 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex items-center justify-center gap-3 bg-[#61dca3] text-neutral-950 font-bold px-8 py-3.5 rounded hover:bg-[#4fbe8b] transition-all duration-300 shadow-lg shadow-[#61dca3]/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-neutral-950" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Encrypting & Transmitting...
                      </span>
                    ) : (
                      <>
                        <FaPaperPlane size={16} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </BorderGlow>
          </div>

          {/* Details Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Faculty Incharge Contact Card */}
            <ScrollRevealCard delay={0}>
              <BorderGlow
                className="h-full"
                backgroundColor="#0a0a0a"
                glowColor="150 65 62"
                colors={['#61dca3', '#61b3dc', '#2b4539']}
                borderRadius={8}
              >
                <div className="p-6 sm:p-8 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded p-[2px] bg-gradient-to-br from-[#61dca3] to-[#61b3dc] shrink-0">
                      <div className="w-full h-full rounded overflow-hidden bg-neutral-900 flex items-center justify-center">
                        <FaBuildingUser size={24} className="text-[#61dca3]" />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#61b3dc]">Faculty Administration</span>
                      <h3 className="text-xl font-bold text-white tracking-tight">Dr. Alan Turing</h3>
                      <p className="text-xs text-gray-400">Faculty Incharge, SHIELD</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/10 my-1"></div>

                  <div className="flex flex-col gap-3 text-sm text-gray-300">
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-[#61dca3] shrink-0" size={16} />
                      <a href="mailto:fi.shield@nith.ac.in" className="hover:text-white transition-colors">fi.shield@nith.ac.in</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaUserGraduate className="text-[#61b3dc] shrink-0" size={16} />
                      <span>Dept of Computer Science & Engineering</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaLocationDot className="text-[#61dca3] shrink-0" size={16} />
                      <span>CSE Dept, NIT Hamirpur - 177005</span>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </ScrollRevealCard>

            {/* Society Core Contacts */}
            <ScrollRevealCard delay={150}>
              <BorderGlow
                className="h-full"
                backgroundColor="#0a0a0a"
                glowColor="150 65 62"
                colors={['#61dca3', '#61b3dc', '#2b4539']}
                borderRadius={8}
              >
                <div className="p-6 sm:p-8 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaShieldHalved size={22} className="text-[#61dca3]" />
                      <h3 className="text-lg font-bold text-white tracking-tight">Society Secretariate</h3>
                    </div>
                  </div>

                  <div className="h-px bg-white/10 my-1"></div>

                  <div className="flex flex-col gap-3 text-sm text-gray-300">
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-[#61dca3] shrink-0" size={16} />
                      <div>
                        <span className="block text-xs text-gray-500 font-mono">Official Email</span>
                        <a href="mailto:shield@nith.ac.in" className="hover:text-white font-medium transition-colors">shield@nith.ac.in</a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaPhone className="text-[#61b3dc] shrink-0" size={16} />
                      <div>
                        <span className="block text-xs text-gray-500 font-mono">Secretariate Phone</span>
                        <span className="font-medium">+91 1972 254 000</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaClock className="text-[#61dca3] shrink-0" size={16} />
                      <div>
                        <span className="block text-xs text-gray-500 font-mono">Lab Hours</span>
                        <span className="font-medium">Mon - Sat: 5:00 PM - 9:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </ScrollRevealCard>

            {/* Social Hub Links Card */}
            <ScrollRevealCard delay={300}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm flex flex-col gap-4">
                <h3 className="text-lg font-bold text-white tracking-tight">Connect via Social Channels</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Join our online discord server for live discussions, CTF writeups, and security news updates.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded bg-neutral-900 border border-white/10 hover:border-[#61dca3] text-gray-300 hover:text-[#61dca3] transition-all text-xs font-semibold"
                  >
                    <FaDiscord size={18} className="text-[#5865F2]" />
                    <span>Discord Server</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded bg-neutral-900 border border-white/10 hover:border-[#61dca3] text-gray-300 hover:text-white transition-all text-xs font-semibold"
                  >
                    <FaGithub size={18} />
                    <span>GitHub Org</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded bg-neutral-900 border border-white/10 hover:border-[#61b3dc] text-gray-300 hover:text-[#61b3dc] transition-all text-xs font-semibold"
                  >
                    <FaLinkedinIn size={18} className="text-[#0A66C2]" />
                    <span>LinkedIn Page</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded bg-neutral-900 border border-white/10 hover:border-white text-gray-300 hover:text-white transition-all text-xs font-semibold"
                  >
                    <FaXTwitter size={18} />
                    <span>Twitter / X</span>
                  </a>
                </div>
              </div>
            </ScrollRevealCard>

          </div>

        </section>

        {/* Section 3: FAQ Section */}
        <section className="pt-8 border-t border-white/5">
          <div className="mb-12">
            <p className="text-[#61dca3] font-mono text-sm tracking-wider uppercase mb-3">
              Clarifications & Help
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Quick answers to common inquiries regarding society participation, events, and administration.
            </p>
          </div>

          <div className="flex flex-col gap-4 max-w-4xl">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
};

export default Contact;
