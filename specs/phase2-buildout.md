# HeyTARA Website Phase 2 — Full Buildout Spec

## Working Directory
`/home/openclaw/.openclaw/workspace/projects/heytara-website/`

## Design System (MUST match existing site)
- Font: Plus Jakarta Sans (Google Fonts)
- Colors: --red: #C41E1E, --orange: #FF9F43, --yellow: #FFD93D, --green: #6BCB77, --navy: #1A1A2E, --white: #FFFFFF, --offwhite: #FAFAFA
- Border radius: 16px cards, 999px pills
- Existing CSS: `css/style.css`
- Blog CSS: `blog/blog.css`
- JS: `js/main.js`
- Mobile responsive required
- Nav: transparent until scroll, then white with shadow
- Logo: `heytara-logo-dark.png` (transparent bg)

## Existing nav structure (desktop)
How It Works | Capabilities | Results | Blog | Contact | [Book a Demo →]

## New nav structure
How It Works | Industries ▾ | Pricing | Results | Blog | Contact | [Book a Demo →]
(Industries is a dropdown with 7 sub-pages)
(Success Stories and Comparisons linked from within pages, not top nav)

## DO NOT modify existing pages (index.html, contact.html, blog/*)
## Only ADD new files and update nav in index.html and contact.html

---

## 1. Pricing Page (`pricing.html`)

Three-tier pricing cards, center card highlighted as "Most Popular":

### Starter
- $0/mo, 3% per completed takeout order
- AI Call Answering
- FAQ Automation
- Takeout Ordering
- POS Integration
- SMS Order Confirmations
- Reservations
- 500 Calls / Month
- Email Support

### Main Course ⭐ Most Popular
- $299/mo, 1% per completed takeout order
- Everything in Starter, plus:
- Intelligent Upselling
- Catering Workflows
- Guest Recovery
- Internal Staffing
- Call Routing & Escalations
- Analytics Dashboard
- Call Recordings & Transcripts
- Priority Support
- 1,000 Calls / Month

### Chef's Special
- Custom pricing
- Everything in Main Course, plus:
- Unlimited Calls
- Multi-Location Management
- Custom AI Workflows
- Loyalty Program Integration
- Custom Integrations
- Branded Voice
- Dedicated Customer Success Manager
- White Glove Onboarding
- Enterprise SLA

CTA on each card: "Get Started" for Starter/Main Course, "Contact Sales" for Chef's Special
Bottom section: "Mission Aligned Pricing — We Succeed When You Do" statement

---

## 2. Industries Pages

Create `industries/` directory with:
- `qsr.html` — Quick Service Restaurants
- `fast-casual.html` — Fast Casual
- `casual-dining.html` — Casual Dining
- `fine-dining.html` — Fine Dining
- `pizza.html` — Pizza
- `coffee.html` — Coffee Shops
- `bars.html` — Bars & Breweries

Each page follows the same template:
1. Hero section with industry-specific headline and sub
2. "The Challenge" — 3-4 pain points specific to that segment
3. "How TARA Helps" — 4-5 features most relevant to that segment
4. Stats/metrics relevant to the segment
5. CTA: Book a Demo

Use the same nav as the main site. Industries dropdown in nav links to these pages.

### Content per page:

**QSR:** High volume, speed matters, drive-through overflow, phone orders during rush
**Fast Casual:** Order customization, peak hour phone backup, loyalty/follow-up
**Casual Dining:** Reservations, large party inquiries, catering, server support
**Fine Dining:** Concierge-level service, special requests, wine pairing questions, VIP handling
**Pizza:** Phone ordering is core business, delivery coordination, upselling sides/drinks
**Coffee Shops:** Mobile ordering overflow, catering (office runs), loyalty programs
**Bars & Breweries:** Event inquiries, hours/specials, large group reservations, happy hour promos

---

## 3. Comparison Pages

Create `compare/` directory with:
- `vs-voicemail.html` — TARA vs Voicemail
- `vs-call-center.html` — TARA vs Traditional Call Centers
- `vs-hiring.html` — TARA vs Hiring Another Employee
- `vs-other-ai.html` — TARA vs Other AI Voice Solutions

