import { db } from './db';
import { sendSMS, sendWhatsAppTemplate } from './notifications';

export async function createAttendanceEvent(input: {
  schoolId: string;
  studentId: string;
  action: 'CHECK_IN' | 'CHECK_OUT';
  occurredAt?: Date;
  source?: string;
  deviceId?: string;
  clientEventId?: string;
}) {
  const existing = input.clientEventId
    ? await db.attendanceEvent.findUnique({ where: { clientEventId: input.clientEventId } })
    : null;
  if (existing) return existing;

  const event = await db.attendanceEvent.create({
    data: {
      schoolId: input.schoolId,
      studentId: input.studentId,
      action: input.action,
      occurredAt: input.occurredAt || new Date(),
      source: input.source || 'MANUAL',
      deviceId: input.deviceId,
      clientEventId: input.clientEventId
    },
    include: {
      student: {
        include: {
          school: true,
          parents: { include: { parent: true } }
        }
      }
    }
  });

  const studentName = `${event.student.firstName} ${event.student.lastName}`;
  const verb = event.action === 'CHECK_IN' ? 'reported to school' : 'left school';
  const timestamp = event.occurredAt.toLocaleString('en-GB', { timeZone: 'Africa/Accra' });
  const body = `${event.student.school.name}: ${studentName} ${verb} at ${timestamp}.`;

  for (const link of event.student.parents) {
    const phone = link.parent.phone;
    if (!phone) continue;

    const sms = await sendSMS(phone, body, event.student.school.senderId || undefined);
    await db.notificationDelivery.create({
      data: {
        attendanceId: event.id,
        channel: 'SMS',
        recipient: phone,
        body,
        provider: sms.provider,
        providerId: sms.id,
        status: sms.ok ? 'SENT' : 'FAILED',
        error: sms.error
      }
    });

    // For production, create approved templates such as student_check_in / student_check_out.
    const wa = await sendWhatsAppTemplate(phone, event.action === 'CHECK_IN' ? 'student_check_in' : 'student_check_out', 'en', [studentName, timestamp]);
    await db.notificationDelivery.create({
      data: {
        attendanceId: event.id,
        channel: 'WHATSAPP',
        recipient: phone,
        body,
        provider: wa.provider,
        providerId: wa.id,
        status: wa.ok ? 'SENT' : 'FAILED',
        error: wa.error
      }
    });
  }

  return event;
}
