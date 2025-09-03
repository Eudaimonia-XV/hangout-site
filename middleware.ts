import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const auth = req.headers.get("authorization");
    const user = process.env.SITE_USER ?? "friends";
    const pass = process.env.SITE_PASSWORD ?? "hike123";

    // If no Authorization header or not Basic, prompt
    if (!auth || !auth.startsWith("Basic ")) {
        return new Response("Authentication required.", {
            status: 401,
            headers: { "WWW-Authenticate": 'Basic realm="Simulatus"' },
        });
    }

    // Decode "Basic base64(username:password)" without Buffer (Edge runtime)
    let decoded = "";
    try {
        const base64 = auth.split(" ")[1] ?? "";
        decoded = atob(base64);
    } catch {
        return new Response("Bad Authorization header.", { status: 400 });
    }

    // Split "username:password"
    const sep = decoded.indexOf(":");
    const u = sep >= 0 ? decoded.slice(0, sep) : "";
    const p = sep >= 0 ? decoded.slice(sep + 1) : "";

    if (u !== user || p !== pass) {
        return new Response("Unauthorized.", {
            status: 401,
            headers: { "WWW-Authenticate": 'Basic realm="Simulatus"' },
        });
    }

    return NextResponse.next();
}

// Protect everything except static assets/icons
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
