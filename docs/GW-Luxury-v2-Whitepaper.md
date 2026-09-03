# GW Luxury

## Version 2 Operating Whitepaper

**A product of ORANGERED Ltd**  
September 2026 · Internal · v2.0

---

## 1. Abstract

GW Luxury is a Lagos chauffeur practice. The guest does not collect a car. A chauffeur arrives at the pickup address, fuel included, in one of three motor cars: a 2022 Mercedes-Benz G-Class, a Cadillac Escalade, or a 2020 Toyota Land Cruiser Prado.

Version 1 is a public maison: a homepage, a fleet, and a booking request. It is fit for showing the offer. It is not fit for running the offer. Requests are written to a JSON file that does not survive a Vercel deployment, and nobody is notified when a request lands.

Version 2 does not enlarge the guest surface. It makes the existing request durable, visible, and answerable. The operator product is an inbox, not a dashboard. Charts, calendars, deposits, and staff accounts wait until volume justifies them.

This paper states what v1 is, what is broken, what v2 will be, what it will refuse to be, and how we will know it worked.

---

## 2. Purpose of this paper

This is an operating paper, not a pitch deck.

It exists so ORANGERED Ltd can build the next slice of GW Luxury without confusing a marketing site for a business system. It is written for the people who will ship it, and for anyone who has to decide whether a proposed feature belongs in v2 or later.

Three questions govern every section:

1. Does the guest still meet a restrained, chauffeur-led house?
2. Does a request survive, get seen, and get answered the same day?
3. Are we adding an operator tool, or an operator hobby?

If a feature fails (1) or (3), it is not v2.

---

## 3. The v1 surface

v1 is live as a Next.js 14 App Router site. Three public routes, one private write.

| Route | Role |
| --- | --- |
| `/` | Maison. Lagos, stacked GW / Luxury, G-Wagon still, arrangement, The fleet. |
| `/collection` | Three cars, twelve-hour rates, hover 3/4 to front, Book this car. |
| `/book` | Request form. Vehicle, date needed, duration, area, pickup, name, phone, email, notes. |
| `POST /api/book` | Validates the request and appends it to `bookings.json`. |

**Published twelve-hour rates** (chauffeur and fuel included, dispatched to the guest):

| Motor car | Rate |
| --- | --- |
| Mercedes-Benz G-Class 2022 | NGN 1,000,000 |
| Cadillac Escalade | NGN 650,000 |
| Toyota Land Cruiser Prado 2020 | NGN 150,000 · Island & Airport |

Duration is twelve hours, twenty-four hours, or **Enterprise** (2–90 days). Only twelve hours is priced on the page. Twenty-four hours and enterprise are confirmed after the request.

Areas of use: Lagos Island, Airport, Lekki, Mainland, Other. Prado’s published rate is Island and Airport; other areas are confirmed after the request.

The guest contract is already clear: *we come to you*. v2 does not reopen that.

---

## 4. Diagnosis

v1 fails as an operation in four specific ways. None of them are design problems.

**Requests vanish.** On Vercel the store is `/tmp/bookings.json`. That filesystem is not durable. A successful form post can still be a lost job.

**Nobody is told.** `bookings@gwluxury.com` exists as a constant. Nothing sends mail, WhatsApp, or SMS when a request is saved. The house is deaf.

**There is no inbox.** To read a request someone must open a JSON file on a machine that may not have it. There is no list, no status, no phone link, no “we confirmed this.”

**Quote and calendar are still oral.** Twenty-four-hour and enterprise rates are promised as a callback. Without a durable record, the callback has nothing to stand on. Date-needed is now on the form; it is not yet on a board the chauffeur can trust.

These are not arguments for a dashboard. They are arguments for memory, a ping, and a list.

---

## 5. The offer, restated

GW Luxury is not a self-drive rental and not a ride-hailing marketplace.

