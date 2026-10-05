import { SignJWT, jwtVerify } from 'jose';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-change-me');
export type Session = { userId:string; schoolId?:string|null; role:string; name:string };
export async function createToken(session: Session){return new SignJWT(session).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('12h').sign(secret)}
export async function verifyToken(token:string){const {payload}=await jwtVerify(token,secret);return payload as unknown as Session}
