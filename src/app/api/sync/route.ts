import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAttendanceEvent } from '@/lib/attendance';
import { db } from '@/lib/db';

const operationSchema = z.object({
  schoolId: z.string(),
  deviceId: z.string(),
  clientEventId: z.string(),
  entityType: z.literal('attendance'),
  operation: z.literal('create'),
  payload: z.object({
    studentId: z.string(),
    action: z.enum(['CHECK_IN', 'CHECK_OUT']),
    occurredAt: z.string().datetime()
  })
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const operations = z.array(operationSchema).parse(body.operations || []);
  const results = [];

  for (const op of operations) {
    const already = await db.syncOperation.findUnique({ where: { clientEventId: op.clientEventId } });
    if (already) {
      results.push({ clientEventId: op.clientEventId, status: 'already_processed' });
      continue;
    }

    await createAttendanceEvent({
      schoolId: op.schoolId,
      studentId: op.payload.studentId,
      action: op.payload.action,
      occurredAt: new Date(op.payload.occurredAt),
      source: 'OFFLINE',
      deviceId: op.deviceId,
      clientEventId: op.clientEventId
    });

    await db.syncOperation.create({
      data: { ...op, payload: op.payload, processedAt: new Date() }
    });
    results.push({ clientEventId: op.clientEventId, status: 'processed' });
  }

  return NextResponse.json({ ok: true, results });
}
