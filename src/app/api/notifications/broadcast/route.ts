import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sendSMS, sendWhatsAppTemplate } from '@/lib/notifications';

const schema = z.object({
  schoolId: z.string(),
  title: z.string().min(1),
  body: z.string().min(1),
  channel: z.enum(['SMS', 'WHATSAPP']),
  audience: z.enum(['ALL_PARENTS', 'ALL_TEACHERS']),
  whatsappTemplate: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const input = schema.parse(await req.json());
    const school = await db.school.findUnique({ where: { id: input.schoolId } });
    if (!school) return NextResponse.json({ ok: false, error: 'School not found' }, { status: 404 });

    const recipients = input.audience === 'ALL_PARENTS'
      ? await db.user.findMany({ where: { schoolId: input.schoolId, role: 'PARENT', active: true, phone: { not: null } } })
      : await db.user.findMany({ where: { schoolId: input.schoolId, role: 'TEACHER', active: true, phone: { not: null } } });

    const campaign = await db.messageCampaign.create({
      data: { schoolId: input.schoolId, title: input.title, body: input.body, channel: input.channel, audience: input.audience, status: 'SENDING' }
    });

    let sent = 0;
    for (const recipient of recipients) {
      if (!recipient.phone) continue;
      const result = input.channel === 'SMS'
        ? await sendSMS(recipient.phone, input.body, school.senderId || undefined)
        : await sendWhatsAppTemplate(recipient.phone, input.whatsappTemplate || 'general_school_notice', 'en', [input.body]);

      await db.notificationDelivery.create({
        data: {
          campaignId: campaign.id,
          channel: input.channel,
          recipient: recipient.phone,
          body: input.body,
          provider: result.provider,
          providerId: result.id,
          status: result.ok ? 'SENT' : 'FAILED',
          error: result.error
        }
      });
      if (result.ok) sent++;
    }

    await db.messageCampaign.update({
      where: { id: campaign.id },
      data: { status: sent === recipients.length ? 'SENT' : sent > 0 ? 'PARTIAL' : 'FAILED' }
    });

    return NextResponse.json({ ok: true, campaignId: campaign.id, recipients: recipients.length, sent });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 });
  }
}
