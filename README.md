markdown# GigShield — AI-Powered Parametric Income Insurance for India's Gig Workers

**Guidewire DEVTrails 2026**

*Protecting the last mile. Automatically.*

---

## The Problem

India has over 10 million platform-based delivery partners working for Zomato, Swiggy, and similar platforms. These workers earn ₹600–₹1,200/day — paid weekly — with zero employment benefits, no sick leave, and no financial safety net.

When external disruptions hit — a heavy downpour, a severe pollution day, a sudden platform outage — their income does not just dip. It vanishes entirely.

> A Zomato delivery partner in Hyderabad during a heavy rain event loses an estimated ₹500–₹900 in a single day with no recourse.

Traditional insurance does not work for them:
- Claims require paperwork and manual review, taking days or weeks to resolve
- Products are designed for salaried employees, not gig workers
- Monthly premiums do not match the week-to-week earning rhythm of delivery workers
- No product today covers income loss caused by external environmental disruptions

GigShield changes that.

---

## Persona: Ravi, the Zomato Delivery Partner

**Who he is:**
- Age 24, works 10–12 hours/day, 6 days a week on a two-wheeler
- Earns approximately ₹700/day, paid weekly by Zomato
- Operates across 2–3 pin codes in Hyderabad
- Owns a smartphone, uses UPI, and lives delivery-to-delivery

**His reality during disruptions:**
- Heavy rain → Roads flood → Zomato suspends deliveries → ₹0 income that day
- AQI crosses 300 → City advisory → He stays home → ₹0 income
- Zomato app crashes during peak evening → He sits idle → ₹200–₹300 lost
- Extreme heat above 44°C → Orders collapse → 40% of normal income

**What GigShield delivers:**
- Ravi pays ₹49–₹99/week, dynamically priced by our risk engine
- When a trigger event hits his pin code during active hours, payout fires automatically
- Money reaches his UPI within minutes — no form, no call, no waiting

---

## How It Works
ONBOARDING
Ravi registers with phone, Zomato Partner ID, UPI ID, pin code.
Pricing engine profiles his zone risk and calculates weekly premium.
Policy activated instantly. Premium auto-deducted weekly via UPI mandate.
     ↓
CONTINUOUS MONITORING (every 30 minutes)
Node.js cron job polls:

OpenWeatherMap API  → Rainfall + Temperature per pin code
OpenAQ API         → Real-time AQI per zone
Mock Status Monitor → Zomato/Swiggy platform uptime
 ↓


TRIGGER DETECTION
Threshold breached in Ravi's pin code during active hours?
Rain > 40mm / AQI > 300 / Temp > 44°C / Platform down > 2hrs
     ↓
AI FRAUD VALIDATION
Stage 1 — Rules Engine:
GPS zone check + platform activity check + duplicate check
Stage 2 — Claude API:
LLM reasons over full context → Approve / Flag / Reject
     ↓
AUTOMATIC PAYOUT
Razorpay initiates UPI transfer.
Ravi gets SMS: "₹320 credited for rain disruption."
Total time: under 5 minutes.
     ↓
DASHBOARD UPDATE
Worker → earnings protected, payout history, active coverage
Admin  → trigger events, claims, fraud flags, analytics

---

## Parametric Triggers

GigShield uses four automated parametric triggers with
clearly defined objective thresholds.

| Trigger | Data Source | Threshold | Payout |
|---------|------------|-----------|--------|
| Heavy Rain / Floods | OpenWeatherMap API | Rainfall > 40mm in 3 hours | ₹300–₹600 |
| Severe AQI / Pollution | OpenAQ API | AQI > 300 for 4+ hours | ₹200–₹400 |
| Extreme Heat | OpenWeatherMap API | Temp > 44°C for 5+ hours (11AM–4PM) | ₹150–₹300 |
| Platform Downtime | Mock Status Monitor | Outage > 2hrs during 6PM–10PM | ₹200–₹400 |

---

## Weekly Premium Model

GigShield operates on a weekly premium structure aligned
with how delivery platforms pay their partners.

### Premium Calculation Formula
Weekly Premium =
Base Score (zone flood risk + active hours risk)
× Dynamic Multiplier (7-day weather forecast)
× (1 - Loyalty Discount)
Floor: ₹39/week
Hard Cap: ₹199/week
Max week-on-week increase: 40%

