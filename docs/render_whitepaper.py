#!/usr/bin/env python3
"""Render the GW Luxury v2 whitepaper to PDF."""

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT = "/Users/mac/WorkBuddy AI/2026-08-13-00-41-32/docs/GW-Luxury-v2-Whitepaper.pdf"

IVORY = colors.HexColor("#f9f3e8")
CHARCOAL = colors.HexColor("#1a1612")
INK = colors.HexColor("#2a2420")
SOFT = colors.HexColor("#5c5348")
CHAMPAGNE = colors.HexColor("#8a6f4a")
CHAMPAGNE_BRIGHT = colors.HexColor("#c9a87c")
RULE = colors.HexColor("#d9cbb8")
ROW_ALT = colors.HexColor("#f3ebe0")
HEADER_BG = colors.HexColor("#1a1612")
HEADER_FG = colors.HexColor("#ece4d6")


def styles():
    base = getSampleStyleSheet()
    s = {
        "kicker": ParagraphStyle(
            "kicker",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=8,
            leading=12,
            textColor=CHAMPAGNE,
            alignment=TA_CENTER,
            letterSpacing=3,
            spaceAfter=6,
        ),
        "title": ParagraphStyle(
            "title",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=28,
            leading=34,
            textColor=CHARCOAL,
            alignment=TA_CENTER,
            spaceBefore=8,
            spaceAfter=6,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base["Normal"],
            fontName="Times-Italic",
            fontSize=16,
            leading=22,
            textColor=CHAMPAGNE,
            alignment=TA_CENTER,
            spaceAfter=14,
        ),
        "meta": ParagraphStyle(
            "meta",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=9,
            leading=13,
            textColor=SOFT,
            alignment=TA_CENTER,
            spaceAfter=28,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=13,
            leading=18,
            textColor=CHARCOAL,
            spaceBefore=18,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=11,
            leading=15,
            textColor=CHAMPAGNE,
            spaceBefore=12,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=10,
            leading=15,
            textColor=INK,
            alignment=TA_JUSTIFY,
            spaceAfter=8,
        ),
        "pull": ParagraphStyle(
            "pull",
            parent=base["Normal"],
            fontName="Times-Italic",
            fontSize=12,
            leading=18,
            textColor=CHARCOAL,
            alignment=TA_LEFT,
            leftIndent=18,
            rightIndent=18,
            spaceBefore=8,
            spaceAfter=12,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=10,
            leading=14,
            textColor=INK,
            alignment=TA_LEFT,
        ),
        "th": ParagraphStyle(
            "th",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=8,
            leading=11,
            textColor=HEADER_FG,
        ),
        "td": ParagraphStyle(
            "td",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=8.5,
            leading=12,
            textColor=INK,
        ),
        "code": ParagraphStyle(
            "code",
            parent=base["Normal"],
            fontName="Courier",
            fontSize=8,
            leading=11,
            textColor=INK,
            leftIndent=12,
            spaceBefore=4,
            spaceAfter=10,
        ),
        "footer": ParagraphStyle(
            "footer",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=8,
            leading=11,
            textColor=SOFT,
        ),
        "end": ParagraphStyle(
            "end",
            parent=base["Normal"],
            fontName="Times-Italic",
            fontSize=9,
            leading=13,
            textColor=SOFT,
            alignment=TA_CENTER,
            spaceBefore=10,
        ),
    }
    return s


S = styles()
PAGE_W, PAGE_H = A4
ML, MR, MT, MB = 22 * mm, 22 * mm, 24 * mm, 22 * mm
CONTENT_W = PAGE_W - ML - MR


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(IVORY)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(CHAMPAGNE_BRIGHT)
    canvas.setLineWidth(0.6)
    canvas.line(ML, PAGE_H - 14 * mm, PAGE_W - MR, PAGE_H - 14 * mm)
    canvas.setFillColor(CHAMPAGNE)
    canvas.setFont("Times-Roman", 8)
    canvas.drawString(ML, PAGE_H - 12 * mm, "GW LUXURY")
    canvas.drawRightString(PAGE_W - MR, PAGE_H - 12 * mm, "v2.0  ·  INTERNAL")
    canvas.setStrokeColor(RULE)
    canvas.line(ML, 14 * mm, PAGE_W - MR, 14 * mm)
    canvas.setFillColor(SOFT)
    canvas.setFont("Times-Roman", 8)
    canvas.drawString(ML, 10 * mm, "A product of ORANGERED Ltd  ·  September 2026")
    canvas.drawRightString(PAGE_W - MR, 10 * mm, str(doc.page))
    canvas.restoreState()


