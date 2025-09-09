import { env } from "@/env";
import { SignJWT } from "jose";

export async function createJwt(payload: { sub: string; username: string }) {
  const secret = env.JWT_PRIVATE;

  if (!secret) {
    throw new Error("JWT_PRIVATE environment variable is not set");
  }
  // jose requires secret as Uint8Array
  const secretBytes = new TextEncoder().encode(secret);

  const jwt = await new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretBytes);

  return jwt;
}
