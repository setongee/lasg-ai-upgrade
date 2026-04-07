import {
  ArrowRight,
  Check,
  MapPin,
  Menu,
  Message,
  Minus,
  Plus,
  Safari,
  Xmark,
} from 'iconoir-react';
import { useState } from 'react';
import Wrapper from '../../shared/Wrapper/Wrapper';
import './guide.css';
import CyberRiskOverview from './RiskOverview';

const PDF_URL =
  'https://res.cloudinary.com/dirmxkznt/image/upload/v1773876046/Title-_2026_Cybersecurity_Guidelines_for_Businesses_Public_Institutions_in_Lagos_State_1__compressed_fnueaw.pdf';

const PDF_FULL_URL =
  'https://res.cloudinary.com/dirmxkznt/raw/upload/v1774204976/LASG_CYBERSECURITY_GUIDELINES_2_epzgbf.docx';

const faqs = [
  {
    q: 'Are these guidelines mandatory for Lagos businesses?',
    a: 'These guidelines are advisory — focused on empowerment, awareness and resilience rather than enforcement. However, the underlying laws (Cybercrime Act 2024, NDPA 2023) carry legal obligations all organisations must comply with.',
  },
  {
    q: 'What does the 72-hour incident reporting requirement mean?',
    a: 'Under the Cybercrime Act 2024, organisations that suffer a cyber incident must report to ngCERT within 72 hours of becoming aware. This applies to all businesses handling sensitive data.',
  },
  {
    q: "I'm a small business — where do I start?",
    a: 'Start with the five foundational controls: enable MFA, use a password manager, set up automatic software updates, separate your guest Wi-Fi, and establish a data backup routine. These cost little but dramatically reduce risk.',
  },
  {
    q: 'What is the Lagos State Cybersecurity Advisory Board?',
    a: "Nigeria's first state-level Cybersecurity Advisory Board, established under the Lagos State Ministry of Innovation, Science & Technology. It brings together government officials, industry leaders and global cybersecurity experts.",
  },
  {
    q: 'How does this relate to the NDPA 2023?',
    a: 'The Nigeria Data Protection Act 2023 requires organisations handling personal data to minimise collection, encrypt stored data, and notify the NDPC and affected users after a breach. These guidelines translate those requirements into practical steps.',
  },
];

const audienceCards = [
  {
    emoji: '🏪',
    badge: 'SMEs & Startups',
    title: 'Small & Medium Businesses',
    items: [
      'MFA & password managers',
      'Separate guest Wi-Fi',
      'Quarterly awareness training',
      'Automated data backups',
    ],
    featured: false,
  },
  {
    emoji: '🏢',
    badge: 'Enterprises',
    title: 'Medium & Large Enterprises',
    items: [
      'CISO & Data Protection Officer',
      'SIEM & IDS/IPS systems',
      'Board-level cyber oversight',
      'NIST / ISO 27001 frameworks',
    ],
    featured: true,
  },
  {
    emoji: '🏛️',
    badge: 'Government MDAs',
    title: 'Public Institutions',
    items: [
      'Privacy by Design principles',
      'Centralised SOC monitoring',
      'Privileged Access Management',
      'Inter-agency collaboration',
    ],
    featured: false,
  },
];

const enterpriseControls = [
  {
    icon: '🔐',
    title: 'Identity & Access Mgmt',
    desc: 'Enforce least-privilege access across all users and systems.',
  },
  {
    icon: '📊',
    title: 'SIEM Monitoring',
    desc: 'Centralised security event correlation and real-time alerting.',
  },
  {
    icon: '🛡️',
    title: 'IDS / IPS Systems',
    desc: 'Detect and automatically block intrusions before damage occurs.',
  },
  {
    icon: '🔑',
    title: 'MFA Enforcement',
    desc: 'Multi-Factor Authentication on all critical access points.',
  },
  {
    icon: '🌐',
    title: 'Network Segmentation',
    desc: 'Isolate critical infrastructure to contain breach spread.',
  },
  {
    icon: '💻',
    title: 'Endpoint Security',
    desc: 'Continuous monitoring and protection of all network devices.',
  },
];

