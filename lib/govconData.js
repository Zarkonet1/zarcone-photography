// ─────────────────────────────────────────────────────────────────────────
// Government Practice — single source of truth for /government-contracting
// ─────────────────────────────────────────────────────────────────────────
// Every fact on the Government Contracting page originates here. Components
// under components/govcon/ read from this file — they should never contain
// hardcoded copy, certification numbers, or contact details. Future content
// changes (new FAQ, updated turnaround policy, renewed certifications)
// should be data edits to this file, not component edits.
//
// Source of truth for company facts: Capability Statement v1.3 FINAL
// (Zarcone_Photography_Capability_Statement_v1.3_FINAL.docx). If that
// document is revised, reconcile this file against it — see the note on
// GOVERNING_PRINCIPLE below for the one rule that must never be violated
// by either document.
// ─────────────────────────────────────────────────────────────────────────

// The single rule every section on this page is written to protect.
// Do not add copy anywhere on this page — now or in future edits — that
// implies prior federal contracts, agency past performance, or government
// clients. Institutional Partnerships & Experience and Why Government
// Buyers Choose Us are deliberately non-adjacent in the page's section
// order for this reason. See GOVCON-LANDING-PAGE-SPEC.md §0 for the full
// rationale.
export const GOVERNING_PRINCIPLE =
  'Never imply prior government contracts, agency past performance, or government clients until they actually exist.';

export const VALUE_PROPOSITION = 'Certified. Prepared. Disciplined. Ready to support agency missions.';

export const MISSION = "Preserve what matters so today's moments become tomorrow's institutional memory.";

// ─── Company Data (verified against Capability Statement v1.3 FINAL) ──────
// SAM.gov / SDVOSB expiration dates are carried from Capability Statement
// v1.0 — v1.3 does not restate them. Confirm both are still accurate
// before this page goes live (see GOVCON-LANDING-PAGE-SPEC.md §10, item 8).
export const COMPANY_DATA = {
  legalName: 'Zarcone Photography LLC',
  businessType: 'Small Business / Service-Disabled Veteran-Owned Small Business (SDVOSB)',
  uei: 'W9L7BJ4DAA64',
  cage: '15PP7',
  naicsPrimary: { code: '541922', label: 'Commercial Photography' },
  naicsAdditional: [
    { code: '541921', label: 'Photography Studios, Portrait' },
    { code: '512110', label: 'Motion Picture and Video Production' },
  ],
  pscCodes: [
    { code: 'T010', label: 'Photo, Still' },
    { code: 'T015', label: 'Photo, Motion' },
  ],
  serviceArea: 'New Jersey, New York, Pennsylvania — travel available nationwide',
  samRegistration: { status: 'Active', expires: '07/17/2027', needsReconfirmation: true },
  sdvosbCertification: { status: 'Active (SBA VetCert)', expires: '10/06/2028', needsReconfirmation: true },
  gsaSchedule: null, // Confirmed: none held. Do not reference a GSA Schedule anywhere on this page.
  principal: {
    name: 'Tom Zarcone',
    title: 'Founder / Principal Photographer',
  },
  location: 'Bridgewater, New Jersey',
  phone: '908-777-0631',
  phoneHref: 'tel:+19087770631',
  email: 'tom@zarconephotography.com',
  emailHref: 'mailto:tom@zarconephotography.com',
};

// Public verification links for the Certifications section.
//
// IMPORTANT (resolved 2026-07-20): sam.gov itself has NO public,
// no-login entity search — every query on sam.gov either returns a false
// "No matches found" or an explicit "Sign In Required" wall, confirmed by
// live testing. The working, public, no-login substitute is SBA's Small
// Business Search profile page below, which independently displays both
// "SAM.gov registration status: Active" and current SDVOSB/VOSB
// certifications for this exact UEI/CAGE — verified live on 2026-07-20.
// Both badges intentionally point at the same stable profile URL.
export const VERIFICATION_LINKS = {
  samGov: 'https://search.certifications.sba.gov/profile/W9L7BJ4DAA64/15PP7',
  sdvosbVetCert: 'https://search.certifications.sba.gov/profile/W9L7BJ4DAA64/15PP7',
};