- The unit of sale is a **chauffeured motor car**, not a seat and not a key.
- The car **goes to the guest**. Pickup address is required.
- **Fuel is included.** The guest does not budget petrol.
- **Twelve-hour rates are public.** Longer hire is a conversation, not a calculator.
- The house is small: **three cars**. Scarcity is the product, not a defect.

v2 protects that offer. It does not add a fourth car, a membership, or a consumer app. It makes the existing offer operable.

---

## 6. Who we serve

Two people. Only two.

**The guest** is in Lagos — Island, Lekki, airport, sometimes mainland — and wants a G-Wagon, Escalade, or Prado with a driver, on a known date, without haggling through a form that looks like a logistics portal. They may be booking for a day, a night, or an enterprise stretch (board week, family visit, production). They give a phone number because that is how Lagos confirms.

**The operator** is the house: whoever reads the request, prices the 24-hour or enterprise job, assigns a chauffeur, and calls the guest. At v2 scale this is one or two people, not a control room.

v2 is built for those two. It is not built for a hypothetical fleet manager, a finance team, or a public API consumer.

---

## 7. The v2 thesis

> Make every request durable, visible, and answerable the same day. Do not build a dashboard until the inbox is too small.

**Durable** means the record lives outside the web server’s temporary disk. Postgres, SQLite on a volume, or a hosted document store. The implementation is interchangeable; the property is not.

**Visible** means a private `/admin` list, password-protected, showing the incoming requests with vehicle, date, duration, area, pickup, phone, email, notes, and status. Phone and email are links. Status is pending, confirmed, or done.

**Answerable** means a ping at the moment of request — email to the house, and later WhatsApp if the house lives there — containing the same facts as the inbox row.

That is the whole of v2’s new surface. The public maison stays as it is, with only the copy and fields already on the book form.

---

## 8. Guest product in v2

The guest should not feel v2, except that someone answers.

Keep:

- The editorial maison: Italiana, champagne, charcoal, G-Wagon still, arrangement.
- Fleet as three cars, not a catalogue.
- Book as a request, not a checkout. No card capture in v2.
- Date needed, duration (12 / 24 / Enterprise), days when enterprise, area, pickup, identity, optional notes.
- Published twelve-hour rate in the aside; quoted language for 24-hour and enterprise.

Do not add in v2:

- Guest accounts or “my bookings.”
- Live availability (“this G-Wagon is free on Thursday”).
- Instant price for 24-hour or enterprise.
- Payment, deposit, or invoice PDF.
- Chat widget, cookie banner theatre, or a blog.

A confirmation screen with a reference (`GW-…`) already exists. v2 may email that reference to the guest. That is courtesy, not a portal.

---

## 9. Operator product: an inbox

The operator tool is a list. It is allowed to be ugly relative to the maison. It must be fast, private, and complete.

### 9.1 What a row contains

Every request already captured by the form, plus house fields:

| Field | Source |
| --- | --- |
| Reference | Assigned at write (`GW-` + time token) |
| Vehicle | Form |
| Date needed | Form |
| Duration / days | Form |
| Area, pickup | Form |
| Name, phone, email | Form |
| Notes | Form |
| Status | House: `pending` → `confirmed` → `done` (or `declined`) |
| House note | Operator only |
| Created at | Server |

### 9.2 What the operator can do

- Open `/admin` behind a shared password (v2.0) or a single operator login (v2.1 if the password leaks into a screenshot).
- Filter by status and by date needed.
- Tap phone (tel:) and email (mailto:).
- Set status. Optionally leave a one-line house note (“quoted 1.8m / 24h, waiting on yes”).
- That is all.

### 9.3 What the operator cannot do in v2

- Drag cars onto a calendar.
- See utilisation charts.
- Assign named chauffeurs from a staff table.
- Edit published rates in the UI (rates stay in code until they change often enough to deserve a table).
- Message the guest from inside the app.

If those are needed, the inbox has already succeeded, and we are in v3.

---

## 10. Persistence and notification