const testimonials = [
  {
    initials: 'AO',
    name: 'A. Okonkwo',
    role: 'Fintech Founder, Lagos',
    quote:
      'Most cybersecurity resources feel overwhelming. These guidelines are different — clear, practical and immediately actionable for any Lagos business.',
  },
  {
    initials: 'CU',
    name: 'C. Uche',
    role: 'CTO, Enterprise Lagos',
    quote:
      'For the first time our team has a shared framework aligned to Nigerian law. The NDPA and Cybercrime Act sections alone are invaluable for any CTO.',
  },
  {
    initials: 'FI',
    name: 'F. Ibrahim',
    role: 'Director, Lagos State MDA',
    quote:
      "As a government MDA, this is the first document that speaks directly to our citizen data responsibilities in a way that's genuinely usable.",
  },
];

const steps = [
  {
    icon: '🔍',
    title: 'Self-Assess',
    desc: 'Identify your current vulnerabilities across devices, accounts and data.',
  },
  {
    icon: '🛡️',
    title: 'Apply Controls',
    desc: 'Implement foundational security controls — MFA, backups, patching.',
  },
  {
    icon: '🧑‍💻',
    title: 'Train Your Team',
    desc: 'Build awareness through quarterly phishing simulations and sessions.',
  },
  {
    icon: '✅',
    title: 'Stay Compliant',
    desc: 'Report incidents, protect data and collaborate with state initiatives.',
  },
];

const features = [
  {
    icon: '🏠',
    title: 'Protection-Ready Practices',
    desc: 'Foundational controls mapped to your organisation size and risk profile.',
  },
  {
    icon: '💰',
    title: 'Low-Cost, High-Impact',
    desc: 'Most foundational controls cost nothing to implement and dramatically cut risk.',
  },
  {
    icon: '📱',
    title: 'Manage Everything Online',
    desc: 'From incident reporting to vendor assessments — all digitally accessible.',
  },
  {
    icon: '⚙️',
    title: 'Quick Compliance Path',
    desc: 'Aligned to the Cybercrime Act 2024 and NDPA 2023 for fast legal alignment.',
  },
  {
    icon: '🏙️',
    title: 'Trusted by Lagos State',
    desc: "Issued by Nigeria's first State Cybersecurity Advisory Board under MIST.",
  },
];

const ctaPills = [
  'Self-assessment',
  'Foundational controls',
  'Staff training',
  'State collaboration',
  'Vendor assessment',
  'Monitor & evaluate',
];

// ── Sub-components ──────────────────────────────────────────