// ─── Hero ───────────────────────────────────────────────────────────────
// Hero background image is configuration, not a hardcoded asset reference
// in the component. Left null until a vetted, institutional-appropriate
// photo is selected — see GOVCON-LANDING-PAGE-SPEC.md §9/§10. The hero
// renders cleanly as a typographic layout with no image until this is set.
export const HERO = {
  kicker: 'FEDERAL PRACTICE — CERTIFIED. PREPARED. DISCIPLINED.',
  headline: 'Institutional Visual Documentation for Agencies That Need It Done Right the First Time.',
  subhead:
    'A Service-Disabled Veteran-Owned Small Business, SAM.gov registered and SBA-certified — built for the discipline federal documentation requires.',
  primaryCta: { label: 'Download Capability Statement', href: '#capability-statement' },
  secondaryCta: { label: 'Request a Capabilities Briefing', href: '#contact' },
  // Set to a photo path (e.g. '/photos/example.jpg') to enable a background
  // image. Use a desaturated, institutional-context photo only — never a
  // consumer/portfolio image. Leave null to keep the current typographic
  // hero treatment.
  backgroundImage: null,
};

// ─── Capability Statement Download ─────────────────────────────────────
// Points at the FINAL PDF export path. The PDF itself must be generated
// from Capability Statement v1.3 FINAL (not the earlier Release
// Candidate, which contained an overclaim later corrected in the FINAL).
export const CAPABILITY_STATEMENT = {
  headline: 'Every Federal Buyer Starts Here.',
  body:
    'Our Capability Statement contains everything a Contracting Officer or Small Business Specialist needs to evaluate fit: certifications, NAICS and PSC codes, core competencies, and verified company data — one page, no follow-up required.',
  ctaLabel: 'Download Capability Statement (PDF)',
  fileHref: '/files/zarcone-photography-capability-statement.pdf',
  fileSizeLabel: 'PDF',
};