### 10.1 Store

Replace `bookings.json` on local disk / `/tmp` with a store that outlives the instance.

**Recommendation:** a single Postgres database (Vercel Postgres, Neon, or equivalent) with one `bookings` table. Three cars and a few dozen requests a week do not need a queue, a warehouse, or object storage.

SQLite on a persistent volume is acceptable if the host provides one. It is not acceptable on a serverless filesystem.

The write path stays `POST /api/book`. The read path is `/admin` and, if useful, `GET /api/admin/bookings` behind the same auth.

### 10.2 Ping

On successful write:

1. Persist the row.
2. Send one email to the house address (`bookings@gwluxury.com` or a working replacement) with the row in the body.
3. Return the reference to the guest as today.

Failure policy: **the persist is the source of truth.** If mail fails, the request is still in the inbox; the operator must not lose a job because Resend timed out. Log the mail error. Do not roll back the booking.

Guest copy of the mail is optional in v2.0 and recommended in v2.1.

WhatsApp (or a Twilio SMS) is a v2.1 add if the house actually reads WhatsApp faster than mail. Do not build both on day one.

### 10.3 Auth

v2.0: HTTP basic or a single `ADMIN_PASSWORD` checked on `/admin` and its API. Rate-limit guesses.

v2.1: one operator user, hashed password, session cookie. Still not a staff directory.

The maison stays public. Admin is not linked from the footer.

---

## 11. Enterprise and time

Enterprise is already on the form: a duration of “enterprise,” then 2–90 days, plus a date needed. The rate is not published because a week of a G-Wagon is not twelve hours times seven. It is a conversation about chauffeur rest, fuel, overnight, and whether the car stays with the guest.

v2 does not invent a daily matrix. It does three things:

1. Keep enterprise as a first-class duration so the request is not stuffed into Additional info.
2. Show date needed and day count in the inbox, sorted by date needed, so the house can see collisions by eye.
3. Leave pricing in the callback. A house note on the row is enough to record the quote.

Collision detection (“G-Wagon already pending on 12 September”) is a small, honest v2.1 if two requests overlap. It is a banner on the inbox row, not a scheduling engine.

---

## 12. System design

```
Guest                  Maison (Next.js)
  |                      /  /collection  /book
  | POST /api/book
  v
Validate ──► Persist (Postgres) ──► Inbox /admin
                 │
                 └──► Mail (house)   [optional: guest]
```

Unchanged:

- Next.js 14 App Router, React 18, no extra UI kit on the public site.
- Fleet and twelve-hour rates as code in `app/lib/fleet.js` until they churn.
- Dark editorial CSS. Admin may be a plain, dense table in the same type family.

Added:

- `bookings` table and a thin data module (`app/lib/bookings.js`) used by the public POST and the admin GET/PATCH.
- Auth gate on `/admin`.
- Mail helper, invoked after persist, never instead of persist.

Hosting remains Vercel for the site. The database is the only new piece of infrastructure. That is deliberate. v2 is not a platform migration.

---

## 13. Explicit non-goals

The following are refused in v2 even if they are requested as “while we’re here”:

| Refused | Why |
| --- | --- |
| Full admin dashboard | Volume does not support it. An inbox does. |
| Payments / Paystack / Stripe | The house still confirms by phone. Card capture before confirmation creates refunds and arguments. |
| Guest accounts | One-off hire. Email + reference is enough. |
| Live fleet availability | Three cars, oral assignment. A false “available” is worse than a callback. |
| Chauffeur app | The chauffeur has a phone and a dispatcher. |
| Multi-tenant / white-label | This is one house. |
| CMS for copy and rates | Copy is the product. It belongs in the repo. |
| Analytics suite | A request count in the inbox header is enough. |
| AI quoting | Enterprise quotes are judgement. |

v3 is allowed to reopen payments, availability, and a calendar. It is not allowed to skip v2 to get there.

---

## 14. Delivery

