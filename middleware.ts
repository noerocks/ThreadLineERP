import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/actions/session";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname;
  const publicRoutes = ["/", "/login", "/register"];
  const session = (await cookies()).get("session")?.value;
  const isPublicRoute = publicRoutes.includes(pathName);
  const payload = await decrypt(session);

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (session && !payload) {
    console.log("session tampered");
    const res = NextResponse.redirect(new URL("/login", req.nextUrl));
    res.cookies.delete("session");
    return res;
  }

  if (payload && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