// ─── Government Resource Center ────────────────────────────────────────
// The centerpiece of the page — every item anchors to a section further
// down this same page (Phase 1). If any single resource later grows
// enough unique content to justify it, it can be promoted to a standalone
// route (/government-contracting/[slug]) without touching these anchors.
export const RESOURCE_CENTER = {
  headline: 'Government Resource Center',
  frame:
    'Everything a Contracting Officer or Program Manager typically requests when evaluating a small business vendor — in one place, answerable on first contact.',
  items: [
    { id: 'capability-statement', label: 'Capability Statement (PDF)', description: 'One-page download with certifications, codes, and competencies.' },
    { id: 'why-zarcone', label: 'Company Overview', description: 'Who we are and what we do.' },
    { id: 'executive-biography', label: 'Executive Biography', description: 'Background on the founder and principal photographer.' },
    { id: 'certifications', label: 'SDVOSB Verification', description: 'Certification status with public verification links.' },
    { id: 'certifications', label: 'UEI / CAGE / NAICS / PSC Codes', description: 'Quick-reference registration and classification data.' },
    { id: 'how-we-work', label: 'Sample Project Workflow', description: 'How an assignment is planned and executed.' },
    { id: 'delivery-standards', label: 'Image Delivery Standards', description: 'File formats, delivery method, and usage rights.' },
    { id: 'certifications', label: 'Frequently Requested Company Information', description: 'UEI, CAGE, address, POC, business size at a glance.' },
    { id: 'contact', label: 'Contact Information', description: 'Direct phone and email.' },
    { id: 'contact', label: 'Request a Quote', description: 'Short-form quote request.' },
    { id: 'contact', label: 'Schedule a Capabilities Briefing', description: 'Book time directly with the founder.' },
  ],
  // Condensed set for the persistent sticky sub-nav (6-8 most-referenced
  // anchors, not all 11 resource cards).
  subNavItems: [
    { id: 'capability-statement', label: 'Capability Statement' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'how-we-work', label: 'How We Work' },
    { id: 'institutional-experience', label: 'Institutional Partnerships' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ],
};

// ─── Why Zarcone Photography ────────────────────────────────────────────
// Body copy matches Capability Statement v1.3 FINAL verbatim — see
// GOVCON-LANDING-PAGE-SPEC.md §0.1 / §3.4.
export const WHY_ZARCONE = {
  headline: 'Why Zarcone Photography',
  paragraphs: [
    'Zarcone Photography LLC is a Service-Disabled Veteran-Owned Small Business providing professional visual documentation, commercial photography, and multimedia services to educational institutions, corporations, nonprofit organizations, and community partners, with the SDVOSB certification and operational readiness to support government agency engagements.',
    'Every assignment begins by understanding its purpose. We prepare carefully, work professionally within institutional environments, and deliver publication-ready visual assets that faithfully preserve not only what occurred, but why it mattered.',
    'Led by West Point graduate and Service-Disabled Veteran Tom Zarcone, the company combines more than four decades of photographic experience with disciplined planning, responsive communication, and dependable owner-led execution.',
  ],
  pullQuote: 'The significance is the true art. Photography is simply the means by which that significance is faithfully preserved.',
};

// ─── Executive Biography ───────────────────────────────────────────────
export const EXECUTIVE_BIO = {
  headline: 'Executive Biography',
  paragraphs: [
    'Tom Zarcone is the Founder and Principal Photographer of Zarcone Photography LLC, a Service-Disabled Veteran-Owned Small Business based in Bridgewater, New Jersey. A graduate of the United States Military Academy at West Point, Tom brings more than four decades of photographic experience to institutional and mission-driven documentation work.',
    'His approach is shaped by military training in preparation, protocol, and disciplined execution — the same standards applied to every assignment, from executive portraiture to ceremony documentation. Every engagement is led personally by Tom; there is no account-manager layer and no unfamiliar subcontracted crew between the agency and the photographer.',
  ],
  // Optional environmental portrait — reuses the same vetted headshot used
  // sitewide (app/layout.jsx OG image) rather than an unvetted asset.
  image: { src: '/photos/tz-headshot.jpg', alt: 'Tom Zarcone, Founder and Principal Photographer, Zarcone Photography LLC' },
};

// ─── Core Competencies ──────────────────────────────────────────────────
// Matches Capability Statement v1.3 FINAL's competency list exactly.
export const CORE_COMPETENCIES = [
  { title: 'Institutional Visual Documentation', description: 'Comprehensive visual record-keeping for institutional missions, programs, and operations.' },
  { title: 'Official Event & Ceremony Documentation', description: 'Official events, recognitions, commemorations, conferences, and organizational milestones, documented with institutional context and accuracy.' },
  { title: 'Executive & Environmental Portraiture', description: 'On-location headshots, leadership portraits, and environmental portrait sessions produced efficiently with minimal disruption to operations.' },
  { title: 'Public Affairs & Mission Storytelling', description: 'Publication-ready imagery supporting outreach, recruiting, internal communications, and historical/organizational records.' },
  { title: 'Commercial & Brand Photography', description: 'Professional imagery supporting institutional communications, publications, and brand-consistent visual assets.' },
  { title: 'Mobile Studio Operations', description: 'Portable lighting, backgrounds, and tethered on-site workflows enabling efficient portrait and documentation sessions at any location.' },
  { title: 'Multimedia & Short-Form Video', description: 'Short-form video content supporting public affairs, recruiting, and mission storytelling alongside still photography.' },
  { title: 'Professional Post-Production & Secure Digital Delivery', description: 'Professional selection, color correction, retouching, metadata organization, and secure digital asset delivery.' },
];

// ─── Government Services ───────────────────────────────────────────────
export const GOVERNMENT_SERVICES = [
  'Official Event & Ceremony Documentation',
  'Executive & Leadership Portraiture',
  'Public Affairs Photography',
  'Visual Documentation of Programs & Operations',
  'Awards & Recognition Ceremonies',
  'Conference & Symposium Coverage',
  'Training & Exercise Documentation',
  'Recruiting & Outreach Photography',
  'Historical & Organizational Record Preservation',
  'Community Outreach & Public Engagement Events',
  'Veterans Events & Commemorations',
  'Change-of-Command & Retirement Ceremonies',
  'Site & Facility Documentation (non-sensitive areas)',
  'Multimedia & Short-Form Video Content',
];

// ─── How We Work ────────────────────────────────────────────────────────
export const WORKFLOW_STEPS = [
  { step: '01', title: 'Understand the Mission', description: 'We begin every engagement by understanding its purpose, audience, and how the resulting imagery will be used.' },
  { step: '02', title: 'Plan the Assignment', description: 'Site logistics, lighting, shot list, and schedule are confirmed in advance, not improvised on arrival.' },
  { step: '03', title: 'Execute Professionally', description: 'On-site work is conducted with discipline, respect for protocol, and minimal disruption to operations.' },
  { step: '04', title: 'Deliver Publication-Ready Assets', description: 'Final imagery is color-corrected, organized, and delivered securely — ready for immediate use.' },
];

// ─── Image Delivery Standards ───────────────────────────────────────────
export const DELIVERY_STANDARDS = [
  { label: 'Selection & Editing', description: 'Every image set is professionally selected, color-corrected, and retouched prior to delivery.' },
  { label: 'File Formats', description: 'High-resolution JPEG (print- and publication-ready) is standard; RAW, TIFF, or specific resolution/format requirements are available on request.' },
  { label: 'Delivery Method', description: 'Secure online gallery with organized metadata — no physical media handoff required.' },
  { label: 'Usage Rights', description: 'Confirmed in writing prior to each engagement, so imagery can be used as intended for agency communications, recruiting, or public affairs purposes.' },
  {
    label: 'Turnaround',
    description:
      'Turnaround is established at the time of engagement based upon project scope, complexity, and agency requirements. Expedited delivery is available when mission requirements dictate.',
  },
];

// ─── Certifications badges (Certifications & Quick-Reference section) ──
export const CERTIFICATION_BADGES = [
  { label: 'SDVOSB', value: `SBA VetCert Certified — exp. ${COMPANY_DATA.sdvosbCertification.expires}`, verifyHref: VERIFICATION_LINKS.sdvosbVetCert },
  { label: 'SAM.gov', value: `Active Registration — exp. ${COMPANY_DATA.samRegistration.expires}`, verifyHref: VERIFICATION_LINKS.samGov },
  { label: 'UEI', value: COMPANY_DATA.uei },
  { label: 'CAGE Code', value: COMPANY_DATA.cage },
  { label: 'Primary NAICS', value: `${COMPANY_DATA.naicsPrimary.code} (${COMPANY_DATA.naicsPrimary.label})` },
  { label: 'PSC Codes', value: COMPANY_DATA.pscCodes.map((p) => p.code).join(', ') },
];

// "Frequently Requested Company Information" quick-reference table.
export const QUICK_REFERENCE = [
  { label: 'Legal Name', value: COMPANY_DATA.legalName },
  { label: 'Business Size', value: 'Small Business' },
  { label: 'Additional NAICS', value: COMPANY_DATA.naicsAdditional.map((n) => n.code).join(', ') },
  { label: 'Service Area', value: COMPANY_DATA.serviceArea },
  { label: 'Principal / POC', value: `${COMPANY_DATA.principal.name}, ${COMPANY_DATA.principal.title}` },
  { label: 'Phone', value: COMPANY_DATA.phone },
  { label: 'Email', value: COMPANY_DATA.email },
  { label: 'Location', value: COMPANY_DATA.location },
];

// ─── Institutional Partnerships & Experience ───────────────────────────
// Framing sentence matches Capability Statement v1.3 FINAL verbatim — this
// is the guardrail sentence. Do not remove or soften it.
export const INSTITUTIONAL_PARTNERSHIPS = {
  headline: 'Institutional Partnerships & Experience',
  framing:
    'Project history reflects sustained partnerships with educational institutions, athletic programs, corporations, nonprofit organizations, and community partners. This experience demonstrates the reliability and consistency required for institutional-grade documentation and is not presented as prior federal contract performance.',
  items: [
    'Official Media Partner — Bridgewater-Raritan High School Football: Season-long media-day production, team and individual portraits, game coverage, and senior recognition documentation.',
    'Educational & Athletic Programs: More than a decade documenting school athletics, student achievement, ceremonies, and community-centered programs.',
    'Corporate, Nonprofit & Community Events: On-location event coverage, professional portraits, and rapid digital delivery for organizational use.',
  ],
};

// ─── The Zarcone Difference ─────────────────────────────────────────────
// Opening line matches Capability Statement v1.3 FINAL verbatim.
export const ZARCONE_DIFFERENCE = {
  headline: 'The Zarcone Difference',
  subhead: 'Visual Documentation, Not Commercial Photography',
  pullLine: 'Photography documents what happened. Visual documentation preserves institutional memory.',
  paragraphs: [
    'Most organizations need more than photographs — they need an accurate, dependable visual record of the people, events, and milestones that define their mission.',
    "That distinction shapes every decision we make. A commercial photography engagement optimizes for the most flattering frame. A visual documentation engagement optimizes for the frame that will still mean something in an institutional record five, ten, or twenty years from now — the one that accurately represents who was in the room, what was said, and why the moment mattered enough to document in the first place.",
    'We treat every assignment as a contribution to institutional memory, not a content deliverable. The shot list is built around the mission the event serves, not around visual variety. The photographer arrives understanding the protocol, chain of command, and context of the room before a single frame is taken. And preparation happens before the shutter is pressed, not around it — because disciplined preparation, not creative instinct, is what makes documentation dependable enough for institutions to build a permanent record on.',
    'This is the standard Zarcone Photography was built on: more than four decades of experience, applied with the discipline of a West Point-trained founder, in service of one core belief — the significance is the true art. Photography is simply the means by which that significance is faithfully preserved.',
  ],
};

// ─── Why Government Buyers Choose Us ────────────────────────────────────
export const WHY_BUYERS_CHOOSE_US = [
  { title: 'Mission Understanding', description: 'We approach every assignment by first understanding its purpose, audience, and context.' },
  { title: 'Dependability', description: 'Confirmed schedules, on-time arrival, and reliable delivery timelines.' },
  { title: 'Preparation', description: 'Site logistics, lighting, and shot planning are handled in advance, not improvised on arrival.' },
  { title: 'Professional Conduct', description: 'Respect for protocol, security requirements, and the tone of institutional environments.' },
  { title: 'Publication-Ready Imagery', description: 'Color-corrected, properly organized, and delivered in formats ready for immediate use.' },
  { title: 'Responsive Communication', description: 'Direct, owner-led point of contact from first inquiry through final delivery.' },
  { title: 'Owner-Led Execution', description: 'Every engagement is led personally by the founder — no account-manager layer between the agency and the photographer.' },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────
export const FAQ_GROUPS = [
  {
    group: 'Working With Us',
    items: [
      { q: 'Do you travel for assignments?', a: 'Yes. Zarcone Photography is based in Bridgewater, New Jersey, and regularly serves New Jersey, New York, and Pennsylvania, with travel available nationwide for larger or recurring engagements.' },
      { q: 'Can you work weekends or evenings?', a: 'Yes. Ceremonies, recognition events, and public affairs assignments frequently occur outside standard business hours, and scheduling accommodates that.' },
      { q: 'Can you support recurring or standing engagements?', a: 'Yes. We support both single-day assignments and recurring documentation needs, including season-long or annual program coverage.' },
      { q: 'Can you support multiple locations or simultaneous events?', a: 'Single-photographer engagements are handled directly by the founder. Multi-location or multi-day requirements are scoped in advance to confirm coverage and scheduling.' },
      { q: 'Who will actually be on-site for our assignment?', a: 'Tom Zarcone, Founder and Principal Photographer, personally leads every engagement — there is no hand-off to unfamiliar subcontracted staff.' },
    ],
  },
  {
    group: 'Logistics & Security',
    items: [
      { q: 'Do you photograph on secure or access-controlled facilities?', a: 'We can support assignments at access-controlled facilities where credentialing, escort, or clearance requirements are coordinated in advance by the requesting agency. Provide facility access requirements when scoping the engagement.' },
      { q: 'Do you maintain backup equipment?', a: 'Yes. All assignments are covered with redundant camera bodies, lenses, lighting, and storage media to eliminate single points of equipment failure.' },
      { q: 'Can you work with agency Public Affairs Offices directly?', a: 'Yes. We coordinate directly with Public Affairs points of contact on shot lists, approved use, and release requirements.' },
      { q: 'What is your typical setup footprint?', a: 'Mobile studio operations use portable lighting and backgrounds designed for minimal disruption to ongoing operations — no large trucks or extended setup windows required for most portrait or event assignments.' },
      { q: 'Can you accommodate last-minute or short-notice requests?', a: 'Availability depends on current scheduling; contact us directly to confirm turnaround for time-sensitive requirements.' },
    ],
  },
  {
    group: 'Delivery & Contracting',
    items: [
      { q: 'How are images delivered?', a: 'Final assets are delivered digitally via secure online gallery, with professional selection, color correction, retouching, and organized metadata.' },
      { q: 'What image formats and resolutions are provided?', a: 'High-resolution files suitable for both print and digital/publication use are standard; specific format or resolution requirements can be accommodated on request.' },
      { q: 'Do you provide usage rights for agency publications and websites?', a: 'Usage terms are confirmed in writing prior to each engagement to ensure imagery can be used as intended for agency communications, recruiting, or public affairs purposes.' },
      { q: 'Can you provide executive portraits on-site?', a: 'Yes. On-location headshots and leadership portraits are a core capability, using portable studio lighting to produce consistent, professional results without requiring travel to a studio.' },
      { q: 'Can you photograph awards ceremonies and change-of-command events?', a: 'Yes — these are core service offerings, documented with attention to protocol and institutional context.' },
      { q: 'What certifications and registrations do you hold?', a: 'Zarcone Photography is SBA-certified as a Service-Disabled Veteran-Owned Small Business (SDVOSB) and maintains an active SAM.gov registration. Full certification details, UEI, CAGE code, NAICS, and PSC codes are listed in our Capability Statement.' },
      { q: 'What is your primary NAICS code?', a: '541922 (Commercial Photography), with 541921 (Photography Studios, Portrait) and 512110 (Motion Picture and Video Production) as additional codes.' },
      { q: 'How do we request a quote or schedule a capabilities briefing?', a: 'Contact us directly by phone or email, or use the Request a Quote / Schedule a Capabilities Briefing options below — we typically respond within one business day.' },
    ],
  },
];

// ─── Ready to Support Your Mission ─────────────────────────────────────
// Small, understated closing section — a gentle transition into Contact.
// Deliberately readiness-framed ("prepared to deliver"), not an
// experience claim — consistent with GOVERNING_PRINCIPLE above.
export const READY_TO_SUPPORT = {
  headline: 'Ready to Support Your Mission',
  paragraphs: [
    'Whether documenting an official event, public outreach initiative, executive leadership, training exercise, community engagement, or institutional milestone, Zarcone Photography is prepared to deliver disciplined visual documentation that reflects the professionalism of your organization.',
    'We welcome the opportunity to discuss upcoming requirements.',
  ],
};

// ─── Contact ─────────────────────────────────────────────────────────────
export const CONTACT = {
  headline: "Let's Talk About Your Documentation Needs",
  phone: COMPANY_DATA.phone,
  phoneHref: COMPANY_DATA.phoneHref,
  email: COMPANY_DATA.email,
  emailHref: COMPANY_DATA.emailHref,
  // Calendly (or equivalent) not yet in place — mailto fallback with a
  // pre-filled subject line. Swap `schedulingHref` to a Calendly link/embed
  // later; no structural change to this section is required when that
  // happens (see GOVCON-LANDING-PAGE-SPEC.md §10, item 3).
  schedulingHref: `mailto:${COMPANY_DATA.email}?subject=${encodeURIComponent('Capabilities Briefing Request — Zarcone Photography')}`,
  quoteFormFields: ['Name', 'Agency / Organization', 'Email', 'Phone', 'Brief Description'],
};

// ─── Footer ──────────────────────────────────────────────────────────────
export const GOV_FOOTER = {
  tagline: VALUE_PROPOSITION,
  copyrightName: COMPANY_DATA.legalName,
  links: [
    { label: 'Verify SDVOSB & SAM.gov Status (SBA.gov)', href: VERIFICATION_LINKS.samGov, external: true },
    { label: 'Back to Main Site', href: '/', external: false },
  ],
};
