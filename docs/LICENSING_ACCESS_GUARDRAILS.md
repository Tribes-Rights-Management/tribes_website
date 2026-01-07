# Licensing Access Model — Architectural Guardrails

This document defines permanent constraints for the licensing access system.
These rules must not be violated by future development.

---

## Core Invariants

### 1. No Public Licensing Forms

All license request functionality must be gated behind authentication.
Public users cannot submit license requests under any circumstances.

**Violations:**
- Exposing `/request-license` or similar routes publicly
- Creating "quick quote" or "instant license" flows without authentication
- Allowing guest submissions with email-only verification

### 2. Account Approval Required

Before any licensing activity can occur:
- User must submit a Licensing Account Request
- Request must be reviewed and approved by admin
- Only approved accounts can access license request forms

**The approval step is non-negotiable.**

### 3. Licensing ≠ Client Relationship

These are distinct flows and must never be conflated:

| Licensing Access | Client Inquiry |
|-----------------|----------------|
| Transactional | Relationship |
| Account approval gate | No account created |
| Portal access granted | Consultation/representation |
| `/licensing` route | `/inquire` route |

**Violations:**
- Merging inquiry and licensing forms
- Implying licensing approval grants client status
- Using "become a client" language on licensing pages

### 4. Audit Trail Integrity

All licensing activity must maintain permanent records:
- Account request submissions
- Approval/rejection decisions
- License requests, modifications, and executions
- Status changes with actor attribution

**Records cannot be deleted.** Corrections require supersession workflow.

---

## CTA Hierarchy (Global)

### Primary: "Request Licensing Access"
- Purpose: For users who need to license music
- Destination: Licensing Account Request page
- Requires: Account approval before license submission

### Secondary: "Inquire About Services"
- Purpose: For rights holders exploring representation
- Destination: Service Inquiry page
- Does NOT create platform accounts

### Utility: "Client Sign In"
- Purpose: Existing approved users only
- No marketing emphasis

---

## Prohibited Patterns

The following implementations are **strictly forbidden**:

1. ❌ Public license request forms
2. ❌ "Quick license" flows bypassing approval
3. ❌ Merging client inquiry with licensing access
4. ❌ Guest/anonymous license submissions
5. ❌ "Apply now" or urgency-based CTAs
6. ❌ Deleting or hiding audit records
7. ❌ Implying licensing approval at account stage

---

## Validation Checklist

Before merging any licensing-related changes, verify:

- [ ] License forms are NOT publicly accessible
- [ ] Account approval gate is intact
- [ ] Licensing and inquiry flows remain separate
- [ ] CTAs use approved language only
- [ ] No marketing/urgency language on licensing pages
- [ ] Audit logging is preserved for all actions

---

## Change Control

Any modification to this access model requires:
1. Documented business justification
2. Security review for data access implications
3. Audit trail impact assessment
4. Explicit approval from system owners

This document serves as the canonical reference for licensing access architecture.