def P(text, style="body"):
    return Paragraph(text, S[style])


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(i, S["bullet"]), leftIndent=12, bulletColor=CHAMPAGNE) for i in items],
        bulletType="bullet",
        start="–",
        leftIndent=16,
        bulletFontName="Times-Roman",
        bulletFontSize=10,
        spaceAfter=8,
    )


def table(headers, rows, col_widths):
    head = [Paragraph(h, S["th"]) for h in headers]
    body = [[Paragraph(c, S["td"]) for c in row] for row in rows]
    data = [head] + body
    t = Table(data, colWidths=col_widths, repeatRows=1)
    cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), HEADER_BG),
        ("TEXTCOLOR", (0, 0), (-1, 0), HEADER_FG),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.3, RULE),
        ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            cmds.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
    t.setStyle(TableStyle(cmds))
    return t


def story():
    W = CONTENT_W
    s = []

    s += [
        Spacer(1, 8 * mm),
        P("A PRODUCT OF ORANGERED LTD", "kicker"),
        P("GW Luxury", "title"),
        P("Version 2 Operating Whitepaper", "subtitle"),
        P("September 2026  ·  Internal  ·  v2.0", "meta"),
        P(
            "GW Luxury is a Lagos chauffeur practice. The guest does not collect a car. "
            "A chauffeur arrives at the pickup address, fuel included, in one of three motor cars: "
            "a 2022 Mercedes-Benz G-Class, a Cadillac Escalade, or a 2020 Toyota Land Cruiser Prado."
        ),
        P(
            "Version 1 is a public maison: a homepage, a fleet, and a booking request. "
            "It is fit for showing the offer. It is not fit for running the offer. Requests are "
            "written to a JSON file that does not survive a Vercel deployment, and nobody is "
            "notified when a request lands."
        ),
        P(
            "Version 2 does not enlarge the guest surface. It makes the existing request durable, "
            "visible, and answerable. The operator product is an inbox, not a dashboard. Charts, "
            "calendars, deposits, and staff accounts wait until volume justifies them."
        ),
        P("1. Purpose of this paper", "h1"),
        P(
            "This is an operating paper, not a pitch deck. It exists so ORANGERED Ltd can build "
            "the next slice of GW Luxury without confusing a marketing site for a business system. "
            "It is written for the people who will ship it, and for anyone who has to decide whether "
            "a proposed feature belongs in v2 or later."
        ),
        P("Three questions govern every section:", "body"),
        bullets(
            [
                "Does the guest still meet a restrained, chauffeur-led house?",
                "Does a request survive, get seen, and get answered the same day?",
                "Are we adding an operator tool, or an operator hobby?",
            ]
        ),
        P("If a feature fails the first or the third, it is not v2."),
        P("2. The v1 surface", "h1"),
        P(
            "v1 is a Next.js 14 App Router site. Three public routes, one private write. "
            "The guest contract is already clear: we come to you. v2 does not reopen that."
        ),
        table(
            ["Route", "Role"],
            [
                ["/", "Maison. Lagos, stacked GW / Luxury, G-Wagon still, arrangement, The fleet."],
                ["/collection", "Three cars, twelve-hour rates, hover 3/4 to front, Book this car."],
                ["/book", "Request form. Vehicle, date needed, duration, area, pickup, identity, notes."],
                ["POST /api/book", "Validates the request and appends it to bookings.json."],
            ],
            [32 * mm, W - 32 * mm],
        ),
        Spacer(1, 4 * mm),
        P("Published twelve-hour rates — chauffeur and fuel included, dispatched to the guest:"),
        table(
            ["Motor car", "Rate"],
            [
                ["Mercedes-Benz G-Class 2022", "NGN 1,000,000"],
                ["Cadillac Escalade", "NGN 650,000"],
                ["Toyota Land Cruiser Prado 2020", "NGN 150,000 · Island &amp; Airport"],
            ],
            [W * 0.62, W * 0.38],
        ),
        Spacer(1, 3 * mm),
        P(
            "Duration is twelve hours, twenty-four hours, or Enterprise (2–90 days). Only twelve "
            "hours is priced on the page. Twenty-four hours and enterprise are confirmed after the "
            "request. Areas of use: Lagos Island, Airport, Lekki, Mainland, Other. Prado’s published "
            "rate is Island and Airport; other areas are confirmed after the request."
        ),
        P("3. Diagnosis", "h1"),
        P("v1 fails as an operation in four specific ways. None of them are design problems."),
        P("<b>Requests vanish.</b> On Vercel the store is <font face='Courier' size='8'>/tmp/bookings.json</font>. That filesystem is not durable. A successful form post can still be a lost job."),
        P("<b>Nobody is told.</b> bookings@gwluxury.com exists as a constant. Nothing sends mail, WhatsApp, or SMS when a request is saved. The house is deaf."),
        P("<b>There is no inbox.</b> To read a request someone must open a JSON file on a machine that may not have it. There is no list, no status, no phone link, no “we confirmed this.”"),
        P("<b>Quote and calendar are still oral.</b> Twenty-four-hour and enterprise rates are promised as a callback. Without a durable record, the callback has nothing to stand on. Date-needed is now on the form; it is not yet on a board the chauffeur can trust."),
        P("These are not arguments for a dashboard. They are arguments for memory, a ping, and a list."),
        P("4. The offer, restated", "h1"),
        P("GW Luxury is not a self-drive rental and not a ride-hailing marketplace."),
        bullets(
            [
                "The unit of sale is a <b>chauffeured motor car</b>, not a seat and not a key.",
                "The car <b>goes to the guest</b>. Pickup address is required.",
                "<b>Fuel is included.</b> The guest does not budget petrol.",
                "<b>Twelve-hour rates are public.</b> Longer hire is a conversation, not a calculator.",
                "The house is small: <b>three cars</b>. Scarcity is the product, not a defect.",
            ]
        ),
        P("v2 protects that offer. It does not add a fourth car, a membership, or a consumer app. It makes the existing offer operable."),
        P("5. Who we serve", "h1"),
        P("<b>The guest</b> is in Lagos — Island, Lekki, airport, sometimes mainland — and wants a G-Wagon, Escalade, or Prado with a driver, on a known date, without haggling through a form that looks like a logistics portal. They may be booking for a day, a night, or an enterprise stretch (board week, family visit, production). They give a phone number because that is how Lagos confirms."),
        P("<b>The operator</b> is the house: whoever reads the request, prices the 24-hour or enterprise job, assigns a chauffeur, and calls the guest. At v2 scale this is one or two people, not a control room."),
        P("v2 is built for those two. It is not built for a hypothetical fleet manager, a finance team, or a public API consumer."),
        P("6. The v2 thesis", "h1"),
        P("Make every request durable, visible, and answerable the same day. Do not build a dashboard until the inbox is too small.", "pull"),
        P("<b>Durable</b> means the record lives outside the web server’s temporary disk. Postgres, SQLite on a volume, or a hosted document store. The implementation is interchangeable; the property is not."),
        P("<b>Visible</b> means a private /admin list, password-protected, showing the incoming requests with vehicle, date, duration, area, pickup, phone, email, notes, and status. Phone and email are links. Status is pending, confirmed, or done."),
        P("<b>Answerable</b> means a ping at the moment of request — email to the house, and later WhatsApp if the house lives there — containing the same facts as the inbox row."),
        P("That is the whole of v2’s new surface. The public maison stays as it is, with only the copy and fields already on the book form."),
        P("7. Guest product in v2", "h1"),
        P("The guest should not feel v2, except that someone answers."),
        P("Keep:", "h2"),
        bullets(
            [
                "The editorial maison: Italiana, champagne, charcoal, G-Wagon still, arrangement.",
                "Fleet as three cars, not a catalogue.",
                "Book as a request, not a checkout. No card capture in v2.",
                "Date needed, duration (12 / 24 / Enterprise), days when enterprise, area, pickup, identity, optional notes.",
                "Published twelve-hour rate in the aside; quoted language for 24-hour and enterprise.",
            ]
        ),
        P("Do not add in v2:", "h2"),
        bullets(
            [
                "Guest accounts or “my bookings.”",
                "Live availability (“this G-Wagon is free on Thursday”).",
                "Instant price for 24-hour or enterprise.",
                "Payment, deposit, or invoice PDF.",
                "Chat widget, cookie-banner theatre, or a blog.",
            ]
        ),
        P("A confirmation screen with a reference (GW-…) already exists. v2 may email that reference to the guest. That is courtesy, not a portal."),
        P("8. Operator product: an inbox", "h1"),
        P("The operator tool is a list. It is allowed to be ugly relative to the maison. It must be fast, private, and complete."),
        P("8.1 What a row contains", "h2"),
        table(
            ["Field", "Source"],
            [
                ["Reference", "Assigned at write (GW- + time token)"],
                ["Vehicle, date needed, duration / days", "Form"],
                ["Area, pickup, name, phone, email, notes", "Form"],
                ["Status", "House: pending → confirmed → done (or declined)"],
                ["House note", "Operator only"],
                ["Created at", "Server"],
            ],
            [W * 0.42, W * 0.58],
        ),
        P("8.2 What the operator can do", "h2"),
        bullets(
            [
                "Open /admin behind a shared password (v2.0) or a single operator login (v2.1 if the password leaks into a screenshot).",
                "Filter by status and by date needed.",
                "Tap phone (tel:) and email (mailto:).",
                "Set status. Optionally leave a one-line house note (“quoted 1.8m / 24h, waiting on yes”).",
                "That is all.",
            ]
        ),
        P("8.3 What the operator cannot do in v2", "h2"),
        bullets(
            [
                "Drag cars onto a calendar.",
                "See utilisation charts.",
                "Assign named chauffeurs from a staff table.",
                "Edit published rates in the UI (rates stay in code until they change often enough to deserve a table).",
                "Message the guest from inside the app.",
            ]
        ),
        P("If those are needed, the inbox has already succeeded, and we are in v3."),
        P("9. Persistence and notification", "h1"),
        P("9.1 Store", "h2"),
        P(
            "Replace bookings.json on local disk / tmp with a store that outlives the instance. "
            "Recommendation: a single Postgres database (Vercel Postgres, Neon, or equivalent) with one "
            "bookings table. Three cars and a few dozen requests a week do not need a queue, a warehouse, "
            "or object storage. SQLite on a persistent volume is acceptable if the host provides one. "
            "It is not acceptable on a serverless filesystem."
        ),
        P("The write path stays POST /api/book. The read path is /admin and, if useful, GET /api/admin/bookings behind the same auth."),
        P("9.2 Ping", "h2"),
        P("On successful write: (1) persist the row; (2) send one email to the house address with the row in the body; (3) return the reference to the guest as today."),
        P(
            "<b>Failure policy:</b> the persist is the source of truth. If mail fails, the request is still "
            "in the inbox; the operator must not lose a job because the mailer timed out. Log the mail error. "
            "Do not roll back the booking. Guest copy of the mail is optional in v2.0 and recommended in v2.1. "
            "WhatsApp is a v2.1 add if the house actually reads WhatsApp faster than mail. Do not build both on day one."
        ),
        P("9.3 Auth", "h2"),
        P(
            "v2.0: HTTP basic or a single ADMIN_PASSWORD checked on /admin and its API. Rate-limit guesses. "
            "v2.1: one operator user, hashed password, session cookie. Still not a staff directory. "
            "The maison stays public. Admin is not linked from the footer."
        ),
        P("10. Enterprise and time", "h1"),
        P(
            "Enterprise is already on the form: a duration of “enterprise,” then 2–90 days, plus a date needed. "
            "The rate is not published because a week of a G-Wagon is not twelve hours times seven. It is a "
            "conversation about chauffeur rest, fuel, overnight, and whether the car stays with the guest."
        ),
        P("v2 does not invent a daily matrix. It does three things:"),
        bullets(
            [
                "Keep enterprise as a first-class duration so the request is not stuffed into Additional info.",
                "Show date needed and day count in the inbox, sorted by date needed, so the house can see collisions by eye.",
                "Leave pricing in the callback. A house note on the row is enough to record the quote.",
            ]
        ),
        P(
            "Collision detection (“G-Wagon already pending on 12 September”) is a small, honest v2.1 if two "
            "requests overlap. It is a banner on the inbox row, not a scheduling engine."
        ),
        P("11. System design", "h1"),
        P("Guest  -&gt;  Maison (Next.js: /  /collection  /book)", "code"),
        P("POST /api/book", "code"),
        P("Validate  -&gt;  Persist (Postgres)  -&gt;  Inbox /admin", "code"),
        P("Persist  -&gt;  Mail (house)  [optional: guest]", "code"),
        P(
            "Unchanged: Next.js 14, React 18, no extra UI kit on the public site; fleet and twelve-hour rates "
            "as code in app/lib/fleet.js until they churn; dark editorial CSS. Admin may be a plain, dense table "
            "in the same type family."
        ),
        P(
            "Added: a bookings table and a thin data module used by the public POST and the admin GET/PATCH; "
            "an auth gate on /admin; a mail helper, invoked after persist, never instead of persist. Hosting "
            "remains Vercel for the site. The database is the only new piece of infrastructure. That is deliberate. "
            "v2 is not a platform migration."
        ),
        P("12. Explicit non-goals", "h1"),
        P("The following are refused in v2 even if they are requested as “while we’re here”:"),
        table(
            ["Refused", "Why"],
            [
                ["Full admin dashboard", "Volume does not support it. An inbox does."],
                ["Payments / Paystack / Stripe", "The house still confirms by phone. Card capture before confirmation creates refunds and arguments."],
                ["Guest accounts", "One-off hire. Email + reference is enough."],
                ["Live fleet availability", "Three cars, oral assignment. A false “available” is worse than a callback."],
                ["Chauffeur app", "The chauffeur has a phone and a dispatcher."],
                ["Multi-tenant / white-label", "This is one house."],
                ["CMS for copy and rates", "Copy is the product. It belongs in the repo."],
                ["Analytics suite", "A request count in the inbox header is enough."],
                ["AI quoting", "Enterprise quotes are judgement."],
            ],
            [W * 0.36, W * 0.64],
        ),
        Spacer(1, 3 * mm),
        P("v3 is allowed to reopen payments, availability, and a calendar. It is not allowed to skip v2 to get there."),
        P("13. Delivery", "h1"),
        P("Three slices. Each is shippable alone. None requires the next."),
        P("<b>Slice A — Memory.</b> Persist bookings to Postgres. Keep the JSON writer as a local fallback in development if needed. Admin is not required yet; a database select is an acceptable first reader. This slice exists so a production request cannot evaporate."),
        P("<b>Slice B — Ping.</b> On persist, email the house. Include reference, vehicle, date, duration, pickup, phone, email, notes. If mail is not configured, log and continue."),
        P("<b>Slice C — Inbox.</b> /admin: password, list, status, house note, tel/mailto. Filter pending / confirmed / done. Default sort: date needed, then created at."),
        P("Stop after C. Use the house for a month. If the list is painful, v3 earns a calendar."),
        P("14. Risks", "h1"),
        P("<b>The house does not open the inbox.</b> Then the ping has to be the product. Put the phone number in the subject line. Do not compensate by building a dashboard nobody will open either."),
        P("<b>The shared password leaks.</b> Rotate it. If it leaks twice, do v2.1 login."),
        P("<b>Guests expect an instant yes.</b> The confirmation screen already says the house will confirm. Do not put a green “booked” state on a request that has not been accepted. Status pending is honest."),
        P("<b>Two G-Wagons on one Saturday.</b> Three cars, no automated lock. Slice C plus eyes. A collision banner in v2.1 if it happens more than once."),
        P("<b>Scope creeps into payments.</b> Payments couple refunds, failed charges, and “I already paid.” They wait until the callback is routine."),
        P("15. How we will know it worked", "h1"),
        P("v2 is successful when, for four consecutive weeks:"),
        bullets(
            [
                "Every production request is still in the store the next morning.",
                "The house can name, without opening JSON, whether a given day’s G-Wagon is spoken for.",
                "Time from submit to first human contact is under two hours during the working day.",
                "No guest is told “we never got that” when the form showed success.",
            ]
        ),
        P("It is not successful because /admin exists. It is successful because a request became a car at a door."),
        P("16. Decision record", "h1"),
        table(
            ["Decision", "Choice", "Reason"],
            [
                ["Operator surface", "Inbox, not dashboard", "Volume is a list, not a command centre"],
                ["Persistence", "Postgres (or equivalent)", "/tmp and repo JSON are not production"],
                ["Notification", "House email on write", "Persist first; ping second"],
                ["Payments", "Out of v2", "Confirmation is still a phone call"],
                ["Availability engine", "Out of v2", "Three cars; collision by eye"],
                ["Guest accounts", "Out of v2", "Hire is episodic"],
                ["Rate configuration", "Remain in code", "Three numbers; they change rarely"],
                ["Auth", "Shared admin password in v2.0", "One operator; login if it leaks"],
                ["Public design", "Unchanged maison", "v2 is an operating layer, not a restyle"],
            ],
            [W * 0.28, W * 0.32, W * 0.40],
        ),
        Spacer(1, 4 * mm),
        P("Appendix A — Fleet (v1, carried into v2)", "h1"),
        table(
            ["id", "Motor car", "Year", "12-hour rate", "Note"],
            [
                ["gwagon", "Mercedes-Benz G-Class", "2022", "NGN 1,000,000", "—"],
                ["escalade", "Cadillac Escalade", "—", "NGN 650,000", "—"],
                ["prado", "Toyota Land Cruiser Prado", "2020", "NGN 150,000", "Island &amp; Airport"],
            ],
            [22 * mm, W * 0.34, 18 * mm, 38 * mm, W - 22 * mm - W * 0.34 - 18 * mm - 38 * mm],
        ),
        Spacer(1, 3 * mm),
        P("Duration tokens: 12, 24, enterprise (with days from 2 to 90). Areas: island, airport, lekki, mainland, other."),
        P("Appendix B — Request record", "h1"),
        P("id · carId · neededOn · duration · days · area · pickup · name · phone · email · additionalInfo", "code"),
        P("status (pending | confirmed | done | declined) · houseNote · createdAt", "code"),
        KeepTogether(
            [
                P("Appendix C — What this paper is not", "h1"),
                P(
                    "This paper is not a legal terms of hire, an insurance schedule, or a chauffeur employment "
                    "policy. Those belong to ORANGERED Ltd’s operating files, not the website. It is not a promise "
                    "to build v3. v3 is only licensed if v2’s four-week test passes."
                ),
                P("© 2026 GW Luxury. A product of ORANGERED Ltd.", "end"),
            ]
        ),
    ]
    return s


def main():
    doc = SimpleDocTemplate(
        OUT,
        pagesize=A4,
        leftMargin=ML,
        rightMargin=MR,
        topMargin=MT,
        bottomMargin=MB,
        title="GW Luxury — Version 2 Operating Whitepaper",
        author="ORANGERED Ltd",
        subject="v2 operating paper: durable requests, house ping, operator inbox",
    )
    doc.build(story(), onFirstPage=header_footer, onLaterPages=header_footer)
    print("wrote", OUT)


if __name__ == "__main__":
    main()
