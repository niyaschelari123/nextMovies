import { NextResponse } from "next/server";

const PASSWORD = process.env.PROTECT_PASSWORD || "your-secure-password";

export function middleware(request) {
  const basicAuth = request.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pass] = Buffer.from(authValue, "base64").toString().split(":");

    if (pass === PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