### Dynamic Risk Multipliers

| Forecast Condition | Multiplier |
|-------------------|-----------|
| No disruption forecast | 1.0× |
| Moderate rain forecast | 1.3× |
| Heavy rain forecast | 1.6× |
| Extreme rain / flood | 2.0× |
| AQI forecast above 300 | 1.4× |
| Multiple triggers | 2.5× (cap) |

### Coverage Tiers

| Tier | Weekly Premium | Coverage Cap |
|------|---------------|-------------|
| Basic | ₹39–₹69 | ₹800/week |
| Standard | ₹70–₹119 | ₹1,500/week |
| Premium | ₹120–₹199 | ₹2,000/week |

### Coverage Scope

Covered:
- Heavy rain or flooding in active delivery zone
- Severe air pollution (AQI above 300)
- Extreme heat events (above 44°C sustained)
- Platform downtime exceeding 2 hours during peak hours

Not covered (hard exclusions):
- Vehicle repairs or damage
- Health issues, injuries, or accidents
- Personal reasons or voluntary inactivity
- Events outside registered active zone

---

## Policy Rules and Financial Protection

### Payout Frequency by Enrollment Age

| Enrollment | Max Payouts/Week | Cooling Period |
|-----------|-----------------|----------------|
| Weeks 1–3 | 0 (waiting period) | No claims |
| Weeks 4–8 | 1 payout/week | 7-day full cooling |
| Weeks 9–16 | 2 payouts/week | 48hr same trigger |
| Weeks 17–28 | 3 payouts/week | 48hr same trigger |
| Week 29+ | 4 payouts/week | 48hr same trigger |

### Financial Safeguards

- Weekly coverage cap per tier (₹800 / ₹1,500 / ₹2,000)
- Annual claim limit: 20× total premiums paid in 12 months
- Lifetime ratio guard: total payouts cannot exceed 15× total premiums
- Post-claim cancellation lock: 2-week lock after any payout
- Re-enrollment waiting period resets on cancellation
- Zone-level aggregate cap: ₹50 lakhs/week per pin code
- Reinsurance buffer for catastrophic events

---

## AI and ML Integration

### Layer 1: Dynamic Premium Calculation
**Technology:** Node.js Pricing Engine

Actuarial risk formula using:
- Zone flood history score (data/floodRisk.json)
- Live rainfall data (OpenWeatherMap API)
- Live AQI readings (OpenAQ API)
- Live temperature (OpenWeatherMap API)
- Worker's active hours pattern
```javascript
riskScore =
  (0.5 × floodRisk)
+ (0.3 × rainfallFactor)
+ (0.1 × tempFactor)
+ (0.1 × aqiFactor)

premium = expectedLoss × (1 + margin) + baseFee
```

### Layer 2: Fraud Detection
**Technology:** Rules Engine (Node.js) + Claude API

Stage 1 — Rules Engine:
- GPS zone activity check
- Platform app session check
- Duplicate claim check
- Cooling period validation

Stage 2 — Claude API:
- Receives trigger data + worker history + zone report
- Returns: Approve / Flag / Reject with reasoning
- Catches edge cases pure rules miss

### Layer 3: Predictive Risk Intelligence
**Technology:** Admin Dashboard Analytics

Weekly forecast of disruption probability per zone.
Pre-provisions payout reserves before events occur.

---

## Tech Stack

### Frontend
| Component | Technology |
|-----------|-----------|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| HTTP Client | Axios |

### Backend
| Component | Technology |
|-----------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Authentication | JWT + OTP |
| Trigger Scheduler | Node-cron |
| MongoDB Client | Mongoose |

### Database
| Component | Technology |
|-----------|-----------|
| Primary Database | MongoDB Atlas (free tier) |

### AI and Integrations
| Component | Technology |
|-----------|-----------|
| Fraud Validation | Claude API (Anthropic) |
| Weather Data | OpenWeatherMap API |
| AQI Data | OpenAQ API |
| Platform Monitor | Mock webhook (in-house) |
| Payment Processing | Razorpay Test Mode |

### Deployment
| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