Each page:
1. Hero: "HeyTARA vs [Competitor]"
2. Side-by-side comparison table (feature matrix)
3. Key differentiators section
4. "The Bottom Line" summary
5. CTA: Book a Demo

Link these from within relevant pages (not top nav).

---

## 4. ROI Calculator (`roi-calculator.html`)

Interactive calculator with inputs:
- Number of locations (slider: 1-100)
- Average calls per day per location (slider: 20-200)
- Estimated % of missed calls (slider: 10-60%, default 40%)
- Average order value (slider: $15-$75, default $35)

Calculated outputs (update in real time with JS):
- **Missed calls per month:** locations × calls/day × miss% × 30
- **Lost revenue per month:** missed calls × order value × 60% (conversion rate)
- **Lost revenue per year:** monthly × 12
- **TARA recovered revenue:** lost revenue × 85% (capture rate)
- **Staff hours saved per month:** locations × 20 hrs
- **Labor savings per month:** staff hours × $18/hr

Display as a results card with big numbers and a "Book a Demo to See Your Custom ROI" CTA.

All calculation in vanilla JS. No libraries.

---

## 5. Customer Success Stories (`success-stories.html`)

Hero + grid of success story cards (placeholder content OK):

### Story 1: Lucille's Smokehouse BBQ
- Segment: Casual Dining
- Challenge: Missing 35% of calls during dinner rush
- Solution: TARA voice + SMS
- Results: +28% orders captured, +18% avg ticket, 22 staff hours saved/week
- Quote: "TARA is like having our best employee on every call, every time."

### Story 2: Pokeworks
- Segment: Fast Casual
- Challenge: High volume customized orders overwhelming phone staff
- Solution: TARA voice ordering with full customization support
- Results: +32% phone orders, 97% accuracy, $4.2K monthly revenue increase
- Quote: "Our team can finally focus on the guests in front of them."

### Story 3: Mendocino Farms
- Segment: Fast Casual
- Challenge: Catering order follow-up falling through cracks
- Solution: TARA email + SMS follow-up automation
- Results: +40% catering conversion, 3x faster response time
- Quote: "The automated follow-ups alone paid for the entire system."

Each card: restaurant name, segment tag, key metric, short quote, "Read Full Story →" link.

---

## 6. Careers Page (`careers.html`)

Simple page:
1. Hero: "Join the Team Building the Future of Hospitality"
2. Sub: "We're on a mission to help every restaurant deliver an exceptional guest experience. If that excites you, we'd love to hear from you."
3. "Why HeyTARA" section with 3-4 culture/benefit cards
4. Open positions section (placeholder): "We're always looking for exceptional people. Send your resume to careers@heytara.ai"
5. CTA: Email careers@heytara.ai

---

## 7. Privacy Policy (`privacy.html`) & Terms of Service (`terms.html`)

Standard boilerplate for a SaaS company. Include:
- Company name: HeyTARA
- Contact: hello@heytara.ai
- Effective date: July 25, 2026

Privacy Policy covers: data collection, cookies, third-party services, data retention, user rights, contact info.
Terms covers: service description, acceptable use, intellectual property, limitation of liability, termination, governing law (California).

---

## 8. Navigation Updates

Update nav in ALL existing pages (index.html, contact.html, blog/*.html):

Desktop nav:
```
How It Works | Industries ▾ | Pricing | Results | Blog | Contact | [Book a Demo →]
```

Industries dropdown (CSS-only hover dropdown):
- Quick Service
- Fast Casual
- Casual Dining
- Fine Dining
- Pizza
- Coffee Shops
- Bars & Breweries

Mobile nav: same links but stacked, Industries expanded (no dropdown).

Footer links update:
- Add: Privacy Policy, Terms of Service, Careers
- Ensure all links work

---

## Technical Notes
- All pages are static HTML + CSS + vanilla JS
- No frameworks, no build tools
- Each page includes the standard nav, footer, and main.js
- CSS: add new styles to css/style.css (or create css/pages.css if style.css is getting too large)
- Mobile responsive required on all new pages
- Scroll-triggered fade-in animations on cards/sections
- Use existing CSS variables and class patterns
