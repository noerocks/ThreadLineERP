import "server-only";
import { jwtVerify, SignJWT } from "jose";
import z from "zod";
import { SessionPayload } from "../zod-definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
type SessionPayloadType = z.infer<typeof SessionPayload>;

export async function encrypt(payload: SessionPayloadType) {
  return new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

export async function createSession(
  payload: Omit<SessionPayloadType, "expiresAt">
) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  const session = await encrypt({ ...payload, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);
  const cookieStore = await cookies();
  if (!session || !payload) {
    return null;
  }
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession() {
  const session = (await cookies()).get("session")?.value;
  const payload = (await decrypt(session)) as SessionPayloadType;
  if (!payload?.id) {
    redirect("/login");
  }
  return {
    isAuth: true,
    user: payload,
  };
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