## Database Schema
workers       → name, phone, email, partnerId,
zone, pinCode, upiId, activeHours,
isVerified, platform
policies      → workerId, weeklyPremium, premiumTier,
coverageCap, status, enrollmentWeeks,
payoutsThisWeek, lastPayoutTime,
renewalDate, riskScore
triggers      → type, pinCode, threshold,
actualValue, timestamp, affectedWorkers[]
claims        → workerId, triggerId, payoutAmount,
status, fraudScore, llmVerdict,
rejectionReason
fraud_flags   → claimId, reason, llmReasoning,
resolvedBy, resolvedAt
payouts       → claimId, workerId, amount, upiId,
razorpayRef, status, timestamp

---

## Project Structure
GigShield/
├── server/                   ← Node.js Backend
│   └── src/
│       ├── models/           ← Mongoose schemas
│       ├── routes/           ← API route definitions
│       ├── controllers/      ← Request handlers
│       ├── services/
│       │   ├── pricingEngine.js    ← Premium calculation
│       │   ├── weatherService.js   ← OpenWeatherMap calls
│       │   ├── policyEngine.js     ← Eligibility rules
│       │   ├── claimService.js     ← Claims processing
│       │   ├── fraudService.js     ← Fraud detection
│       │   └── payoutService.js    ← Razorpay payouts
│       ├── middleware/
│       │   └── authMiddleware.js   ← JWT verification
│       ├── data/
│       │   └── floodRisk.json      ← Zone risk scores
│       ├── app.js
│       └── server.js
│
├── src/                      ← React Frontend
│   ├── components/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── SimulationContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Admin.jsx
│   ├── utils/
│   │   └── axiosInstance.js
│   ├── config/
│   │   └── api.js
│   └── App.jsx
│
├── public/
│   └── index.html
├── package.json
└── vite.config.js

---

## Live Demo

| Resource | Link |
|----------|------|
| Frontend | [Vercel URL] |
| Backend API | https://gigsheild-i53f.onrender.com |
| GitHub Repo | https://github.com/JeshwanthILU31/GigSheild |
| Phase 1 Video | [Loom link] |
| Phase 2 Video | [Loom link] |

---

## Development Roadmap

### Phase 1 — Ideation and Foundation (March 4–20) ✅
- [x] Problem research and persona definition
- [x] Parametric trigger design
- [x] Weekly premium model design
- [x] Tech stack finalized
- [x] README submitted
- [x] Landing page prototype deployed

### Phase 2 — Automation and Protection (March 21 – April 4) ✅
- [x] Worker registration and OTP auth
- [x] JWT authentication middleware
- [x] MongoDB schema implementation
- [x] Dynamic premium calculation engine
- [x] Policy creation and management APIs
- [x] Claims trigger and management APIs
- [x] React frontend with live API integration
- [x] Deployed on Vercel + Render

### Phase 3 — Scale and Optimise (April 5–17)
- [ ] Live OpenWeatherMap API integration
- [ ] Claude API fraud detection
- [ ] Razorpay test mode UPI payouts
- [ ] Node-cron automated trigger monitoring
- [ ] Worker dashboard — full analytics
- [ ] Admin dashboard — loss ratios, predictive analytics
- [ ] End-to-end demo simulation
- [ ] Final pitch deck (PDF)

---

## Team

| Name | Role |
|------|------|
| Kodli Kailash | Team Leader |
| Ilu Jeshwanth | Full Stack + Backend Lead |
| Jillala Mahendhar | Member |
| Yashwanth Kumar Cheruvu | Frontend |
| Podduturi Vishal Reddy | Member |

---

## Market Crash Resilience

**Weekly premium structure** provides continuous cash flow —
no annual lump-sum risk exposure.

**Parametric triggers** are based entirely on third-party
verified data — not self-reported claims. Fraud-resistant
by design, even during economic downturns.

**Dynamic re-pricing** adjusts premiums upward during
high-risk periods while honoring current week commitments.

**Hard weekly caps** prevent catastrophic exposure
(₹800–₹2,000 per worker per week).

**Pooled risk** across multiple cities ensures a localized
flood in Hyderabad is cushioned by calm-weather workers
in Bangalore and Chennai paying premiums that week.

---

*Built for Guidewire DEVTrails 2026 — Seed. Scale. Soar.*