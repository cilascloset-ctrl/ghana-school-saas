import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { createToken } from '@/lib/auth';
const schema=z.object({email:z.string().email(),password:z.string().min(8)});
export async function POST(req:NextRequest){
  try{
    const {email,password}=schema.parse(await req.json());
    const user=await db.user.findUnique({where:{email}});
    if(!user || !user.active || !(await bcrypt.compare(password,user.passwordHash))) return NextResponse.json({ok:false,error:'Invalid email or password'},{status:401});
    const token=await createToken({userId:user.id,schoolId:user.schoolId,role:user.role,name:user.name});
    const res=NextResponse.json({ok:true,role:user.role});
    res.cookies.set('edulink_session',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*12});
    return res;
  }catch(e){return NextResponse.json({ok:false,error:e instanceof Error?e.message:'Login failed'},{status:400})}
}
