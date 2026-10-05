import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAttendanceEvent } from '@/lib/attendance';

const schema = z.object({
  schoolId: z.string().min(1),
  studentId: z.string().min(1),
  action: z.enum(['CHECK_IN', 'CHECK_OUT']),
  occurredAt: z.string().datetime().optional(),
  source: z.enum(['MANUAL', 'QR', 'RFID', 'BIOMETRIC', 'OFFLINE']).optional(),
  deviceId: z.string().optional(),
  clientEventId: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const input = schema.parse(await req.json());
    const event = await createAttendanceEvent({
      ...input,
      occurredAt: input.occurredAt ? new Date(input.occurredAt) : undefined
    });
    return NextResponse.json({ ok: true, event });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 });
  }
}
