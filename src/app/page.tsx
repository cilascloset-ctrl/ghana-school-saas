import Link from 'next/link';
export default function Home(){return <main className="hero">
  <span className="pill">Ghanaian School SaaS • Offline-first</span>
  <h1>Run attendance, academics, fees and parent communication from one school platform.</h1>
  <p>EduLink Ghana is designed for nursery, basic, JHS, SHS and private schools. It keeps working during poor internet, syncs later, and can notify parents by SMS and WhatsApp when a child arrives or leaves school.</p>
  <div className="roles">
    <Link className="role" href="/admin"><strong>Admin Dashboard</strong><span className="muted">Students, staff, fees, attendance, messaging and reports.</span></Link>
    <Link className="role" href="/teacher"><strong>Teacher Dashboard</strong><span className="muted">Classes, attendance, scores, assignments and notices.</span></Link>
    <Link className="role" href="/student"><strong>Student Dashboard</strong><span className="muted">Timetable, results, attendance and learning tasks.</span></Link>
    <Link className="role" href="/parent"><strong>Parent Dashboard</strong><span className="muted">Child attendance, results, fees and school notifications.</span></Link>
  </div>
</main>}
