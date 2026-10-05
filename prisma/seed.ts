import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const db = new PrismaClient();
async function main(){
  const school = await db.school.upsert({
    where:{slug:'demo-school'},
    update:{},
    create:{name:'Demo Ghana School',slug:'demo-school',phone:'0240000000',address:'Ghana',senderId:'DEMOSCHOOL'}
  });
  const hash = await bcrypt.hash('Password123!',10);
  const admin = await db.user.upsert({
    where:{email:'admin@demo.school'},
    update:{},
    create:{schoolId:school.id,role:'SCHOOL_ADMIN',name:'School Administrator',email:'admin@demo.school',phone:'0240000000',passwordHash:hash}
  });
  console.log({schoolId:school.id,admin:admin.email,password:'Password123!'});
}
main().finally(()=>db.$disconnect());
