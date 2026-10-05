import Link from 'next/link';

export default function DashboardShell({ role, title, children }: { role: string; title: string; children: React.ReactNode }) {
  return <div className="shell">
    <aside className="side">
      <div className="brand">EduLink Ghana</div>
      <div className="muted" style={{color:'#9fc4ad',marginBottom:14}}>{role}</div>
      <nav className="nav">
        <Link href={`/${role.toLowerCase()}`}>Dashboard</Link>
        <a href="#">Attendance</a><a href="#">Academics</a><a href="#">Messages</a><a href="#">Fees</a><a href="#">Reports</a><a href="#">Settings</a>
      </nav>
    </aside>
    <main className="main">
      <div className="top"><div className="title"><h1>{title}</h1><p>Ghana • Online + offline-ready</p></div><span className="pill">● Sync online</span></div>
      {children}
    </main>
  </div>
}
