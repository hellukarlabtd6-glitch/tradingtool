import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "sd_access";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

// data: { customerId, email }
export async function createToken(data) {
  return await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function readToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { customerId: String(payload.customerId), email: String(payload.email || "") };
  } catch {
    return null;
  }
}
