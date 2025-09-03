export function checkCreds(u: string, p: string) {
    const expectedUser = process.env.SITE_USER!;
    const expectedPass = process.env.SITE_PASSWORD!;
    return u === expectedUser && p === expectedPass;
}

export const AUTH_COOKIE = "session";
