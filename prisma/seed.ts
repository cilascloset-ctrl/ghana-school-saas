import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 10) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 10 characters) before seeding.');
  }

  const school = await db.school.upsert({
    where: { slug: 'demo-school' },
    update: {},
    create: {
      name: 'Demo Ghana School',
      slug: 'demo-school',
      phone: '0240000000',
      address: 'Ghana',
      senderId: 'DEMOSCHOOL'
    }
  });

  const hash = await bcrypt.hash(password, 10);

  const admin = await db.user.upsert({
    where: { email },
    update: { passwordHash: hash, active: true, schoolId: school.id, role: 'SCHOOL_ADMIN' },
    create: {
      schoolId: school.id,
      role: 'SCHOOL_ADMIN',
      name: 'School Administrator',
      email,
      phone: '0240000000',
      passwordHash: hash
    }
  });

  console.log({ schoolId: school.id, admin: admin.email });
}

main().finally(() => db.$disconnect());
