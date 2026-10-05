import DashboardShell from '@/components/DashboardShell';
export default function Admin(){return <DashboardShell role="Admin" title="School Administration">
  <div className="grid">
    <div className="card"><div className="muted">Students</div><div className="metric">1,248</div></div>
    <div className="card"><div className="muted">Present today</div><div className="metric">1,121</div></div>
    <div className="card"><div className="muted">Staff</div><div className="metric">76</div></div>
    <div className="card"><div className="muted">Fees collected</div><div className="metric">GH₵ 82k</div></div>
  </div>
  <div className="two section">
    <div className="card"><h3>Live attendance</h3><table className="table"><thead><tr><th>Student</th><th>Class</th><th>Event</th><th>Time</th></tr></thead><tbody>
      <tr><td>Akosua Mensah</td><td>JHS 2A</td><td><span className="badge">Checked in</span></td><td>7:31 AM</td></tr>
      <tr><td>Kwame Owusu</td><td>Primary 6</td><td><span className="badge">Checked in</span></td><td>7:34 AM</td></tr>
      <tr><td>Efua Boateng</td><td>SHS 1</td><td><span className="badge">Checked in</span></td><td>7:36 AM</td></tr>
    </tbody></table></div>
    <div className="card"><h3>Communication centre</h3><p className="muted">Send meeting notices, emergency announcements, fee reminders and general school messages.</p><div className="actions"><div className="action"><b>Bulk SMS</b><p className="muted">Parents, staff or selected classes.</p></div><div className="action"><b>WhatsApp</b><p className="muted">Approved templates and notices.</p></div><div className="action"><b>In-app</b><p className="muted">Free push/inbox messages.</p></div></div></div>
  </div>
</DashboardShell>}
