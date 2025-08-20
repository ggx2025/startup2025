import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, ChevronRight, Menu, X, Phone, Mail, MapPin, CheckCircle2, ArrowRight, Building2, Handshake, Presentation, BarChart4, Users, Code2, Wrench, Calculator } from "lucide-react";

// --- Lightweight hash-router (no external router needed) ---
const routes = {
  "/": "Home",
  "/about": "About",
  "/services": "Services",
  "/contact": "Contact",
  // Service detail pages
  "/services/investor-connects": "Investor Connects",
  "/services/fundraising-support": "Fundraising Support",
  "/services/pitch-decks-templates": "Pitch Deck & Legal Templates",
  "/services/growth-marketing": "Growth Marketing",
  "/services/mentorship": "1:1 Mentorship",
  "/services/web-app-dev": "Web & App Development",
  "/services/tech-support": "Technical Support",
  "/services/finance-accounting": "Financial & Accounting",
};

const brand = {
  name: "Launch & Lift",
  domain: "launchandlift.com",
  // Light theme colors
  purple: "#8B78F3",
  gold: "#E9C46A",
  green: "#2A9D8F",
  indigo: "#6C63FF",
  bg: "#faf8ff",
  text: "#1f2937",
};

function useHashRoute() {
  const [path, setPath] = useState(() => window.location.hash.replace("#", "") || "/");
  useEffect(() => {
    const onHash = () => setPath(window.location.hash.replace("#", "") || "/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [path, (p) => (window.location.hash = p)] as const;
}

const Container: React.FC<{ children: React.ReactNode; className?: string }>=({ children, className }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className || ""}`}>{children}</div>
);

const Pill: React.FC<{ children: React.ReactNode; className?: string }>=({ children, className }) => (
  <span className={`inline-flex items-center rounded-full border border-black/5 bg-white/70 px-3 py-1 text-sm shadow-sm backdrop-blur ${className||""}`}>{children}</span>
);

const GradientBG: React.FC = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
      style={{ background: `radial-gradient( circle at 30% 30%, ${brand.purple}, transparent 60% )` }} />
    <div className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
      style={{ background: `radial-gradient( circle at 70% 70%, ${brand.green}, transparent 60% )` }} />
    <div className="absolute top-1/2 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
      style={{ background: `radial-gradient( circle at 50% 50%, ${brand.gold}, transparent 60% )` }} />
  </div>
);

// ---------------- NAVBAR with FIXED DROPDOWNS ----------------
const Navbar: React.FC<{ onNavigate: (p: string)=>void; active: string }>=({ onNavigate, active }) => {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | "services" | "company">(null);

  // Close on route change (for mobile, or when clicking a menu item)
  useEffect(()=>{
    const onHash = () => { setOpen(false); setOpenMenu(null); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  },[]);

  const NavButton = ({ children, onClick }: any) => (
    <button onClick={onClick} className="relative px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/60 transition">{children}</button>
  );

  // KEY FIXES:
  // 1) Menu is sibling of trigger inside a wrapper that handles pointer leave.
  // 2) Remove the vertical gap (no mt-2). Use border/shadow to separate.
  // 3) Keep menu open while pointer is over it, and add z-50 so it stays clickable above others.
  const Dropdown: React.FC<{ show: boolean; onClose: ()=>void; children: React.ReactNode }> = ({ show, onClose, children }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{opacity:0, y:6}}
          animate={{opacity:1, y:0}}
          exit={{opacity:0, y:6}}
          onMouseEnter={()=>{/* keep open */}}
          onMouseLeave={onClose}
          className="absolute left-0 top-full z-50 w-80 rounded-2xl border border-black/5 bg-white p-2 shadow-xl"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const MenuItem = ({ to, icon: Icon, label, desc }: any) => (
    <a href={`#${to}`} className="group flex gap-3 rounded-xl p-2 hover:bg-gray-50">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gray-100"><Icon className="h-5 w-5"/></div>
      <div className="text-left">
        <div className="text-sm font-semibold">{label}</div>
        {desc && <div className="text-xs text-gray-500">{desc}</div>}
      </div>
    </a>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[rgba(255,255,255,0.65)] backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white shadow">
            <Rocket className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold" style={{ color: brand.indigo }}>{brand.name}</div>
            <div className="text-xs text-gray-500">{brand.domain}</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="relative hidden items-center gap-2 md:flex">
          {/* Services */}
          <div className="relative"
               onMouseEnter={()=>setOpenMenu("services")}
               onFocus={()=>setOpenMenu("services")}
          >
            <NavButton onClick={()=>setOpenMenu(openMenu==='services'?null:'services')}>Services</NavButton>
            <Dropdown show={openMenu==='services'} onClose={()=>setOpenMenu(null)}>
              <div className="grid gap-1">
                <MenuItem to="/services/investor-connects" icon={Handshake} label="Investor Connects" desc="Warm VC & angel intros"/>
                <MenuItem to="/services/fundraising-support" icon={Building2} label="Fundraising Support" desc="Narrative, CRM & data room"/>
                <MenuItem to="/services/pitch-decks-templates" icon={Presentation} label="Pitch & Legal Templates" desc="Decks, SAFE/SAFT, ESOP"/>
                <MenuItem to="/services/growth-marketing" icon={BarChart4} label="Growth Marketing" desc="Acquisition & lifecycle"/>
                <MenuItem to="/services/mentorship" icon={Users} label="1:1 Mentorship" desc="Operator coaching"/>
                <MenuItem to="/services/web-app-dev" icon={Code2} label="Web & App Development" desc="MVP to scale"/>
                <MenuItem to="/services/tech-support" icon={Wrench} label="Technical Support" desc="On‑call engineers"/>
                <MenuItem to="/services/finance-accounting" icon={Calculator} label="Finance & Accounting" desc="Runway & reporting"/>
              </div>
            </Dropdown>
          </div>

          {/* Company (About + Contact) */}
          <div className="relative"
               onMouseEnter={()=>setOpenMenu("company")}
               onFocus={()=>setOpenMenu("company")}
          >
            <NavButton onClick={()=>setOpenMenu(openMenu==='company'?null:'company')}>Company</NavButton>
            <Dropdown show={openMenu==='company'} onClose={()=>setOpenMenu(null)}>
              <div className="grid gap-1">
                <MenuItem to="/about" icon={Rocket} label="About" desc="Who we are"/>
                <MenuItem to="/contact" icon={Phone} label="Contact" desc="Book a consult"/>
              </div>
            </Dropdown>
          </div>
        </nav>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="rounded-xl p-2 hover:bg-white/60">
            {open ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
          </button>
        </div>
      </Container>

      {/* Mobile menus */}
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden">
            <Container className="flex flex-col gap-2 py-3">
              <details className="rounded-xl bg-white p-3 shadow" open>
                <summary className="cursor-pointer font-semibold">Services</summary>
                <div className="mt-2 grid gap-1 text-sm">
                  <a href="#/services/investor-connects" className="rounded px-2 py-1 hover:bg-gray-50">Investor Connects</a>
                  <a href="#/services/fundraising-support" className="rounded px-2 py-1 hover:bg-gray-50">Fundraising Support</a>
                  <a href="#/services/pitch-decks-templates" className="rounded px-2 py-1 hover:bg-gray-50">Pitch & Legal Templates</a>
                  <a href="#/services/growth-marketing" className="rounded px-2 py-1 hover:bg-gray-50">Growth Marketing</a>
                  <a href="#/services/mentorship" className="rounded px-2 py-1 hover:bg-gray-50">1:1 Mentorship</a>
                  <a href="#/services/web-app-dev" className="rounded px-2 py-1 hover:bg-gray-50">Web & App Development</a>
                  <a href="#/services/tech-support" className="rounded px-2 py-1 hover:bg-gray-50">Technical Support</a>
                  <a href="#/services/finance-accounting" className="rounded px-2 py-1 hover:bg-gray-50">Finance & Accounting</a>
                </div>
              </details>
              <details className="rounded-xl bg-white p-3 shadow">
                <summary className="cursor-pointer font-semibold">Company</summary>
                <div className="mt-2 grid gap-1 text-sm">
                  <a href="#/about" className="rounded px-2 py-1 hover:bg-gray-50">About</a>
                  <a href="#/contact" className="rounded px-2 py-1 hover:bg-gray-50">Contact</a>
                </div>
              </details>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

// ---------------- HERO ----------------
const Hero: React.FC<{ onNavigate:(p:string)=>void }>=({ onNavigate }) => (
  <section className="relative">
    <GradientBG/>
    <Container className="py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration: 0.6 }}>
          <Pill className="mb-4" >
            <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: brand.purple }} />
            From Idea to IPO — We’ve got you
          </Pill>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: brand.text }}>
            Launch faster. Lift higher.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {brand.name} is your full‑stack partner for capital, customers, code and compliance — all under one roof.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#/services"
              className="group inline-flex items-center rounded-2xl border border-black/5 bg-white px-5 py-3 font-medium shadow hover:shadow-md">
              Explore Services <ChevronRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5"/>
            </a>
            <a href="#/contact" className="inline-flex items-center rounded-2xl px-5 py-3 font-medium shadow" style={{ background: brand.purple, color: "white"}}>
              Book a Free Consult
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/>Founder‑friendly</div>
            <div className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/>Flexible engagement</div>
            <div className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/>Global network</div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="relative grid gap-4">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="text-sm font-semibold" style={{ color: brand.indigo }}>Your runway, extended</div>
              <div className="mt-2 text-3xl font-extrabold" style={{ color: brand.text }}>Fundraising & GTM, done right</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {["Investor Connects","Pitch Decks","Growth Experiments","Dev Sprints"].map((t)=> (
                  <div className="rounded-xl border border-black/5 bg-gray-50 px-3 py-2" key={t}>{t}</div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-r from-white via-[#fff7e6] to-[#effcf9] p-6 shadow-lg">
              <div className="text-sm font-semibold" style={{ color: brand.green }}>What you get</div>
              <ul className="mt-3 grid list-disc gap-1 pl-5 text-sm text-gray-700">
                <li>Strategic guidance from operators</li>
                <li>Plug‑and‑play growth & engineering</li>
                <li>Templates that save weeks of work</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  </section>
);

// ---------------- FULL-STACK SECTION ----------------
const FullStackSection: React.FC = () => (
  <section>
    <Container className="py-8">
      <div className="rounded-3xl border border-black/5 bg-gradient-to-br from-white via-[#fff7e6] to-[#effcf9] p-8 shadow">
        <Pill>Full‑stack services</Pill>
        <h3 className="mt-3 text-2xl font-extrabold">One partner for strategy, growth, product and ops</h3>
        <p className="mt-2 text-gray-700 max-w-3xl">We combine investor readiness, growth marketing, product engineering, tech support and finance under a single roof. Mix‑and‑match modules or run end‑to‑end — we plug into your team as a fractional squad.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          {["Capital readiness","GTM & lifecycle","Design & engineering","Ops & finance"].map((t)=> (
            <div key={t} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">{t}</div>
          ))}
        </div>
      </div>
    </Container>
  </section>
);

const ServiceCard: React.FC<{ icon: any; title: string; desc: string; to: string; hue: string }>=({ icon: Icon, title, desc, to, hue }) => (
  <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
    className="group rounded-3xl border border-black/5 bg-white p-6 shadow-sm hover:shadow-md">
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: hue }}>
        <Icon className="h-5 w-5"/>
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <p className="mt-3 text-sm text-gray-600">{desc}</p>
    <a href={`#${to}`} className="mt-4 inline-flex items-center text-sm font-semibold">
      Learn more <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5"/>
    </a>
  </motion.div>
);

const ServicesOverview: React.FC = () => (
  <section id="services" className="relative">
    <Container className="py-16">
      <div className="mx-auto max-w-3xl text-center">
        <Pill>Full‑stack startup solutions</Pill>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">What we can do for you</h2>
        <p className="mt-3 text-gray-600">Pick a lane or combine streams. We meet you where you are — from problem/solution fit to scaling.</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceCard icon={Handshake} title="Investor Connects" hue="#efe9ff" to="/services/investor-connects"
          desc="Warm intros to angels & VC partners matched to your stage, sector & geography."/>
        <ServiceCard icon={Building2} title="Fundraising Support" hue="#fff2db" to="/services/fundraising-support"
          desc="Narrative, data room, pipeline & CRM setup to run an efficient raise."/>
        <ServiceCard icon={Presentation} title="Pitch Deck & Legal Templates" hue="#ecfff7" to="/services/pitch-decks-templates"
          desc="Pro‑grade pitch deck, SAFT/SAFE, ESOP, NDAs and more. Battle‑tested by founders."/>
        <ServiceCard icon={BarChart4} title="Growth Marketing" hue="#f5f0ff" to="/services/growth-marketing"
          desc="Acquisition sprints, lifecycle automation & analytics to unlock traction."/>
        <ServiceCard icon={Users} title="1:1 Mentorship" hue="#effcf9" to="/services/mentorship"
          desc="Operator‑led coaching on product, GTM, org design and founder mindset."/>
        <ServiceCard icon={Code2} title="Web & App Development" hue="#f0fff4" to="/services/web-app-dev"
          desc="Design, frontend, backend & infra to build v1 fast and scale safely."/>
        <ServiceCard icon={Wrench} title="Tech Support" hue="#eef2ff" to="/services/tech-support"
          desc="On‑call engineers for incidents, performance & security hardening."/>
        <ServiceCard icon={Calculator} title="Finance & Accounting" hue="#fff7e6" to="/services/finance-accounting"
          desc="Book‑keeping, runway modeling, budgeting & investor reporting."/>
      </div>
    </Container>
  </section>
);

const SectionShell: React.FC<{ title: string; subtitle: string; icon: any; bullets: string[]; cta?: { label: string; to: string } }>=({ title, subtitle, icon: Icon, bullets, cta }) => (
  <Container className="py-14">
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm shadow">
          <Icon className="h-4 w-4"/> <span>{title}</span>
        </div>
        <h3 className="mt-4 text-3xl font-extrabold">{subtitle}</h3>
        <ul className="mt-4 space-y-2 text-gray-700">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5"/> <span>{b}</span></li>
          ))}
        </ul>
        {cta && (
          <a href={`#${cta.to}`} className="mt-6 inline-flex items-center rounded-2xl border border-black/5 bg-white px-5 py-3 font-medium shadow hover:shadow-md">
            {cta.label} <ChevronRight className="ml-2 h-4 w-4"/>
          </a>
        )}
      </div>
      <div className="rounded-3xl border border-black/5 bg-gradient-to-br from-white via-[#fff7e6] to-[#effcf9] p-6 shadow">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {["Founder‑led","Operator‑grade","Flexible","Global","Hands‑on","Outcome‑driven"].map((t)=> (
            <div className="rounded-xl border border-black/5 bg-white px-3 py-2" key={t}>{t}</div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-gray-700 shadow">
          "We shipped our MVP in 6 weeks and closed a pre‑seed — thanks to Launch & Lift!" — Ananya, Fintech founder
        </div>
      </div>
    </div>
  </Container>
);

// --- Service Detail Pages ---
const ServicePage: React.FC<{ route: string }>=({ route }) => {
  const content = useMemo(() => ({
    "/services/investor-connects": {
      title: "Investor Connects",
      subtitle: "Warm intros to the right money — not just any money.",
      icon: Handshake,
      bullets: [
        "Curated list of angels & funds by stage, sector & geo",
        "Warm introductions via our operator network",
        "Data‑backed ICP for investors & outreach strategy",
        "CRM setup, pipeline, email scripts & tracking",
      ],
      packages: [
        { name: "Starter", price: "₹49k", items: ["20 investor targets","Intro email scripts","CRM template"] },
        { name: "Pro", price: "₹1.2L", items: ["60 targets + warm intros","Narrative review","Weekly pipeline standup"] },
        { name: "Custom", price: "Talk to us", items: ["Partner‑led BD","Demo days","Strategic angels hunt"] },
      ],
      outcomes: ["Faster first meetings","Higher hit‑rate on follow‑ups","Clear pipeline analytics"],
      process: ["Discovery & thesis","Investor ICP & long‑list","Warm intros & outreach","Follow‑ups & tracking"],
    },
    "/services/fundraising-support": {
      title: "Fundraising Support",
      subtitle: "Run a tight, data‑driven raise with speed and clarity.",
      icon: Building2,
      bullets: [
        "Narrative crafting and memo development",
        "Data room checklist & audits (metrics, compliance)",
        "Term sheet review & negotiation support",
        "Weekly standups until money hits the bank",
      ],
      packages: [
        { name: "Prep", price: "₹79k", items: ["Narrative + memo","KPIs & cohort setup","Data room checklist"] },
        { name: "Drive", price: "₹1.8L", items: ["Investor pipeline","Meeting readiness","Due‑diligence support"] },
      ],
      outcomes: ["Compelling story","Clean data room","Confident close"],
      process: ["Audit","Narrative & metrics","Outreach","Diligence & close"],
    },
    "/services/pitch-decks-templates": {
      title: "Pitch Deck & Legal Templates",
      subtitle: "Beautiful decks and founder‑friendly templates, ready to use.",
      icon: Presentation,
      bullets: [
        "Investor deck, teaser, and product one‑pagers",
        "SAFE/SAFT, ESOP, NDAs, MoUs — customizable",
        "Template library & walkthroughs",
        "Optional legal review via partners",
      ],
      packages: [
        { name: "Deck Sprint", price: "₹59k", items: ["3 rounds of design","Story coaching","Export kit"] },
        { name: "Legal Kit", price: "₹39k", items: ["SAFE/SAFT","ESOP & NDA","Filling guide"] },
      ],
      outcomes: ["Investor‑ready materials","Time saved","Consistent brand"],
      process: ["Content intake","Design & iterate","Finalize & export"],
    },
    "/services/growth-marketing": {
      title: "Growth Marketing",
      subtitle: "Acquire, activate, retain — and measure what matters.",
      icon: BarChart4,
      bullets: [
        "Full‑funnel strategy (paid, organic, PLG)",
        "Lifecycle automation (email, push, in‑app)",
        "Analytics instrumentation & dashboards",
        "Experiment design & rapid iteration",
      ],
      packages: [
        { name: "Traction", price: "₹99k", items: ["Channel tests","Landing pages","Attribution setup"] },
        { name: "Lifecycle", price: "₹1.5L", items: ["Drip campaigns","CRM automation","Churn playbooks"] },
      ],
      outcomes: ["Lower CAC","Higher activation","Clear metrics"],
      process: ["Baseline & goals","Experiments","Scale winners","Ops & reporting"],
    },
    "/services/mentorship": {
      title: "1:1 Mentorship",
      subtitle: "Operator coaching for product, GTM and leadership.",
      icon: Users,
      bullets: [
        "Weekly/bi‑weekly sessions with seasoned operators",
        "OKR planning, roadmapping & stakeholder mgmt",
        "Founder mindset & resilience coaching",
        "Access to community & office hours",
      ],
      packages: [
        { name: "Coach", price: "₹29k/mo", items: ["2 sessions/mo","Slack support","Resources"] },
        { name: "Advisor", price: "₹55k/mo", items: ["4 sessions/mo","Reviews & docs","Warm intros"] },
      ],
      outcomes: ["Sharper decisions","Better execution","Less founder stress"],
      process: ["Goal setting","Cadence","Reviews","Reflections"],
    },
    "/services/web-app-dev": {
      title: "Web & App Development",
      subtitle: "Build v1 fast, scale with confidence.",
      icon: Code2,
      bullets: [
        "Design systems, frontend, backend & DevOps",
        "MVP builds, integrations & API development",
        "Cloud infra, CI/CD & security best practices",
        "Fractional CTO & product management",
      ],
      packages: [
        { name: "MVP Sprint", price: "₹3.5L+", items: ["4–6 week build","Design + FE/BE","Testing & deploy"] },
        { name: "Scale", price: "Custom", items: ["Performance","Observability","Security hardening"] },
      ],
      outcomes: ["Ship sooner","Stable releases","Scalable stack"],
      process: ["Scope","Design & arch","Build & QA","Launch & iterate"],
    },
    "/services/tech-support": {
      title: "Technical Support",
      subtitle: "Your on‑call engineering team, when it matters.",
      icon: Wrench,
      bullets: [
        "24/7 incident response & on‑call",
        "Performance tuning & cost optimization",
        "Security hardening & audits",
        "SLA‑backed support plans",
      ],
      packages: [
        { name: "Essentials", price: "₹49k/mo", items: ["Business hours","Incident playbooks","Monthly review"] },
        { name: "SLA+", price: "₹1.2L/mo", items: ["24/7 on‑call","SLOs","Compliance checks"] },
      ],
      outcomes: ["Lower downtime","Faster MTTR","Happier users"],
      process: ["Onboarding","Runbooks","Monitoring","Reviews"],
    },
    "/services/finance-accounting": {
      title: "Financial & Accounting",
      subtitle: "Clarity on runway, budgets and reporting.",
      icon: Calculator,
      bullets: [
        "Book‑keeping & monthly closes",
        "Runway modeling & scenario planning",
        "Budgeting & cost controls",
        "Investor updates & board reporting",
      ],
      packages: [
        { name: "Books", price: "₹35k/mo", items: ["Monthly closes","GST & filings","Reports"] },
        { name: "FP&A", price: "₹85k/mo", items: ["Budget & forecast","Unit economics","Board pack"] },
      ],
      outcomes: ["Clean books","Extend runway","Confident decisions"],
      process: ["Setup","Monthly close","Forecast","Reporting"],
    },
  } as const), []);

  const data = content[route as keyof typeof content];
  if (!data) return null;
  return (
    <section>
      <SectionShell title={data.title} subtitle={data.subtitle} icon={data.icon} bullets={data.bullets} cta={{ label: "Book a consult", to: "/contact" }} />
      <Container className="pb-4">
        <h4 className="text-xl font-bold">Packages</h4>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.packages.map((p,i)=> (
            <div key={i} className="rounded-2xl border border-black/5 bg-white p-5 shadow">
              <div className="text-sm font-semibold">{p.name}</div>
              <div className="mt-1 text-2xl font-extrabold">{p.price}</div>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {p.items.map((it: string, j: number)=> (<li key={j} className="flex gap-2"><CheckCircle2 className="h-4 w-4"/> {it}</li>))}
              </ul>
              <a href="#/contact" className="mt-4 inline-block rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-medium shadow hover:shadow-md">Get started</a>
            </div>
          ))}
        </div>
      </Container>
      <Container className="pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h4 className="text-xl font-bold">Expected Outcomes</h4>
            <ul className="mt-3 space-y-2 text-gray-700">
              {data.outcomes.map((o,i)=>(<li key={i} className="flex gap-2"><CheckCircle2 className="h-5 w-5"/> {o}</li>))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold">Our Process</h4>
            <ol className="mt-3 grid gap-3">
              {data.process.map((s,i)=>(
                <li key={i} className="flex items-start gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gray-100 text-sm font-bold">{i+1}</span>
                  <span className="pt-1">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
};

const About: React.FC = () => (
  <section>
    <SectionShell
      title="About Launch & Lift"
      subtitle="We’re a collective of operators, builders and growth leaders helping founders move faster."
      icon={Rocket}
      bullets={[
        "10+ years shipping zero‑to‑one products",
        "Network of 300+ angels & VC partners",
        "Portfolio companies across SaaS, fintech, AI and consumer",
        "Remote‑first with on‑ground partners in key hubs",
      ]}
      cta={{ label: "See services", to: "/services" }}
    />
  </section>
);

const Contact: React.FC = () => (
  <section>
    <Container className="py-14">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-3xl font-extrabold">Let’s talk</h3>
          <p className="mt-3 text-gray-700">Tell us about your startup and goals. We’ll propose a fast, focused plan.</p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="inline-flex items-center gap-2"><Phone className="h-4 w-4"/> +91 00000 00000</div>
            <div className="inline-flex items-center gap-2"><Mail className="h-4 w-4"/> hello@launchandlift.com</div>
            <div className="inline-flex items-center gap-2"><MapPin className="h-4 w-4"/> Remote‑first • Global</div>
          </div>
        </div>
        <form onSubmit={(e)=>e.preventDefault()} className="rounded-3xl border border-black/5 bg-white p-6 shadow">
          <div className="grid gap-4">
            <label className="text-sm font-medium">Name<input className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring" placeholder="Your full name"/></label>
            <label className="text-sm font-medium">Email<input className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring" placeholder="name@company.com"/></label>
            <label className="text-sm font-medium">Company<input className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring" placeholder="Startup name"/></label>
            <label className="text-sm font-medium">How can we help?<textarea className="mt-1 min-h-[120px] w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring" placeholder="Describe your needs"/></label>
            <button className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium shadow" style={{ background: brand.green, color: "white"}}>Send message</button>
          </div>
        </form>
      </div>
    </Container>
  </section>
);

const Footer: React.FC = () => (
  <footer className="border-t border-black/5">
    <Container className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-gray-600 sm:flex-row">
      <div>© {new Date().getFullYear()} {brand.name}. All rights reserved.</div>
      <div className="flex items-center gap-4">
        <a href="#/about" className="hover:underline">About</a>
        <a href="#/services" className="hover:underline">Services</a>
        <a href="#/contact" className="hover:underline">Contact</a>
      </div>
    </Container>
  </footer>
);

export default function LaunchAndLiftSite() {
  const [path, navigate] = useHashRoute();
  useEffect(()=>{ if(!window.location.hash) navigate("/"); },[]);

  const isService = path.startsWith("/services/");

  return (
    <div className="min-h-screen" style={{ background: brand.bg, color: brand.text }}>
      <Navbar onNavigate={navigate} active={path} />

      <main>
        <AnimatePresence mode="wait">
          {!isService && path === "/" && (
            <motion.div key="home" initial={{ opacity:0, y: 8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
              <Hero onNavigate={navigate}/>
              <FullStackSection/>
              <ServicesOverview/>
              <About/>
              <CTASection navigate={navigate}/>
            </motion.div>
          )}

          {!isService && path === "/about" && (
            <motion.div key="about" initial={{ opacity:0, y: 8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
              <About/>
              <CTASection navigate={navigate}/>
            </motion.div>
          )}

          {!isService && path === "/services" && (
            <motion.div key="services" initial={{ opacity:0, y: 8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
              <ServicesOverview/>
              <CTASection navigate={navigate}/>
            </motion.div>
          )}

          {!isService && path === "/contact" && (
            <motion.div key="contact" initial={{ opacity:0, y: 8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
              <Contact/>
            </motion.div>
          )}

          {isService && (
            <motion.div key={path} initial={{ opacity:0, y: 8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
              <ServiceHeader title={routes[path]} navigate={navigate}/>
              <ServicePage route={path}/>
              <CTASection navigate={navigate}/>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer/>
    </div>
  );
}

const CTASection: React.FC<{ navigate: (p:string)=>void }>=({ navigate }) => (
  <section>
    <Container className="py-16">
      <div className="grid gap-6 rounded-3xl border border-black/5 bg-white p-8 shadow md:grid-cols-3">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-extrabold">Ready to launch and lift?</h3>
          <p className="mt-2 text-gray-700">Get a free 30‑minute consult. We’ll map a path from idea to impact.</p>
        </div>
        <div className="flex items-center md:justify-end">
          <a href="#/contact" className="rounded-2xl px-6 py-3 font-medium shadow" style={{ background: brand.gold }}>
            Book a consult
          </a>
        </div>
      </div>
    </Container>
  </section>
);

const ServiceHeader: React.FC<{ title?: string; navigate: (p:string)=>void }>=({ title, navigate }) => (
  <section className="relative">
    <GradientBG/>
    <Container className="py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Pill>Service</Pill>
          <h2 className="mt-2 text-3xl font-extrabold">{title}</h2>
          <p className="mt-2 max-w-2xl text-gray-700">Tailored packages for pre‑seed to Series A startups. Choose what you need, when you need it.</p>
        </div>
        <div>
          <a href="#/services" className="inline-flex items-center rounded-2xl border border-black/5 bg-white px-5 py-3 font-medium shadow">
            All services <ChevronRight className="ml-2 h-4 w-4"/>
          </a>
        </div>
      </div>
    </Container>
  </section>
);
