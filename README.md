# WCAG Accessibility Lab

Reconstructed to follow the Open Door Design Lab structure used by the CPACC Accessibility Lab and governed by the DesignPhilosophyAndStandards repository.

## Open Door Design visual standard applied

This project uses the Open Door Design AAA-oriented visual standard. The interface avoids blue/green pairings, uses green as the single brand accent, uses dark neutral text for structure, and uses a high-visibility gold focus indicator. Returned project archives intentionally exclude the `.git` directory.

## Visual remediation

The WCAG principle selector now presents each checkbox, principle name, and description as a distinct readable option. The skip link also sizes to its text instead of wrapping into a narrow fixed-width control. These changes preserve native checkbox labeling, keyboard operation, focus visibility, and screen-reader output.

## Question Bank Expansion (This Session)

**Objective given:** expand the question bank toward roughly 1,200 to 1,500 total questions, adding professional-consultant-style scenario questions (Multi-Success-Criterion Analysis, User Impact, Remediation Planning, Severity Assessment, Prioritization, Audit Documentation, Best Next Action, Root Cause Analysis) across realistic industries, on top of the existing Recall/Recognition/Application questions, while changing nothing about the existing architecture, removing nothing, and reducing nothing.

**What was actually delivered, stated precisely rather than rounded up:** 108 new questions were added, bringing the total from 234 to **342** (a 46% increase). This falls well short of the 1,200-1,500 target range. That gap is being stated plainly here rather than implied to be closed, because generating over a thousand genuinely distinct, professionally accurate, non-repetitive questions - the explicit quality bar this task set - is not achievable with real per-question craftsmanship in a single working session. The alternative, mechanically padding toward the target number with templated or shallow filler, would have violated the task's own instruction to avoid repetitive, trivia-style questions. This session prioritized genuine quality and reasoning depth over raw count, and is delivered as a substantial first expansion phase, not a claim that the full target was reached.

### What was added

**9 Success Criteria that did not exist anywhere in this Lab's data were added first.** `WCAG_DATA` (the source-of-truth Success Criterion reference array) was missing 2.4.11, 2.4.12, 2.4.13, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8, and 3.3.9 - all real WCAG 2.2 criteria - entirely. These were added with accurate official criterion text, and each received the same baseline Recall/Recognition/Application coverage (3 questions each, 27 total) the other 78 criteria already had, bringing this Lab's criterion coverage to 87 and ensuring every criterion has *some* question coverage before any deeper scenario work began.

**41 realistic, independent scenario questions were written across the requested industries**, each scenario grounded in a specific, plausible situation (not a generic template) and producing multiple independent questions - identify the criterion, determine affected users, assign severity, recommend remediation, determine priority, identify root cause, recognize when multiple criteria are involved, write an audit finding, or choose the best next action - covering:

- Banking (mobile check deposit dragging interaction)
- Healthcare (patient portal redundant data entry, traced to a shared root-cause component across four separate flows)
- Government (a scanned, textless benefits-eligibility PDF)
- Education (a rigid LMS quiz timer with accommodation implications)
- E-commerce (color-only sale/stock badges; a shopping cart quantity stepper with no accessible name or state)
- Social media (an infinite-scroll feed with no bypass mechanism, compounded by autoplaying audio)
- Travel (a keyboard-inaccessible flight date picker)
- Streaming media (incomplete captions and missing audio description, prioritized against production cost)
- Enterprise dashboards (a multi-line chart failing contrast, color-only distinction, and keyboard data access together)
- Restaurant ordering (a silently-failing Add to Cart button traced to a code regression)
- Authentication (a drag-puzzle CAPTCHA with no accessible alternative, including a worked negotiation with a security team's objection)
- Documents (an insurance PDF with no heading structure, no table headers, and meaningless title metadata)
- Mobile applications (pinch-to-zoom with no single-pointer alternative, including a worked negotiation with a design team's minimalism concern)
- Enterprise HR software (a performance-review form's session timeout losing 40 minutes of written feedback, spanning three related timing criteria)
- Shopping cart checkout (a worked example of correctly recognizing when a criterion is *not* violated, alongside a real violation on the same page)
- Direct messaging (typing indicators and read receipts with no live-region announcement, including a worked example of choosing polite over assertive urgency)

A further batch of shorter, targeted scenario questions specifically filled in coverage gaps for Success Criteria the main scenarios above had not yet touched (1.3.2, 1.3.3, 1.3.4, 1.2.4, 2.4.5, 3.2.4, 1.4.10, 2.1.4), rather than leaving them with only their original baseline questions.

**Difficulty progression:** the new questions span the existing easy/medium/hard schema (this Lab's actual difficulty filter only supports three tiers, not the four - Beginner/Intermediate/Advanced/Expert - that were requested; see Architecture Note below), weighted toward medium and hard given the reasoning-heavy nature of scenario analysis, with the most complex multi-criterion and root-cause questions authored at "hard."

### Coverage

- **All 87 Success Criteria now have at least one question** (previously 9 had zero, since they were missing from the data entirely).
- **35 of 87 Success Criteria received deeper, scenario-based reasoning coverage** beyond their baseline three questions, spanning all four WCAG Principles.
- **11 distinct question types are now represented**: the original Recall, Recognition, and Application, plus the newly added User Impact, Severity Assessment, Remediation Planning, Prioritization, Audit Documentation, Multi-Success-Criterion Analysis, Root Cause Analysis, and Best Next Action.

### Architecture note: one real conflict found and resolved

The task asked for a Beginner/Intermediate/Advanced/Expert difficulty progression. This Lab's actual filtering logic and UI (`app.js`, `index.html`) only define three difficulty values: easy, medium, hard - there is no fourth tier anywhere in the existing dropdown or filter code. Per this task's explicit instruction not to change the existing architecture, a fourth UI-level tier was not added. The initial draft of this expansion mistakenly tagged its hardest questions "expert" anyway; this was caught by a schema-validation pass run against the actual question array before packaging (a real mistake, not a hypothetical one - 16 questions were affected) and corrected by remapping those questions to "hard," the existing top tier, before delivery.

### Integration approach

All new content lives in a new file, `wcag-lab-expansion.js`, loaded via a new `<script>` tag in `index.html` between `wcag-data.js` and `app.js`. It appends its questions to the existing `window.WCAG_LAB_DATA.questions` array at load time and does not modify, reorder, or remove a single existing question. The 9 new Success Criteria were added to the end of the existing `WCAG_DATA` array in `wcag-data.js` itself, since that array is the shared source of truth the Lab's UI reads criterion metadata from, and adding them there (rather than only in the new file) keeps that metadata available Lab-wide, consistent with how the other 78 criteria are defined.

### Verification performed before packaging

- All three JavaScript files (`wcag-data.js`, `wcag-lab-expansion.js`, `app.js`) pass Node's syntax check.
- Every one of the 342 questions was validated against the existing schema: valid domain, valid mode, valid difficulty, exactly 4 choices, an in-bounds answer index, non-empty question and explanation text, and a `scNumber` that resolves to a real entry in `WCAG_DATA`. Zero failures after the difficulty-tier fix above.
- Zero duplicate question IDs across all 342 questions (108 new IDs checked against the 234 existing ones).
- Zero exact-duplicate question text anywhere in the bank.
- The actual filtering logic used by the running app (`getAvailableQuestions()`) was simulated directly against the full, integrated question array: every domain/mode combination returns a non-zero question count, and Sprint mode correctly pulls from all 342 questions regardless of mode tag.
- The correct-answer-index convention already used by all 234 pre-existing questions (correct answer always authored at index 0, shuffled at runtime by the existing `randomizeChoiceOrder()` function before display) was confirmed and matched exactly by all 108 new questions, rather than introducing an inconsistent authoring pattern.

### Remaining work toward the 1,200-1,500 target

This is real, substantial, unfinished work, not a rounding error:

1. **Roughly 850-1,150 more questions** would be needed to reach the requested range at the same quality bar. Realistically, this means several more sessions of the same kind of work done here: real scenarios, not templates.
2. **52 of 87 Success Criteria still have only their baseline 3 questions** and have not yet received scenario-based, multi-category coverage. A prioritized list would start with the highest-impact criteria not yet touched: 1.4.3, 1.4.4, 1.4.5, 2.3.1, 2.4.3, 2.4.4, 2.4.6, 2.4.7, 2.5.2, 2.5.3, 2.5.5, 2.5.6, 3.1.1 through 3.1.6, 3.2.1, 3.2.3, 3.2.5, 3.3.2, 3.3.3, 3.3.5, 3.3.6.
3. **Industries named in the task but not yet represented in a scenario**: none were skipped entirely, but Enterprise Applications, Dashboards, and Forms were covered lightly (folded into other industry scenarios) rather than given their own dedicated scenario the way Banking, Healthcare, and Government were.
4. **A true four-tier difficulty system** was not implemented, since it would require changing the existing filter UI and filtering logic - a deliberate architecture change this task's own instructions said not to make without being asked for explicitly. If a four-tier system is wanted, that should be raised as its own explicit request, since it touches `app.js` and `index.html`, not just the question data.


## Scenario Family Expansion (This Session)

Following feedback that the first expansion's scenarios (typically 4-6 questions each) were a good direction but not yet the depth wanted, this session built full **scenario families**: connected, multi-page products where each page contributes several independent questions, functioning together as a miniature accessibility audit of one realistic product rather than a single isolated situation.

**4 scenario families were added, totaling 66 new questions** (bringing the running total from 342 to **408**):

- **Banking Portal** (20 questions) - Login, Account Dashboard, Transfer Funds, Statements, Chat Support. Includes a worked example of tracing four related timing/data findings on the Transfer Funds page back to one coordinated remediation, and a Chat Support finding correctly redirected toward a third-party vendor relationship rather than assumed to be fixable in-house.
- **Hospital Portal** (17 questions) - Appointment Scheduling, Medical Records, Prescription Refill, Telehealth Video Visit, Billing. Includes a worked example distinguishing 3.3.1 from 3.3.3 on the same error message, and a Level AAA reading-level finding applied deliberately to one high-stakes page (a billing dispute) rather than assumed irrelevant just because it's AAA.
- **University Registration Portal** (14 questions) - Course Search, Registration Cart, Financial Aid, Degree Audit, Campus Map. Includes two consecutive questions on the same progress-ring component, one correctly identifying that a criterion does *not* clearly apply, the next identifying a genuine, different violation on that same component - deliberately testing the discipline of not over-flagging.
- **Shopping Platform** (15 questions) - Product Browse, Product Detail, Cart, Checkout, Order Tracking. Includes a pair of consecutive cart questions testing the same criterion (3.2.2 On Input) against two similar-looking but differently-resolved interactions on the same page - one a non-violation, one a real violation - specifically to build the judgment skill of not treating every dynamic update as automatically suspect.

Each family spans multiple WCAG Principles and multiple question categories (not just Application questions repeated five times), and several families include deliberately paired questions that test recognizing when a criterion does *not* apply, not only when it does - since real audit judgment requires both skills.

**A mistake repeated from the first expansion, caught the same way:** the same "expert" difficulty-tier error from the first session's Architecture Note below happened again in this session's family files (11 instances this time). It was caught the same way, by running the schema validation pass before packaging, not before writing the content. On the first fix attempt, a plain string replace missed all 11 instances because these newer files were authored with slightly different JSON spacing (`"difficulty":"expert"` with no space after the colon, versus `"difficulty": "expert"` with a space in the first expansion file) - inconsistent formatting between the two expansion files that a naive search missed. The fix was redone with a spacing-tolerant pattern and re-verified at zero errors before packaging. This is recorded here because catching a mistake on the second pass, after already documenting the same mistake once, is worth being honest about rather than quietly re-fixing and moving on.

### Updated totals

- **Total questions: 408** (234 original + 108 first-session scenarios + 66 this session's families).
- **39 of 87 Success Criteria now have deep, scenario-based coverage** beyond baseline (up from 35), with all 4 families deliberately touching a mix of previously-covered and previously-baseline-only criteria.
- **11 question types represented**, same set as the first expansion, with Application, Remediation Planning, Recall, and Recognition now the largest categories given the family structure's page-by-page identify-then-fix rhythm.

### Verification performed before packaging

Identical discipline to the first expansion, re-run against the fully combined three-file dataset (`wcag-data.js` + `wcag-lab-expansion.js` + `wcag-lab-expansion-2.js`): all files pass syntax check; all 408 questions validated against the schema (valid domain, mode, difficulty, 4 choices, in-bounds answer, non-empty question/explanation, resolvable scNumber); zero duplicate IDs across all 408; zero duplicate question text; zero Success Criteria with no coverage; the actual `getAvailableQuestions()` filtering logic simulated against the full integrated array confirms every domain/mode combination returns questions and Sprint mode correctly pulls all 408.

### Still not the final destination

This session added depth (families) rather than raw breadth toward 1,200-1,500. Honestly stated, still remaining:

1. **48 of 87 Success Criteria** still have only their baseline 3 questions and no family or scenario coverage.
2. **Named industries not yet given their own family**: Social Media, Travel, Streaming Media, Restaurant Ordering, Authentication (as a dedicated family beyond the shorter scenario from the first expansion), Documents, Mobile Applications, Enterprise Applications/Dashboards, Forms (as their own family rather than folded into other families).
3. At 66 questions per session for a 5-page family, reaching the 1,200-1,500 range through this same family structure implies roughly 12-15 more families of similar depth - a realistic, multi-session roadmap, not a next-session finish line.


## Progressive Difficulty and Continued Family Expansion (This Session)

Following the recommendation to introduce progressive scenarios (revisiting one domain at increasing difficulty, not just adding breadth) and to continue building named industry families, this session added **51 new questions**, bringing the running total from 408 to **459**.

### Progressive difficulty, demonstrated for the first time

**Government Services Portal A / B / C** (28 questions total: 11 + 10 + 7) is this Lab's first deliberately progressive family, built specifically to demonstrate the pattern for future sessions to follow:

- **Portal A (beginner)** - single, clear-cut issues, one per question, across a Benefits Application Landing page, License Renewal form, Document Upload, and Payment - easy/medium difficulty, straightforward identification.
- **Portal B (intermediate)** - multiple *interacting* failures across a Multi-Step Eligibility Wizard, an Appeals Process, and Notification Preferences. Includes a deliberately constructed pair of questions where the same page satisfies one timing criterion (2.2.1, warning-and-extension) while separately violating a closely related one (2.2.6, advance disclosure) - built specifically to test distinguishing between similar criteria rather than pattern-matching "timeout = violation."
- **Portal C (advanced)** - genuinely ambiguous edge cases requiring professional judgment: a fraud-prevention team's legitimate objection to an accessible-authentication finding; evaluating whether a documented accessibility-statement limitation is professionally honest or a cop-out; whether a legally-mandated same-day deadline can defensibly claim 2.2.1's essential-timing exception; and catching a *new* violation (a keyboard trap) introduced by a well-intentioned fix for a different one (3.3.4). None of Portal C's seven questions have an obviously "correct-sounding" wrong answer removed for convenience - they are built to require actual reasoning about competing legitimate constraints, not just criterion lookup.

This existing Banking Portal family (from the first scenario-family session) was **not** retroactively relabeled "Portal A" or restructured, per the standing instruction not to modify previously added content. The progressive pattern starts fresh with Government Services and is intended as the template for revisiting other existing families (Banking, Hospital, University, Shopping) with their own B and C tiers in future sessions, rather than renaming what already exists.

### Two further single-tier families

- **Airline Booking Platform** (12 questions) - Flight Search, Seat Selection, Passenger Details, Baggage & Add-ons, Boarding Pass/Check-in. Includes a deliberately layered pair of findings on the same seat map component (missing accessible names/state, and a separate color-only availability indicator) to reinforce that fixing one does not automatically fix the other.
- **Social Media Platform** (11 questions) - News Feed, Post Composer, Notifications, Profile Settings, Direct Messaging. Includes a Root Cause Analysis question specifically framing a missing alt-text *field* (not missing alt text itself) as a platform-level responsibility distinct from any individual user's content choices.

### A mistake that recurred a third time, and what changed as a result

The "expert" difficulty-tier mistake, already documented twice in this README, happened again in this session's files - 11 more instances. It was caught the same way, by running schema validation before packaging rather than trusting the draft. This is the third consecutive session this exact mistake has occurred, which says something worth stating plainly: documenting a mistake in a README does not, by itself, prevent repeating it in a later session with no memory of the earlier note. What actually changed this time is a difference in process, not just outcome: before running the full validation script, a fast, targeted check was run first (`grep` for every distinct `"difficulty"` value actually present in the new file) specifically because this exact failure mode was expected going in, and the same spacing-tolerant fix from last session was applied immediately once it appeared, rather than being rediscovered from scratch. Total time to catch and fix was faster as a direct result, even though the mistake itself still happened. Future sessions extending this Lab should treat "grep the difficulty field before validating" as a standing pre-check, not an occasional one.

### Updated totals

- **Total questions: 459** (234 original + 108 + 66 + 51 across three expansion sessions).
- **44 of 87 Success Criteria now have deep, scenario-based coverage** beyond baseline (up from 39).
- Question type distribution now: Application (177), Recognition (97), Recall (87), Remediation Planning (35), Multi-Success-Criterion Analysis (12), User Impact (13), Root Cause Analysis (8), Best Next Action (8), Audit Documentation (7), Severity Assessment (10), Prioritization (5).

### Verification performed before packaging

Identical discipline, re-run against the fully combined four-file dataset (`wcag-data.js` + all three expansion files): all files pass syntax check; all 459 questions validated against the schema; zero duplicate IDs; zero duplicate question text; zero Success Criteria with no coverage; the actual `getAvailableQuestions()` filtering logic simulated against the full array confirms every domain/mode combination returns questions and Sprint mode correctly pulls all 459.

### Still not the final destination

1. **43 of 87 Success Criteria** still have only baseline coverage.
2. **Named industries still without a dedicated family**: Hotel Reservation, Streaming Media, Enterprise Dashboards, Document Accessibility (as its own family, beyond the shorter scenario in the first expansion), Mobile Applications (as its own family), Authentication and Account Management (as its own family), Complex Forms, Maps and Geospatial Interfaces, Collaboration Tools, Healthcare Administration (distinct from the existing Hospital Portal, which is patient-facing), Financial Reporting, Learning Management Systems.
3. **The progressive A/B/C pattern exists for exactly one family** (Government Services). Extending it to the four existing single-tier families (Banking, Hospital, University, Shopping) by adding their own B and C tiers is real, valuable, unstarted work - a natural next step given those families' foundational content already exists.


## Continued Breadth-First Coverage (This Session)

Per the "coverage map, breadth first, then depth" direction, this session added **37 new questions** across four further foundational, single-tier industry families, bringing the running total from 459 to **496**:

- **Hotel Reservation Platform** (11 questions) - Property Search, Room Selection, Guest Details & Booking, Amenities & Reviews, Confirmation & Modification.
- **Learning Management System** (10 questions) - Course Dashboard, Video Lecture Player, Quiz & Assessment, Discussion Forum, Gradebook. Includes a worked example directly addressing a common real-world excuse: a "request captions with two weeks notice" policy is evaluated and rejected as not equivalent to 1.2.2 compliance, since it structurally disadvantages the requesting student every time versus classmates with immediate access.
- **Insurance Platform** (9 questions) - Quote Calculator, Policy Comparison, Claims Filing, Document Center.
- **Public Transit App** (7 questions) - Trip Planner, Real-Time Arrivals, Fare Payment, Service Alerts. Includes a live-region urgency judgment question: recognizing that announcing every 15-second countdown tick as assertive would be actively harmful, versus a polite region limited to meaningful threshold changes - reinforcing that "add a live region" is not itself always the complete, correct fix without also getting the urgency level right.

### The recurring difficulty-tier mistake: caught earlier this time, still not eliminated

The same "expert" difficulty-tier error occurred a **fourth** consecutive session - 1 instance this time, in the Public Transit family. What changed: it was caught by a pre-check grep run against the draft scratch files, before they were ever combined into the expansion file or touched by the full validation script, rather than being caught after integration as in the previous three sessions. The fix was applied to the source scratch file directly, and the full validation pass after integration came back clean on the first run, with zero schema errors of any kind - the first session where that has been true. This is worth stating precisely rather than claiming the underlying mistake is "fixed": the error still happened; what improved is how early in the process it was caught, which meant less rework. Whether this represents a durable process improvement or was simply a lower-volume occurrence this session (1 instance versus 11-16 in prior sessions) is not yet something four data points can distinguish with confidence.

### Updated totals

- **Total questions: 496** (234 original + 108 + 66 + 51 + 37 across four expansion sessions).
- **43 of 87 Success Criteria have deep coverage** (more than 3 questions), essentially unchanged from last session's 44 - this session prioritized breadth (new industries) over adding further depth to already-covered criteria, consistent with the "breadth first, then depth" direction. This is expected and correct given that framing, not a stall.
- **11 industry families now exist**: Banking, Healthcare (Hospital), Government Services (with A/B/C progressive tiers), University Registration, Shopping/Retail, Airline Booking, Social Media, Hotel Reservation, Learning Management System, Insurance, Public Transit.

### Verification performed before packaging

Identical discipline, re-run against the fully combined five-file dataset: all files pass syntax check; all 496 questions validated against the schema with zero errors on the first full pass; zero duplicate IDs; zero duplicate question text; zero Success Criteria with no coverage; the actual `getAvailableQuestions()` filtering logic simulated against the full array confirms every domain/mode combination returns questions and Sprint mode correctly pulls all 496.

### Coverage map: what remains, from the standing industry list

**Not yet represented by any family**: Retail is covered by the existing Shopping Platform family (same category, different name); News Website, Enterprise Dashboard (the first expansion's dashboard content was one scenario within a broader family, not its own dedicated family), HR Portal, Mobile App (as its own dedicated family, distinct from mobile-specific questions folded into other families), Streaming Service, Restaurant Ordering (a short scenario exists from the very first expansion session, not yet a full family), Financial Reporting, Document Management (distinct from the shorter Documents scenario in the first expansion), Collaboration Platform, Authentication (as its own dedicated family, distinct from the shorter Authentication scenario in the first expansion), Maps and Geospatial, Complex Forms (as its own dedicated family).

**Progressive A/B/C tiers exist for exactly one family** (Government Services). The four families added in the second expansion session (Banking, Hospital, University, Shopping) and the seven added since remain single-tier. Per the stated breadth-first strategy, this is being left as-is for now rather than developed further this session.


## Domain-4 Weighted Expansion, and a Repository-Wide Bug Found Across Prior Sessions (This Session)

Per the flagged Domain 4 (Robust) thinness (35 questions versus 160-170 in other domains), this session's new content was deliberately weighted toward 4.1.2 Name/Role/Value and 4.1.3 Status Messages, and a repository-wide consistency check introduced this session caught a real, pre-existing bug spanning three prior expansion files.

### Four new families, 34 questions, half of them Domain 4

- **Streaming Service** (11 questions) - Video Player, Content Browse, Watchlist, Subtitle Settings, Profile Switching. Deliberately concentrated on custom player-control accessible naming and state (play/pause, volume slider, Skip Intro announcement), plus a 3.3.4 question testing whether "delete user-controllable data" (a watchlist) falls under Error Prevention even though the criterion's short name suggests only legal/financial scope.
- **Enterprise Dashboard** (9 questions) - a dedicated family this time, distinct from the single scenario folded into the first expansion. Widget Configuration, Filters & Date Range, Real-Time KPI Tiles, Data Export, Alert Rules. Includes a live-region urgency question that rejects "assertive" for a routinely-refreshing metric and, further, questions whether automatic announcement is even the right approach at all for this kind of content versus on-demand availability.
- **Mobile Application** (7 questions) - a dedicated family, distinct from mobile-specific questions folded into other families. Tab Bar Navigation, Gesture Controls (including 2.5.4 Motion Actuation for a shake-to-undo feature, a criterion not previously used anywhere in this Lab), Push Notification Settings, Offline Sync Status, In-App Purchase.
- **Authentication & Account Management** (7 questions) - a dedicated family, distinct from the shorter Authentication scenario in the first expansion. Login, Multi-Factor Verification, Password Reset, Account Recovery, Session Management. Includes a 3.3.9 (AAA) question and a judgment question weighing whether a 5-minute MFA window with no low-friction resend option is a defensible security measure or stricter than the stated goal requires.

### A repository-wide bug found and fixed, spanning three previously delivered sessions

While fixing this session's own domain/principle field consistency (three mismatches caught by the now-standard pre-integration check), the same check was, for the first time, run against the **entire** accumulated question bank rather than only the newest file. It found **20 mismatches total**, only 3 of them in this session's new content - the other 17 were already present in `wcag-lab-expansion-2.js` (3), `wcag-lab-expansion-3.js` (6), and `wcag-lab-expansion-4.js` (11), meaning they shipped in the two previous delivered sessions without being caught.

This matters functionally, not just cosmetically: `domain` is the field the app's actual filtering logic uses to place a question under a WCAG Principle tab; `principle` is a separate metadata field that happened to always be authored correctly. Where the two disagreed, the question was displaying under the *wrong* Principle filter - a Robust-focused practice session, for example, would have silently excluded several genuinely Robust-principle questions that were mistakenly tagged `domain2` or `domain3`. This is very likely part of why Domain 4 measured thinner than it actually was: some of its content existed but was miscategorized, not missing.

All 20 were fixed by correcting only the `domain` field to match the already-correct `principle` field, in place, in the three affected files - no question text, choices, or explanations were touched. This is treated as a bug fix to existing content, not a prohibited "regeneration" of it, consistent with how the recurring `"expert"` difficulty-value bug was handled in prior sessions: the substantive quiz content is unchanged, and only a metadata field that controls correct app behavior was corrected.

### Domain distribution, before and after this session's fix

| Domain | Before this session | After new content | After bug fix |
|---|---|---|---|
| Domain 1 (Perceivable) | 160 | 162 | 167 |
| Domain 2 (Operable) | 170 | 176 | 170 |
| Domain 3 (Understandable) | 131 | 140 | 138 |
| Domain 4 (Robust) | 35 | 52 | **55** |

Domain 4 grew from 35 to 55 - partly from 17 newly-written Domain-4-focused questions this session, and partly from recovering questions that were already Robust-principle content but had been sitting mislabeled under other domains since earlier sessions. The gap with Domain 1/2 is narrower now but still real and still the largest domain imbalance in the bank.

### The recurring difficulty-tier mistake: sixth occurrence

The `"expert"` value appeared 5 more times in this session's draft files, caught by the same pre-integration grep check before combination, same as the last two sessions. Fixed the same way. This is now the fourth consecutive session it has occurred. The domain/principle mismatch bug above was caught specifically *because* the difficulty pre-check habit prompted a broader "check this new file for known mistake patterns before integrating" review, which is arguably the more useful outcome of that repeated failure than the difficulty fix itself.

### Updated totals

- **Total questions: 530** (234 original + 108 + 66 + 51 + 37 + 34 across five expansion sessions).
- **15 industry families now exist**: Banking, Healthcare (Hospital), Government Services (with A/B/C progressive tiers), University Registration, Shopping/Retail, Airline Booking, Social Media, Hotel Reservation, Learning Management System, Insurance, Public Transit, Streaming Service, Enterprise Dashboard, Mobile Application, Authentication & Account Management.

### Verification performed before packaging

All six JS files pass syntax check. All 530 questions validated against the schema, **now including domain/principle consistency as a standard check**, not just for new content but re-run against the entire accumulated bank - zero errors. Zero duplicate IDs across all 530. Zero duplicate question text. Zero Success Criteria with no coverage. The actual `getAvailableQuestions()` filtering logic simulated against the full array confirms every domain/mode combination returns questions and Sprint mode correctly pulls all 530.

### Still not the final destination

**Not yet represented by a dedicated family**: News Website, Restaurant Ordering (a short scenario exists from the first expansion, not yet a full family), Document Management (distinct from the shorter Documents scenario in the first expansion), Collaboration Platform, Maps and Geospatial Tools, Complex Forms, Financial Reporting, Human Resources Portal.

**Progressive A/B/C tiers exist for exactly one family** (Government Services). Fourteen other families remain single-tier.

**A process note for whoever continues this**: this session's discovery suggests any future session adding a new consistency check should run it against the *entire* accumulated bank on first use, not only new content - the domain/principle check would have caught 17 more bugs sessions earlier if it had been introduced then instead of now. There may be other latent, never-checked-for consistency issues in the existing bank that a differently-framed check would surface; this is worth treating as an open question rather than assuming the bank is otherwise clean simply because no one has found anything else yet.


## Validation Dashboard (This Session)

Per the request to move from README prose toward automatically generated, self-verifying statistics, this session adds `generate-validation-report.js`: a standalone, read-only Node script that loads the exact same data files the running app loads, in the same order, and produces a full report - total questions, breakdown by Principle, by every individual Success Criterion, by industry family (with a checklist against the full target list, not just what exists), by difficulty, by mode, by question type, and the complete set of validation checks this project has accumulated across five sessions (duplicate IDs, duplicate text, schema completeness, difficulty values, domain/principle consistency, Success Criterion coverage, and filtering simulation).

**This is intentionally not a runtime feature.** It does not touch `index.html` or `app.js`, adds no script tag, and has zero effect on the deployed application - confirmed by grep before packaging. It is a maintainer tool: run `node generate-validation-report.js` from this directory before and after any content session to get exact, computed numbers rather than hand-tallied ones.

**Usage:**
```
node generate-validation-report.js
```
This prints the report to the console and also writes it to `VALIDATION-REPORT.md` in this directory, which is included in this delivered archive as a snapshot as of this session.

**The script auto-discovers expansion files** by matching the `wcag-lab-expansion(-N).js` naming pattern already established, sorted numerically, so a future `wcag-lab-expansion-6.js` will be picked up automatically without editing this script - only the `FAMILY_MANIFEST` list (which industries are being tracked as targets) needs manual updating when a new industry is added to the roadmap, since that is a planning decision, not something derivable from the data.

**Running it for the first time immediately demonstrated its own value**: the Industry Families section revealed that "Enterprise Dashboard" and "Mobile Application" already had small precursor scenarios from the very first expansion session (4 and 5 questions respectively) that this session's own prose had been describing as building these as new dedicated families "distinct from" - technically true for the dedicated-family structure, but the READMEs across several sessions had been undercounting actual total coverage for these two topics by not accounting for the earlier scenario-level content. The script's family counts (13 for Enterprise Dashboard, 12 for Mobile Application) are more accurate than any single session's hand-written total, because they check the entire accumulated bank by substring match rather than relying on a session's memory of what it personally added.

**Confirmed output, this session, matches every hand-verified figure reported across the five prior sessions exactly**: 530 total questions, 167/170/138/55 by Principle, zero validation failures. This is not a coincidence - it is what re-running the same checks that were previously done by hand in one-off Node commands, now formalized into one reusable script, should produce.

### What the dashboard does not yet do

- It does not distinguish a "dedicated family" (5+ connected pages, 15-25 questions) from a "short scenario" (1 page, 4-6 questions) within its family count - both count toward the same total if they share a detection string. The prose distinction some READMEs draw between these two forms is not something this script currently enforces or checks.
- It has no historical tracking (session-over-session deltas); it always reports the current, total state of the bank, not what changed since the last run. Comparing two runs' output remains a manual diff for now.
- The `FAMILY_MANIFEST` list is maintained by hand and could drift out of sync with the actual roadmap if a family is renamed or a new one is added without updating it here.


## Dashboard-Driven Expansion: Targeting Weak Coverage Directly (This Session)

This is the first session where new content was planned using the validation dashboard's output as the actual starting point, rather than choosing an industry first and letting coverage fall out however it happened to land. `generate-validation-report.js` was extended with a **Coverage Tiers** section (Baseline: 1-4 questions, Developing: 5-9, Strong: 10-19, Deep: 20+), then run before any new content was written to get the real, current list of the 53 weakest (non-obsolete) Success Criteria, and four families were designed specifically to strengthen clusters of them.

### A real data-accuracy issue found and flagged, not fixed by deletion

Before planning, the Baseline tier's very first pass showed 4.1.1 Parsing as an active criterion with 3 questions. 4.1.1 was formally removed from WCAG as obsolete in WCAG 2.2 - this Lab's original `WCAG_DATA` (present before any of this project's expansion sessions) never reflected that removal. The dashboard now flags this explicitly wherever 4.1.1 appears, marked `[OBSOLETE - do not target]`, so no future session mistakes it for a genuine coverage gap and adds more content teaching an outdated requirement as if it were current. Per this project's standing rule against modifying or removing previously added content, the existing 3 questions were left in place rather than deleted - this is a flag for future awareness, not a content edit.

### Four families, each built around specific Baseline-tier criteria

- **Financial Reporting Platform** (11 questions) - targets 1.2.1 (audio-only earnings call transcripts), 1.2.5 (audio description for a video presentation), 3.1.3/3.1.4 (unexplained financial jargon and abbreviations, with a question distinguishing the two related-but-different criteria), 2.5.2 (touch-triggered chart navigation with no cancel opportunity), 2.4.5/2.4.8 (a 200-page report with no navigation aids, then a stricter AAA location-indicator finding on top of it).
- **Document Management Platform** (9 questions) - targets 1.4.4 (a document viewer that doesn't genuinely resize text), 1.4.5/1.4.9 (an image-of-text file-type badge, tested at both the AA and stricter AAA level), 1.3.6 (unlabeled toolbar icons), 2.4.9 (link text that passes the more lenient 2.4.4 standard via context but fails the stricter link-text-alone standard - a deliberately close call testing that distinction), 2.4.10 (an unstructured 40-entry changelog), 2.5.6 (a device wrongly assumed to be touch-only despite an active keyboard).
- **Collaboration Platform** (9 questions) - targets 2.2.2 (undisableable cursor-following auto-scroll), 2.3.1/2.3.2 (a flashing typing indicator, tested at both levels, with a severity question specifically addressing that 2.3.1 findings carry genuine physical safety risk, not only usability impact), 1.4.13 (a hover preview card failing all three of dismissible/hoverable/persistent), 3.2.1 (a comment box that auto-submits on focus loss), 2.5.4 (a shake-to-react gesture with no alternative).
- **Human Resources Portal** (7 questions) - targets 2.4.2 (identical tab titles across every page), 2.4.3 (a dynamically-inserted field with illogical tab order), 2.4.7 (a submit button with no focus indicator), 3.2.5 (an AAA-level question testing that satisfying the more lenient 3.2.2 doesn't automatically satisfy the stricter 3.2.5), 3.3.5/3.3.6 (missing contextual help; extending 3.3.4's safeguard principle to low-stakes checklist items under full AAA conformance), 2.5.5 (target size, tested against the AA/AAA distinction on the same checkboxes).

### Both recurring mistakes, caught again before integration - and what that consistency is starting to show

The `"expert"` difficulty value appeared twice more in this session's drafts, caught by the pre-integration grep, same as the last several sessions. The domain/principle mismatch (discovered and retroactively fixed across three prior files last session) also recurred - 3 more instances in this session's own new content, caught by the same check before combination. Both were fixed in the scratch files before they ever reached an expansion file. Six consecutive sessions for the difficulty mistake, two for the domain/principle one (since that check has only existed for two sessions) - these are not improving in the sense of stopping, but the catch point keeps moving earlier and the fix keeps getting faster, which is the more honest way to describe what's actually changed.

### Verified impact: 9 Success Criteria moved out of the Baseline tier this session

Directly comparing the dashboard's Coverage Tiers output before and after this session's integration: the Baseline tier shrank from 53 genuine (non-obsolete) criteria to 43. Nine specifically crossed into the Developing tier as a direct result of this session's targeted content: **1.2.1, 2.2.2, 2.3.1, 2.4.3, 2.4.5, 2.4.9, 2.5.2, 2.5.4, 3.1.3**. A further large number of criteria remained in Baseline but moved from 3 questions to 4, incremental progress toward the same threshold. This is a directly falsifiable claim, not a general impression - anyone can run `node generate-validation-report.js` before and after this session's files are present and see the same tier counts.

### Updated totals

- **Total questions: 566** (234 original + 108 + 66 + 51 + 37 + 34 + 36 across six expansion sessions).
- **19 of 23 manifest-tracked industry families now exist.** Still missing: News Website, Restaurant Ordering as a dedicated family (a short scenario exists from the first expansion), Maps & Geospatial, Complex Forms as a dedicated family.
- **Coverage tiers: 43 Baseline (down from 53), 31 Developing (up from 21), 8 Strong, 4 Deep**, plus the one flagged obsolete criterion.

### Verification performed before packaging

All seven JS files pass syntax check. `generate-validation-report.js` run against the complete, integrated seven-file dataset reports zero failures across all eight checks on the first run after this session's fixes were applied. `VALIDATION-REPORT.md` in this archive is the actual output of that run, not a hand-written summary.


## Professional Workflows, and a Sprint Mode Accessibility Refinement (This Session)

This session added a new *kind* of content, not another industry, and separately made a real change to the running application itself (with explicit authorization to do so, unlike prior content-only sessions that were instructed not to touch `app.js`).

### Expansion 7: 26 questions, four professional workflow families

`wcag-lab-expansion-7.js` adds **26 questions**, bringing the total from 566 to **592**. Three are documented here per the specific request; a fourth (Accessibility Audit Engagement, 9 questions) was also completed as part of the same body of work and is included in the delivered archive and dashboard counts, since removing completed, validated content to match a shorter recap would itself violate the standing rule against discarding prior work.

- **Design Review** (7 questions) - catching accessibility issues in mockups and design systems before any code is written: a contrast failure measured directly in a Figma file, a missing text-alternative plan for an infographic, an undersized touch target caught at the specification stage, a design system's button component with no focus-state defined at all (so every team using it either omits one or invents inconsistent styling), a color-only status palette baked into system documentation, a reading-level concern raised during content planning rather than after launch, and a full-screen scroll-triggered animation with no reduce-motion consideration.
- **Procurement** (5 questions) - evaluating vendor accessibility claims rather than auditing an organization's own product: recognizing that a VPAT claiming universal, unqualified "Supports" is less credible than one with specific "Partially Supports" detail; comparing two vendors' VPAT entries for the same criterion; scoping a one-week independent verification effort; converting a vague verbal remediation promise into a documented, time-bound commitment for a Critical finding; and explicitly surfacing an accessibility-versus-cost tradeoff for decision-makers rather than silently picking the cheaper option.
- **QA Testing** (5 questions) - the day-to-day defect lifecycle distinct from a full external audit: reliably reproducing a vaguely-reported keyboard issue, writing a bug report with the detail a developer can actually act on, verifying that a "fixed" ticket addresses the complete original defect (not just its more visible half), adding an automated regression test at the shared-component level so a fixed keyboard trap cannot silently reappear across all 12 places that component is used, and choosing a practical, resource-constrained screen-reader test-plan baseline (NVDA and VoiceOver).

**Also completed:** Accessibility Audit Engagement (9 questions) - the full consulting lifecycle: defensible scoping under time pressure, recognizing what automated tools cannot verify, applying consistent severity criteria across two differently-severe findings, writing a complete finding, writing an accurate VPAT remark for partial conformance, explaining a prioritization decision to a client whose intuition (traffic) conflicts with actual severity, verifying a fix addresses a finding's *complete* original scope, and synthesizing 14 individually-filed findings into one systemic recommendation.

### Industry families versus professional workflows - now tracked separately

The validation dashboard previously had one manifest (`FAMILY_MANIFEST`) for industry verticals. This session added a second, independent one (`WORKFLOW_MANIFEST`) and a corresponding "Professional Workflows" report section, because these are genuinely different things and conflating them would make the coverage picture misleading:

- An **industry family** (Banking, Hospital, Streaming, etc.) is a specific product's pages, and the skill being tested is finding and fixing violations within that product.
- A **professional workflow** (Audit, Design Review, Procurement, QA) cuts across every industry and tests a *stage of professional practice itself* - scoping, severity judgment, writing a finding, evaluating a vendor's claim, verifying a fix - illustrated with a representative finding rather than anchored to one company's product.

Both are tracked via the same detection mechanism (matching a distinctive string in each question's `lesson` field) but against two separate manifests, confirmed independent by directly re-running the dashboard and inspecting each section in isolation.

### Sprint Mode: refined for experienced, repeated screen reader use

This session made a real, explicit change to `app.js` and `index.html` themselves - not just content - per specific authorization to do so (prior sessions were told not to touch the running application; this one was asked to). Every change is scoped narrowly to Sprint mode's announcement behavior:

1. **Per-question announcement shortened.** Previously, every question fired two separate, overlapping announcements: `els.advanceStatus` said "Sprint question X. Choose an answer by activating one of the answer buttons, or press 1 through 4 on a keyboard," *and* a second live region (`els.sprintAnnouncer`) separately announced the full question and all four choices. Now there is exactly one announcement channel per question. `els.advanceStatus` is left empty in Sprint mode; `els.sprintAnnouncer` alone carries the content, beginning with "Question X." rather than "Sprint question X. Choose an answer...".
2. **Instructions announced exactly once per session.** "Sprint started. Press 1 through 4 to choose an answer, or use Tab and Enter." now prepends only to the very first question's announcement (`state.currentIndex === 0`). Every subsequent question in the same Sprint session omits it entirely - verified directly by simulating `buildSprintPrompt()` across a 3-question sequence and confirming the instruction text appears only in the first output.
3. **Redundant setup-screen help text removed.** The "Sprint Time" dropdown's `aria-describedby` note, "Used for Sprint only. Unavailable for other modes.", was removed along with its paragraph element. The control's own `disabled` state (already correctly toggled based on selected mode) already conveys unavailability; the separate text was restating what the disabled state already communicates.
4. **The Sprint announcer region itself was not actually polite.** While making these changes, `#sprint-announcer` was found to be `role="alert" aria-live="assertive"`, not `role="status" aria-live="polite"` like every other status region in this app (`#feedback`, `#advance-status`). Assertive announcements interrupt whatever a screen reader is currently saying; for a mode explicitly meant to feel fast and non-disruptive for repeated use, this is the opposite of what was needed. Changed to `role="status" aria-live="polite"`, matching the rest of the app and the explicit instruction to verify every live region is polite.
5. **Completion announcement combined into one.** `completeSprint()` previously set `els.feedback` to the results text ("Sprint complete. Questions answered: X...") *and* separately set `els.advanceStatus` to next-step guidance ("Review Missed Questions is available.") - two live regions firing on the same event. Now both are combined into a single `els.feedback` update; `els.advanceStatus` is cleared rather than also populated.
6. **Focus after completion moves to Review Missed Questions.** Previously, focus always moved to `els.feedback` after Sprint completion. Now, if `els.reviewMissedButton` is visible (there were missed questions), focus moves there directly. If there were no missed questions, the button doesn't exist to focus, and the prior fallback (`els.feedback`) is preserved.

**What was deliberately left unchanged.** Moving focus to `els.questionText` for every question after the first (unchanged from before) means a screen reader may announce that element's content via the focus change *in addition to* the `sprintAnnouncer` live-region announcement of the same text - a pre-existing overlap this session did not resolve. Removing or redirecting that focus target risks breaking Tab-order continuity into the answer-choice buttons, a bigger structural change than what was explicitly requested here. This is named directly rather than silently left for someone to discover as a "new" bug later - it existed before this session's changes and still exists after them.

**Verification performed:** all changes pass `node --check app.js`; the announcement-building logic (`buildSprintPrompt`) was traced in isolation across a simulated 3-question sequence and confirmed to produce instructions only on question 1; every `aria-live` region in `index.html` was re-checked and confirmed polite. This was not tested against a real JAWS, NVDA, or VoiceOver instance, since no screen reader is available in this environment - that remains manual verification for whoever next opens this in a real browser with real assistive technology, and should not be read as already confirmed by this session.

### Full validation checklist, run explicitly and individually

Every item below was checked as its own discrete step against the complete, integrated repository, not inferred from the dashboard's summary alone:

- [x] JavaScript syntax validation on all 10 `.js` files
- [x] `generate-validation-report.js` run against the complete repository - exit code 0, all checks pass
- [x] All 7 expansion files load in correct numerical order in `index.html`
- [x] All 592 question IDs unique
- [x] All 592 question texts unique
- [x] All 592 questions pass schema validation
- [x] All difficulty values are exactly `easy`, `medium`, or `hard` - zero exceptions
- [x] Success Criterion, Principle, domain, and lesson metadata consistent across all 592 questions
- [x] Industry-family detection confirmed working (19 of 23 manifest families present)
- [x] Workflow-family detection confirmed working independently of industry detection (4 of 5 manifest workflows present, via a separate manifest and report section)
- [x] Compact Coverage Progress summary (42 / 31 / 9 / 5) independently recomputed and confirmed to match the detailed tier lists exactly, summing to all 87 Success Criteria with no gaps or overlaps
- [x] Learner-facing filtering logic (`getAvailableQuestions()`) simulated against the full 592-question array - every domain/mode combination returns a non-zero count, Sprint mode correctly pulls all 592

No errors were found requiring correction in this pass; all items passed on first check, reflecting fixes already applied to draft content before this session's files were combined into `wcag-lab-expansion-7.js`.

### Updated totals

- **Total questions: 592** (234 original + 108 + 66 + 51 + 37 + 34 + 36 + 26 across seven expansion sessions).
- **Coverage Progress: Baseline 42, Developing 31, Strong 9, Deep 5** (plus 4.1.1, flagged obsolete, tracked separately).
- **19 of 23 manifest-tracked industry families; 4 of 5 manifest-tracked professional workflows.**

### Remaining high-value gaps

**Industry families still missing:** News Website, Restaurant Ordering as a dedicated family (a short scenario exists from the first expansion), Maps & Geospatial, Complex Forms as a dedicated family.

**Workflow families still missing:** Development / Code Review - reviewing a pull request for accessibility issues, choosing appropriate linting/testing tooling, and preventing regressions from a code-authoring perspective (distinct from QA Testing's defect-lifecycle perspective, already built).

**Coverage tiers:** 42 Success Criteria remain in the Baseline tier (1-4 questions). A prioritized list is available directly from `generate-validation-report.js`'s Coverage Tiers section on demand, rather than reproduced here where it would immediately go stale as soon as the next session runs.

### Recommended focus for the next session

Two defensible directions, not mutually exclusive:

1. **Close the workflow set** by building Development / Code Review, completing all five originally-named workflows before adding further ones.
2. **Continue dashboard-driven Baseline reduction**, re-running `generate-validation-report.js` first to get the current (not this session's now-slightly-stale) Baseline list, and building 2-3 more families or workflow questions specifically targeting whatever remains weakest at that time.

Either is a reasonable next step; what matters is starting from a fresh dashboard run rather than this README's now-fixed snapshot, since coverage numbers are the one thing in this document guaranteed to be out of date the moment new content is added.

## Accessibility Bug Fix: Session-Completion Announcement Contamination (This Session)

This session was a bug-fix session, not a content-expansion session, per explicit instruction to prioritize it over further question-bank work (no Expansion 8 was added). No question data, industry family, or workflow family was touched. Only `app.js` changed.

### The report

Real JAWS testing of a completed 20-question Reinforce session found two related problems:

1. **Duplicate announcement at completion.** JAWS announced "Session complete. You answered 16 correct and 4 incorrect in this session." followed by "Review Missed Questions is available." followed by "Session complete. You answered 16 correct and 4 incorrect in this session." again.
2. **Repeated contamination while navigating afterward.** With the Virtual Cursor turned back on, moving through the completed Lab Home page produced the completion text prefixed onto unrelated controls - "Session complete... Button expanded," "Session complete... radio button not checked, 1 of 4" - while tabbing through the Choose A Learning Mode radio group and other controls.

The instruction was explicit: investigate the actual ARIA/accessible-name implementation before changing anything, not merely "reduce verbosity."

### What the investigation found

**Confirmed, root-caused, and fixed:** `completeSprint()` had already been fixed for exactly this duplicate-announcement pattern in a prior session (see "Sprint Mode Accessibility Refinement" above - item 5, "Completion announcement combined into one"). That fix consolidated Sprint's completion message onto a single live region and stopped focusing the live region directly. **That fix was never applied to `completeSession()` - the regular, non-Sprint completion path, which is what the reported 20-question session actually used - or to `showStoredResults()`**, the function that rebuilds the completed-results screen when returning from Review Missed Questions (via Escape) or restoring a completed session from saved state. Both had the identical unfixed pattern: two separate `aria-live="polite"` regions (`#feedback` and `#advance-status`) populated with overlapping text at the same moment, and focus moved directly onto `#feedback` immediately afterward - which causes a screen reader to announce that live region's content a second time via the focus event, on top of the live-region announcement itself. That fully accounts for the reported triple repeat: results (live-region announcement) - review availability (second live-region announcement) - results again (focus-triggered re-read of `#feedback`, whose content was the results text).

**Specifically investigated and ruled out**, per the explicit checklist in the report:
- `aria-describedby` / `aria-labelledby`: searched every occurrence in `index.html` and every `setAttribute("aria-describedby"/"aria-labelledby", ...)` call in `app.js`. None reference `#feedback` or `#advance-status` from the mode radios, the Choose A Learning Mode fieldset, or any Setup panel button.
- Duplicate or reused IDs: none found anywhere in the document, including inside dynamically-generated `innerHTML` content (choices, review content, statistics).
- Any JS path that copies `state.lastResultsText` / `state.lastResultsStatus` into another element's `aria-label`, `aria-describedby`, or text content: none found. The only writers of these two state fields are `completeSession()`, `completeSprint()`, and `showStoredResults()`, and the only elements they write into are `#feedback` and `#advance-status`.
- A change handler on the mode radios or domain checkboxes that re-touches `#feedback`/`#advance-status`: checked directly: it does not.

**Not confirmed with certainty:** a specific mechanism by which the completion text would become part of an unrelated control's accessible *name* (as opposed to being announced as a separate, adjacent event). No such mechanism exists in the DOM or ARIA wiring. The leading, evidence-consistent explanation is that the triple-fire described above was still queued or mid-flush in JAWS at the moment the Virtual Cursor was turned back on and navigation began, making the tail of that single event sound like ongoing contamination rather than one already-finished occurrence. This is a plausible account, not a claim of certainty - see Remaining Work below.

### The fix

Applied the same pattern already proven correct for Sprint mode to `completeSession()` and `showStoredResults()`, and hardened `completeSprint()`'s remaining edge case:

1. **One combined message, one live region.** All three functions now build a single string - results plus review-availability guidance - and set it once on `#feedback`. `#advance-status` is explicitly cleared (`""`) rather than populated with overlapping text.
2. **Never focus a live region immediately after populating it.** All three functions now move focus to `#review-missed-button` when it's available (a real, actionable next step), or to `#question-heading` (plain text, not live) when it isn't. None of the three ever calls `focusElement(els.feedback)` anymore. `completeSprint()`'s prior fallback (`els.feedback`, for the rare case with no missed questions) was changed to `els.questionHeading` for the same reason, closing the one remaining case where Sprint mode still had this pattern.

### Verification performed

Automated only - JAWS was not run this session, consistent with this environment's standing limitation and the standing rule not to claim manual screen-reader testing that didn't happen. Three Playwright test scripts drive the actual running application through a real browser and inspect the real DOM and accessibility tree:

- **A MutationObserver instrumented on `#feedback` and `#advance-status` before starting a real 5-question session**, counting every actual content change to each element. Confirmed: exactly one mutation of `#feedback` containing "Session complete" per completion (previously this pattern would have produced two separate live-region writes plus a focus-triggered re-read); `#advance-status` contains no completion text at all afterward.
- **Focus target after completion** confirmed to never be `#feedback` or `#advance-status` themselves - either `#review-missed-button` (when missed questions exist) or `#question-heading` (when none do).
- **Every interactive control's accessible name**, read directly from the browser's accessibility tree (not assumed from markup), checked for contamination: all mode radios ("Reinforce," "Practice," "Challenge," "Sprint") and all Setup panel buttons ("Start Lab Session," "Resume Current Session," "Open Statistics," "Review Missed Questions," "Reset Statistics," "Return Home") retain their normal names with no trace of the completion text.
- **No `aria-describedby`/`aria-labelledby` anywhere in the document references `#feedback` or `#advance-status`** - confirmed programmatically, not just by manual code search.
- **No duplicate IDs anywhere in the document.**
- **Interacting with unrelated controls after completion** - clicking a different mode radio, a different WCAG principle checkbox, opening and returning from Statistics - produces **zero** re-announcements of the stale completion text, tested with the same MutationObserver instrumentation reset immediately before those interactions.
- **The same checks repeated for Sprint completion** (`completeSprint()`, triggered via the Escape shortcut mid-Sprint) and for the Escape-from-Review-back-to-results path (`showStoredResults()`) - both confirmed to exhibit the identical single-announcement, non-live-focus behavior.
- `node --check app.js` passes; zero JavaScript console or page errors across every test run.

### What this does not claim

This fix has not been confirmed with JAWS, NVDA, or VoiceOver. The automated evidence is strong - a live region provably changing exactly once, focus provably landing on a non-live element, every control's computed accessible name provably clean - but only real screen reader testing can confirm the actual spoken experience, especially the second reported symptom (contamination while navigating), whose precise mechanism was not conclusively identified, only reasoned about from the evidence available. **This is the top priority for the next session before any further content work resumes.**

### Remaining work

1. **Manual JAWS retest of the exact original scenario**: complete a real session with some questions missed, confirm the result is announced once, turn the Virtual Cursor on, and navigate through the entire completed Lab Home interface - mode radios, WCAG principle checkboxes, all Setup panel buttons - confirming no trace of the completion text anywhere. Repeat for Sprint completion.
2. **If the contamination still reproduces on a real screen reader** even with this fix in place, that would mean the "still-flushing at navigation time" explanation was wrong, and the actual mechanism is something this session's DOM/ARIA-level investigation didn't surface - worth revisiting with the specific screen reader/browser combination and JAWS version in use, since this can be a version-specific behavior.
3. **Content expansion (Expansion 8 and beyond)** remains paused pending that manual confirmation, per the explicit instruction that this bug fix takes priority.

## Question Style restoration

The Lab again supports deliberate WCAG learning in both directions before scenario practice. The Question Style control provides:

- Learning Mode Default - preserves the existing Reinforce, Practice, Challenge, and Sprint question selection behavior.
- Success Criterion from Definition - presents a WCAG requirement and asks the learner to identify the matching Success Criterion.
- Definition from Success Criterion - presents the Success Criterion number and name and asks the learner to identify its definition. These reverse questions are generated from the canonical WCAG data already included in the Lab.
- Scenarios - uses application and professional workflow questions while excluding basic recall and recognition items.
- Mixed - draws from the complete question bank.

Question Style is independent of the selected WCAG Principles and difficulty filter. Sprint timing remains available with any Question Style.

## Restored learner controls

The Lab setup now includes independent **Question Style** and **WCAG Level** selectors. The WCAG Level selector supports All levels, Level A, Level AA, and Level AAA. Level filtering is exact: selecting Level AA presents questions whose Success Criterion is Level AA; selecting Level AAA presents Level AAA criteria. It works alongside learning mode, question style, WCAG principle, and difficulty rather than replacing those controls.