Three slices. Each is shippable alone. None requires the next.

### Slice A — Memory

Persist bookings to Postgres. Keep the JSON writer as a local fallback in development if needed. Admin is not required yet; a `psql` select is an acceptable first reader. This slice exists so a production request cannot evaporate.

### Slice B — Ping

On persist, email the house. Include reference, vehicle, date, duration, pickup, phone, email, notes. If mail is not configured, log and continue.

### Slice C — Inbox

`/admin`: password, list, status, house note, tel/mailto. Filter pending / confirmed / done. Default sort: date needed, then created at.

Stop after C. Use the house for a month. If the list is painful, v3 earns a calendar.

---

## 15. Risks

**The house does not open the inbox.** Then the ping has to be the product. Put the phone number in the subject line. Do not compensate by building a dashboard nobody will open either.

**The shared password leaks.** Rotate it. If it leaks twice, do v2.1 login.

**Guests expect an instant yes.** The confirmation screen already says the house will confirm. Do not put a green “booked” state on a request that has not been accepted. Status `pending` is honest.

**Two G-Wagons on one Saturday.** Three cars, no automated lock. Slice C plus eyes. A collision banner in v2.1 if it happens more than once.

**Scope creeps into payments.** Payments couple refunds, failed charges, and “I already paid.” They wait until the callback is routine.

---

## 16. How we will know it worked

v2 is successful when, for four consecutive weeks:

1. Every production request is still in the store the next morning.
2. The house can name, without opening JSON, whether a given day’s G-Wagon is spoken for.
3. Time from submit to first human contact is under two hours during the working day.
4. No guest is told “we never got that” when the form showed success.

It is not successful because `/admin` exists. It is successful because a request became a car at a door.

---

## 17. Decision record

| Decision | Choice | Reason |
| --- | --- | --- |
| Operator surface | Inbox, not dashboard | Volume is a list, not a command centre |
| Persistence | Postgres (or equivalent durable store) | `/tmp` and repo JSON are not production |
| Notification | House email on write; WhatsApp later | Persist first; ping second |
| Payments | Out of v2 | Confirmation is still a phone call |
| Availability engine | Out of v2 | Three cars; collision by eye |
| Guest accounts | Out of v2 | Hire is episodic |
| Rate configuration | Remain in code | Three numbers; they change rarely |
| Auth | Shared admin password in v2.0 | One operator; login if it leaks |
| Public design | Unchanged maison | v2 is an operating layer, not a restyle |

---

## Appendix A — Fleet (v1, carried into v2)

| id | Motor car | Year | 12-hour rate | Note |
| --- | --- | --- | --- | --- |
| `gwagon` | Mercedes-Benz G-Class | 2022 | NGN 1,000,000 | — |
| `escalade` | Cadillac Escalade | — | NGN 650,000 | — |
| `prado` | Toyota Land Cruiser Prado | 2020 | NGN 150,000 | Island & Airport |

Duration tokens: `12`, `24`, `enterprise` (with `days` ∈ 2…90).  
Areas: `island`, `airport`, `lekki`, `mainland`, `other`.

---

## Appendix B — Request record

Fields written today by `POST /api/book`, plus the house fields v2 adds.

```
id              GW-…
carId           gwagon | escalade | prado
neededOn        YYYY-MM-DD
duration        12 | 24 | enterprise
days            integer | null
area            island | airport | lekki | mainland | other
pickup          string
name            string
phone           string
email           string
additionalInfo  string
status          pending | confirmed | done | declined     (house)
houseNote       string                                     (house)
createdAt       ISO-8601
```

---

## Appendix C — What this paper is not

This paper is not a legal terms of hire, an insurance schedule, or a chauffeur employment policy. Those belong to ORANGERED Ltd’s operating files, not the website.

It is not a promise to build v3. v3 is only licensed if v2’s four-week test passes.

---

© 2026 GW Luxury. A product of ORANGERED Ltd.