function ShieldIcon({ size = 18, stroke = '#fff' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function DownloadIcon({ size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <div className="faq-q" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <div className={`faq-btn${open ? ' open' : ''}`}>
          {open ? <Minus fontSize={11} /> : <Plus fontSize={11} />}
        </div>
      </div>
      {open && <div className="faq-a open">{a}</div>}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

export default function LagosCyberSafe() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="lagoscyber">
      {/* NAV */}

      <nav>
        <Wrapper customClass="flex justify-between items-center !w-full !sm:w-[90%]">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <ShieldIcon />
            </div>
            <div className="flex flex-col -mt-1 gap-[2px]">
              <span>Lagos Cybersecurity Guide</span>
              <small>MIST · 2026 Official Guidelines</small>
            </div>
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <Xmark size={24} /> : <Menu size={24} />}
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <a href="#" className="active" onClick={() => setMobileMenuOpen(false)}>
                Home
              </a>
            </li>
            <li>
              <a href="#overview" onClick={() => setMobileMenuOpen(false)}>
                Guidelines
              </a>
            </li>
            <li>
              <a href="#audience" onClick={() => setMobileMenuOpen(false)}>
                For SMEs
              </a>
            </li>
            <li>
              <a href="#footer" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </a>
            </li>
          </ul>
          <div className={`nav-actions ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#overview" className="btn-nav-ghost" onClick={() => setMobileMenuOpen(false)}>
              Learn More
            </a>
            <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="btn-nav-solid">
              Download PDF
            </a>
          </div>
        </Wrapper>
      </nav>

      {/* HERO */}
      <section className="hero">
        <Wrapper customClass="flex mx-auto! justify-between !w-full !sm:w-[90%]">
          <div className="hero-blob" />
          <div className="hero-left">
            <h1>
              Secure Your Business
              <br />
              for <em>Digital Lagos</em>
            </h1>
            <p>
              2026 cybersecurity guidelines for SMEs, enterprises and public institutions —
              practical, scalable and built for Nigeria's fastest-growing digital economy.
            </p>
            <div className="hero-btns">
              <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <DownloadIcon /> Download Guidelines
              </a>
              <a href="#overview" className="btn-secondary">
                How It Works
              </a>
            </div>
          </div>

          {/* right */}
          <div className="hero-right">
            <CyberRiskOverview />
          </div>
        </Wrapper>
      </section>

      {/* TAGLINE / STEPS */}
      <Wrapper customClass="!w-full !sm:w-[90%]">
        <section className="tagline" id="overview">
          <h2>
            Cybersecurity Made <span>Ridiculously Simple</span>
          </h2>
          <p>
            These guidelines give every Lagos organisation a clear, step-by-step path to protection
            — from a quick self-assessment to full compliance with national law.
          </p>
          <div className="steps-row grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-3 lg:gap-0">
            {steps.map((s, i) => (
              <div className="flex">
                <div className="step-box" key={s.title}>
                  <div className="step-icon-wrap">{s.icon}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="step-arrow hidden lg:block" key={`arrow-${i}`}>
                    <ArrowRight />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </Wrapper>

      {/* FEATURES SPLIT */}
      <div className="bg-[#f7faf8]">
        <Wrapper customClass="!w-full !sm:w-[90%]">
          <section className="features-split">
            <div className="features-photo">
              <div className="features-photo-bg">
                <div className="features-photo-inner">
                  <div className="big-num">$15.3B</div>
                  <div className="big-lbl">Lagos startup ecosystem value</div>
                  <div className="stat-pills">
                    <div className="stat-pill">22M+ active digital users</div>
                    <div className="stat-pill">₦53.4B lost in 2024 alone</div>
                    <div className="stat-pill">Africa's fastest-growing digital economy</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="features-right">
              <div className="eyebrow">Why It Matters</div>
              <h2>
                Your Better <span>Cyber Defence</span>
              </h2>
              <p>
                We believe cybersecurity should be accessible, practical and worry-free. That's why
                we've translated national policy into actions any organisation can take today.
              </p>
              <div className="feat-list">
                {features.map((f) => (
                  <div className="feat-row" key={f.title}>
                    <div className="feat-row-icon">{f.icon}</div>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Wrapper>
      </div>

      {/* AUDIENCE */}
      <Wrapper className="!w-full">
        <section className="audience-section" id="audience">
          <div className="section-head">
            <div className="eyebrow">Who This Covers</div>
            <h2>
              Built for Every <span>Lagos Organisation</span>
            </h2>
          </div>
          <div className="aud-grid">
            {audienceCards.map((c) => (
              <div className={`aud-card${c.featured ? ' featured' : ''}`} key={c.title}>
                <div className="aud-emoji">{c.emoji}</div>
                <span className="aud-badge">{c.badge}</span>
                <h3>{c.title}</h3>
                <ul>
                  {c.items.map((item) => (
                    <li key={item}>
                      <span className="li-check">
                        <Check />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Wrapper>

      {/* LEGAL */}
      <div className="bg-[#f7faf8]">
        <Wrapper customClass="!w-full !sm:w-[90%]">
          <section className="legal-section">
            <div className="section-head">
              <div className="eyebrow">National Legal Alignment</div>
              <h2>
                Your <span>Legal Responsibilities</span>
              </h2>
            </div>
            <div className="legal-grid">
              <div className="leg-card dark">
                <span className="leg-tag lt-dark">Cybercrime Act 2024</span>
                <h3>Cybercrime Responsibilities</h3>
                <ul>
                  {[
                    'Report incidents to ngCERT within 72 hours',
                    'Maintain a documented incident response plan',
                    'Educate all staff on cybercrime awareness',
                    'Secure management of national infrastructure',
                  ].map((item) => (
                    <li key={item}>
                      <span className="arr">
                        <ArrowRight fontSize={9} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="leg-card light">
                <span className="leg-tag lt-green">NDPA 2023</span>
                <h3>Data Protection Responsibilities</h3>
                <ul>
                  {[
                    'Apply data minimisation at all times',
                    'Encrypt and securely store all personal data',
                    'Notify NDPC & customers after any breach',
                    'Assess all third-party vendor data practices',
                  ].map((item) => (
                    <li key={item}>
                      <span className="arr">
                        <ArrowRight fontSize={9} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </Wrapper>
      </div>

      {/* ENTERPRISE */}
      <div className="bg-[#f7faf8]">
        <Wrapper customClass="!w-full">
          <section className="enterprise-section">
            <div className="section-head">
              <div className="eyebrow">Enterprise Architecture</div>
              <h2>
                Core Technical <span>Security Controls</span>
              </h2>
            </div>
            <div className="ent-grid">
              {enterpriseControls.map((c) => (
                <div className="ent-card" key={c.title}>
                  <div className="ent-icon">{c.icon}</div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </Wrapper>
      </div>

      {/* TESTIMONIALS */}
      <section className="testi-section">
        <div className="section-head">
          <div className="eyebrow">Why It Matters</div>
          <h2>
            Don't Just Take <span>Our Word For It</span>
          </h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((t) => (
            <div className="testi-card" key={t.name}>
              <div className="testi-quote">"</div>
              <p>{t.quote}</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="section-head">
          <div className="eyebrow">Common Questions</div>
          <h2>
            Frequently Asked <span>Questions</span>
          </h2>
        </div>
        <div className="faq-wrap">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-blob" />
        <div className="cta-blob2" />
        <div className="cta-inner">
          <h2>
            Build a <span>Cyber-Secure Lagos</span> Starting Today
          </h2>
          <p>
            Cybersecurity is a shared responsibility. Every organisation that acts makes Lagos
            stronger, safer and more competitive on the global stage.
          </p>
          <div className="cta-pills">
            {ctaPills.map((p, i) => (
              <div className="cta-pill" key={p}>
                <div className="cta-pill-num">{i + 1}</div>
                {p}
              </div>
            ))}
          </div>
          <a href={PDF_FULL_URL} target="_blank" rel="noopener noreferrer" className="btn-cta-main">
            <DownloadIcon size={16} /> Download the Full Guidelines PDF
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>Lagos CyberSafe 2026</h3>
            <p>
              Official cybersecurity guidelines issued by the Lagos State Ministry of Innovation,
              Science & Technology.
            </p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#overview">Guidelines</a>
              </li>
              <li>
                <a href="#audience">For SMEs</a>
              </li>
              <li>
                <a href="#audience">For Enterprises</a>
              </li>
              <li>
                <a href="#faq">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Nigeria Computer Emergency Response Team</h4>
            <ul>
              <li>
                <span className="flex items-center gap-2 border-b-2 border-green-950 pb-2">
                  <Message fontSize={11} className="mt-[2px] text-green-300" /> incident@cert.gov.ng
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2 border-b-2 border-green-950 pb-2">
                  <Safari fontSize={11} className="mt-[2px] text-green-300" /> https://cert.gov.ng/
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2 border-b-amber-50">
                  <MapPin fontSize={11} className="mt-[2px] text-green-300" /> Abuja, Nigeria
                </span>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Lagos MIST Social Media</h4>
            <ul>
              <li>
                <a href="https://twitter.com/lagosmist" target="_blank" rel="noopener noreferrer">
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/lagos-state-ministry-of-innovation-science-and-technology/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/lagosmist"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/lagosmist"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Lagos State Government. All rights reserved.</span>
          <div className="footer-social">
            <div className="social-dot">𝕏</div>
            <div className="social-dot">in</div>
            <div className="social-dot">f</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
