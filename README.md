# PRD — DBS Bank India Onboarding MVP (Mobile-First)

Plain text. No code. Clean, intuitive, minimal build.

Owner: Jeremy (Lyzr)
Status: MVP — implementation-ready
Target: Bolt.new mobile web app (installable PWA)

---

## 1) Purpose (short)

Fix the first-time onboarding so a new customer can open a savings account in minutes without dead-ends. Keep scope tight: progressive consent, simple e-KYC, clear next steps, and one reliable fallback.

---

## 2) MVP Goals (measure what matters)

* **TTP (time to progress):** Phone OTP submitted in **< 30s (p50)**.
* **Completion:** Savings “Submitted/Verified or Appointment Booked” **≥ 60%** of starts.
* **Dead-ends:** **0**. Every error must offer retry or a fallback.
* **Clarity:** 90%+ users say they understand why we ask for info (usability tests).

---

## 3) In Scope (MVP only)

* Entry with **progressive permissions** (no hard wall; ask only when needed).
* **Open Savings Account** end-to-end (primary).
* **Login/Link** (lightweight) to let returning users check status.
* **Personal Loan** (stub): collect essentials and submit; full eligibility engine is out of scope.
* **KYC options (MVP):**

  1. **Aadhaar OTP e-KYC** (default)
  2. **Branch appointment** fallback
     *(Video-KYC and Offline Aadhaar XML deferred to v1.1.)*
* **PAN capture + verify** (with “Skip for now” → flagged as limited; prompts at branch).
* Address prefill from Aadhaar; minimal personal details; plan choice (3 cards) + T\&C.
* **Save & resume on same device** via phone OTP (multi-device resume deferred).
* **Mocked integrations** with deterministic responses.

Out of scope (MVP): Video-KYC, Offline Aadhaar XML, DigiLocker, CKYC fetch, credit-bureau checks, funding, re-KYC, multilingual, complex analytics.

---

## 4) Experience Principles (keep it simple)

1. **Progressive disclosure:** ask only when needed; always show a manual alternative.
2. **One identity state:** single KYC status drives the flow; never retype data.
3. **Default to e-KYC;** branch is a clear, respectful fallback (with slot booking).
4. **Plain copy & masking:** last-4 only for Aadhaar/PAN; explain limits until Full-KYC.
5. **Forward paths only:** every error offers retry or mode switch; never bounce to start.

---

## 5) MVP Workflow (customer view)

### A) Entry

* **Splash → “Why we ask” sheet (1 screen)**

  * Notifications (for OTP/status) — optional; alternative: SMS only
  * Location (for nearby branches) — optional; alternative: enter pincode
  * *No auto-read OTP permission in MVP*
* **Phone number → OTP verify**

  * If success → **Home Hub**
  * If fail → retry (limit + cool-off) or “Try SMS resend”

### B) Home Hub (3 choices)

1. **Open Savings Account** *(primary path in MVP)*
2. **Apply for Personal Loan** *(stub: form → submit → confirmation)*
3. **Login/Link Account** *(lightweight status view)*

### C) Open Savings Account (primary)

1. **PAN**

   * Input + format validation → **Verify** (mock API)
   * **Skip for now** (flag account as limited; continue; branch KYC will collect PAN)
2. **KYC Mode** *(simple picker)*

   * **Aadhaar OTP (default)**
   * **Branch appointment** (fallback)
3. **Aadhaar OTP** (if chosen)

   * Enter Aadhaar → Send OTP → Verify
   * On success: **Address Prefill** + status = **e-KYC done**
   * On failure: Retry → Offer **Switch to Branch**
4. **Address Prefill**

   * Show address from Aadhaar; allow minimal edit (Line 1/2) and confirm
5. **Personal Details (minimal)**

   * Email, Occupation (picklist), Income band (picklist), PEP (yes/no)
6. **Plan Selection (3 cards)**

   * Basic / Classic / Premium → **T\&C inline** → **Accept**
   * Copy clearly states any limits until Full-KYC
7. **Identity Confirmation & Next Step**

   * If e-KYC success: **Submitted** → show account creation “in review” + next steps
   * If Branch chosen: **Slot Picker** (nearest by pincode) → **Appointment Confirmed**
8. **Confirmation Screen**

   * Ticket ID, what’s next, add to calendar, WhatsApp help CTA, “Return to Hub”

### D) Apply for Personal Loan (stub)

* **Preview** (docs & steps) → **PAN + Aadhaar OTP** (or Branch) → **Employment + Income band** → **Submit Application**
* **Result:** “We’ve received your request. A banker will follow up.” (No eligibility engine in MVP)

### E) Login/Link Account (light)

* Phone OTP → show **KYC status** & **Application status** (if any) → CTAs: “Finish KYC / View Appointment”

---

## 6) Screen List (MVP)

01 Splash & language
02 Why we ask (permissions rationale)
03 Phone → OTP
04 Home Hub (Savings • Loan • Login/Link)
05 PAN (verify or skip)
06 KYC mode chooser (Aadhaar OTP • Branch)
07 Aadhaar OTP (send/verify)
08 Address confirm/edit (prefilled)
09 Personal details (minimal)
10 Plans (cards) → T\&C (inline)
11 Branch slot picker (if chosen)
12 Confirmation (ID, next steps)
13 Error/Retry (shared component)

