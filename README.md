# EduLink Ghana — Offline-first SaaS School Management Starter

A production-oriented starter for Ghanaian schools with multi-school SaaS tenancy, admin/teacher/student/parent dashboards, attendance notifications, bulk SMS/WhatsApp, and offline attendance sync.

## What is included

- Multi-tenant school database model
- Admin, teacher, student and parent dashboard starter screens
- Students, parents, teachers, classes and subjects data model
- Check-in/check-out attendance API
- Automatic parent SMS + WhatsApp attendance notifications
- Bulk SMS/WhatsApp campaign API
- Offline IndexedDB attendance queue + sync endpoint
- Duplicate-safe `clientEventId` sync logic
- PWA manifest and service worker starter
- Notification delivery tracking
- Audit/sync database tables
- PostgreSQL + Prisma

## Recommended production architecture

```text
School phones/tablets/PCs
       |
       | PWA works online/offline
       v
Next.js Web App + API
       |
       +---- PostgreSQL (all schools separated by schoolId)
       |
       +---- SMS adapter ---- Arkesel / Hubtel
       |
       +---- WhatsApp adapter ---- WhatsApp Business Cloud API
       |
       +---- Object storage (future: report cards, files, photos)

Optional for schools with long internet outages:
Local edge mini-PC/Raspberry Pi on school LAN
       |
       +---- local attendance/device capture
       +---- sync to cloud when internet returns
```

## Important attendance workflow

1. Student taps RFID card, scans QR code or is marked manually.
2. Device creates a unique `clientEventId`.
3. If internet is available, event goes directly to `/api/attendance/check`.
4. If offline, event is stored in IndexedDB.
5. When internet returns, `/api/sync` uploads queued events.
6. Server ignores duplicates by `clientEventId`.
7. Parent receives SMS/WhatsApp notification once.

Example messages:

- `Adom School: Ama Mensah reported to school at 07:31.`
- `Adom School: Ama Mensah left school at 15:18.`
- `PTA meeting: Friday at 2:00 PM in the school hall.`

## Dashboards to complete

### Super Admin (SaaS owner)
- Schools and subscriptions
- Active users and tenant usage
- SMS/WhatsApp usage and billing
- Support tickets
- Global audit logs

### School Admin
- Admissions/student records
- Staff and teacher records
- Classes, houses, subjects and timetable
- Attendance
- Fees and payment reconciliation
- Results/report cards
- Bulk messaging
- Parent records
- Inventory/library/transport (phase 2)
- Reports and exports

### Teacher
- My classes
- Student attendance
- Continuous assessment
- Exams/scores
- Assignments
- Lesson notes
- Class notices
- Behaviour/remarks

### Student
- Timetable
- Attendance
- Results/report cards
- Assignments
- Notices
- Fees/balance (optional visibility)

### Parent
- Child live attendance status
- Arrival/departure timeline
- Results
- Fees and receipts
- Meetings/notices
- Message preferences
- Multiple children under one account

## Ghana-specific product decisions

- Currency: Ghana Cedi (GH₵)
- Time zone: Africa/Accra
- Phone normalization: `024xxxxxxx` -> `23324xxxxxxx`
- SMS provider abstraction: Arkesel / Hubtel / future provider
- WhatsApp should use approved business templates for proactive notifications
- Store school-level sender ID and messaging credentials/configuration
- Build consent, retention, access control and audit features before production rollout

## Local setup

1. Install Node.js and Docker Desktop.
2. Copy `.env.example` to `.env`.
3. Start PostgreSQL:
   `docker compose up -d`
4. Install packages:
   `npm install`
5. Create tables:
   `npm run db:push`
6. Seed demo data:
   `npm run db:seed`
7. Start:
   `npm run dev`
8. Open `http://localhost:3000`

Demo seed login data is created as:
- email: `admin@demo.school`
- password: `Password123!`

Authentication UI/API is intentionally the next implementation step; do not expose the demo credentials in production.

## Production work still required

This repository is a solid starter/MVP foundation, not a finished audited production release. Before live schools use it, implement:

- Full authentication, password reset, MFA for admins
- Strict tenant authorization on every server query
- Role/permission middleware
- Rate limiting and anti-abuse controls
- Real Hubtel adapter after confirming active account API details
- WhatsApp webhook + template approval workflow
- Arkesel delivery callback endpoint
- Queue worker (Redis/BullMQ or managed queue) for large broadcasts
- Fee payments (Hubtel/Mobile Money) and reconciliation
- Academic grading rules for each school
- Backups, monitoring and disaster recovery
- Data retention/deletion workflows
- DPC/privacy documentation and contracts
- End-to-end tests and penetration/security review

## Suggested build phases

### Phase 1 — Core school operations
Tenant setup, users, students, parents, teachers, classes, attendance, SMS/WhatsApp, dashboard.

### Phase 2 — Academics + finance
Timetable, subjects, assessments, report cards, fees, receipts, Mobile Money.

### Phase 3 — Full operations
Admissions, library, inventory, transport, payroll, hostel/boarding, disciplinary records, analytics.

### Phase 4 — SaaS business layer
School subscription plans, billing, reseller/agent tools, onboarding, usage metering and super-admin support console.
