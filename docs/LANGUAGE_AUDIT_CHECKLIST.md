# Language Audit Checklist

This document ensures clean separation between marketing pages, client inquiry flows, and licensing portal UI.

---

## Zone Definitions

### Marketing Pages
**Purpose:** Explain what Tribes does and who it is for.

**Allowed:**
- Descriptive, factual language
- Who it's for, what services exist
- Institutional positioning

**Prohibited:**
- Operational language (submit, approve, execute, license status)
- Account access language
- Portal terminology
- Transactional CTAs

**Example phrases:**
- ✅ "Rights administration with accuracy and continuity"
- ✅ "Publishing administration, built for precision"
- ❌ "Submit your request"
- ❌ "Check your license status"

---

### Client Inquiry Flow
**Purpose:** Relationship discussion for potential representation.

**Allowed:**
- Long-term, stewardship-focused language
- Relationship terminology (representation, administration, catalog oversight)
- Neutral inquiry language

**Prohibited:**
- Transactional language
- Portal/login terminology
- License request language
- Account access language

**Example phrases:**
- ✅ "Inquire About Services"
- ✅ "Long-term stewardship and accountability"
- ✅ "Our team reviews all inquiries"
- ❌ "Request access"
- ❌ "Submit license request"
- ❌ "Sign in to your account"

---

### Licensing Portal
**Purpose:** Transactional clarity for approved users.

**Allowed:**
- Precise, operational language
- Status terminology (Draft, Submitted, Under Review, etc.)
- Functional CTAs (Submit for Review, View Record)

**Prohibited:**
- Marketing language
- Aspirational copy
- Promotional adjectives
- Relationship terminology

**Example phrases:**
- ✅ "License Request"
- ✅ "Account Approval"
- ✅ "Submit for Review"
- ❌ "Powerful platform"
- ❌ "Seamless experience"
- ❌ "Join our community"

---

## CTA Mapping

Each CTA must map to exactly one intent:

| CTA | Intent | Destination | Creates Account? |
|-----|--------|-------------|------------------|
| Request Licensing Access | Portal approval | /licensing | Yes (pending) |
| Inquire About Services | Relationship discussion | /inquire | No |
| Client Sign In | Existing approved users | /auth | No |

---

## Terminology Standards

### Use:
- "License Request" (not "application")
- "Account Approval" (not "onboarding")  
- "Inquiry" (not "apply" or "join")
- "Request Licensing Access" (not "Create account")

### Avoid:
- "Apply now"
- "Get started"
- "Join"
- "Onboard"
- "Unlock"
- "Optimize"

---

## Page-by-Page Verification

### Marketing Page (/)
- ✅ Explains what Tribes does
- ✅ No operational language
- ✅ No account access language
- ✅ CTAs clearly separated

### Services Page (/services)
- ✅ Factual service descriptions
- ✅ No transactional language
- ✅ CTAs use correct terminology

### Service Inquiry (/inquire)
- ✅ "Inquire About Services" title
- ✅ Relationship-focused copy
- ✅ Explicit: "This does NOT create account"
- ✅ No portal/access language

### Licensing Account (/licensing)
- ✅ "Request Licensing Access" title
- ✅ Clear approval requirement
- ✅ Explicit: "This does NOT imply license approval"
- ✅ No relationship/representation language

### Contact (/contact)
- ✅ Neutral, general inquiries
- ✅ Separate links for each intent
- ✅ No conflated messaging

---

## Audit Questions

For each page, verify:

1. **What is this for?**
   - Answer must be singular and clear

2. **What is this NOT for?**
   - Must be explicitly stated or obvious

3. **Does any phrase suggest:**
   - [ ] Licensing without approval? → FIX
   - [ ] Representation without review? → FIX
   - [ ] Inquiry = access? → FIX

4. **Are CTAs singular in intent?**
   - [ ] Each button leads to one clear action
   - [ ] No conflated messaging

---

## Prohibited Phrases (Global)

Never use on any page:
- "Get started"
- "Apply now"
- "Join our platform"
- "Unlock access"
- "Start licensing"
- "Become a member"
- "Sign up for access"
- "Powerful", "Seamless", "Optimized"
- "Effortless", "Scale", "Growth"

---

## Maintenance

Before merging any copy changes:
1. Run this checklist against affected pages
2. Verify CTA intent mapping
3. Confirm no prohibited phrases
4. Test that each page answers "What is this for?"