*Each screen must define: purpose, inputs, primary/secondary actions, validation, failure states, telemetry event name.*

---

## 7) Data Collected (only what’s needed)

* **Contact:** Phone (E.164), Email
* **Identity:** PAN (masked after capture; or skipped), Aadhaar (masked), KYC mode + status
* **Address:** Line 1/2, City, State, Pincode, Country (prefill from Aadhaar where possible)
* **Personal:** Occupation (picklist), Income band (picklist), PEP (yes/no)
* **Plan:** Selected plan, T\&C version, acceptance timestamp
* **Appointment (if branch):** Branch name/ID, slot date/time, confirmation ref
* **Audit:** Consents (purpose, version, status, timestamp), key events (OTP sent/verified, Aadhaar verified, PAN verified, plan accepted, appointment booked)

---

## 8) Integrations (mocked in MVP)

* **PAN Verify:** status + optional name/DOB match (deterministic mock)
* **Aadhaar OTP:** send/verify (deterministic mock)
* **Branch Finder:** by pincode (mock list)
* **Appointment Booking:** create confirmation ref (mock)

*Live switches, CKYC, DigiLocker, Video-KYC, Offline XML → v1.1+.*

---

## 9) Validation & Rules (MVP)

* Phone OTP: 4–8 digits; **5 attempts/hour** then cool-off
* PAN: 10-char pattern; if skipped, mark application as **limited** and show copy explaining limits
* Aadhaar: 12 digits; mask immediately after capture; retry then offer branch fallback
* Pincode: 6 digits
* Required fields clearly marked; DOB/age not collected in MVP to keep scope tight
* File uploads **not** in MVP (no DigiLocker/XML)

---

## 10) Error → Fallback Matrix (must implement)

* **OTP failure:** Resend (timer) → switch channel message → cool-off → “Contact support” CTA
* **PAN verify fail:** Re-enter → Skip for now (limited)
* **Aadhaar OTP fail:** Retry → **Switch to Branch appointment**
* **No branch slots:** Show next 7 days or nearest branch alt; allow “Notify me” via SMS
* **Network timeout:** Non-blocking toast + retry; progress preserved on device

---

## 11) Privacy, Consent, Security (product-level)

* Mask PAN/Aadhaar (show last 4) in UI and logs.
* No OTP stored post-validation.
* Consent ledger records purpose (notifications, location), status, version, timestamp.
* HTTPS only; minimal data retention in MVP; easy “delete draft” option in settings/help.

---

## 12) Analytics (small but useful)

Funnel events (names in quotes):

* “otp\_started” → “otp\_verified” → “hub\_viewed” → “pan\_verified|pan\_skipped” → “kyc\_mode\_selected” → “aadhaar\_verified|branch\_selected” → “address\_confirmed” → “personal\_saved” → “plan\_selected” → “tnc\_accepted” → “submitted|appointment\_booked”
  KPIs: funnel conversion, KYC mode split, retries per step, error codes count.

---

## 13) Acceptance Criteria (MVP must-pass)

1. A user can complete Savings onboarding via **Aadhaar OTP** or **Branch appointment** without a dead-end.
2. If Aadhaar OTP fails, the app **offers Branch** and completes booking in-flow.
3. PAN can be **verified** or **skipped**; skipped flows show “limited until branch KYC” copy.
4. Plans show **one screen** with three cards; T\&C is **inline** with version recorded.
5. All sensitive numbers are **masked immediately** after capture.
6. Errors never reset progress; user resumes from the failed step on the **same device**.
7. Analytics emits the funnel events listed above.
8. Consent ledger entries exist for every optional permission requested.
9. Confirmation screen shows a ticket/confirmation ID and clear next steps.
10. The build fits on **≤ 13 screens** listed in Section 6.

---

## 14) Release Plan (keep momentum)

* **Week 1–2:** UX copy, flows, mocked APIs, OTP + Hub + PAN + KYC chooser.
* **Week 3:** Aadhaar OTP, Address Prefill, Personal, Plans + T\&C, Confirmation.
* **Week 4:** Branch booking, error/fallbacks, masking, analytics, polish.
* **Post-MVP (v1.1):** Video-KYC, Offline Aadhaar XML, CKYC/DigiLocker, multi-device resume, Hindi.

---

## 15) Open Decisions (resolve quickly)

* Exact copy for “limited until branch KYC” and plan-specific limits.
* Minimum branch slot inventory to seed mocks (per city).
* Whether to require PAN for plan **Premium** in MVP (Yes/No).
* Support WhatsApp reminders for appointments in MVP (Yes/No).

---

## 16) Hard-Truth Guardrails (don’t regress)

* No permission wall.
* No forms without a visible **fallback**.
* No dead-ends.
* No unmasked PAN/Aadhaar anywhere.
* No multi-step T\&C pages—**inline only**.

This is the smallest honest product that feels smooth, trustworthy, and demonstrably better than today—without overbuilding.
