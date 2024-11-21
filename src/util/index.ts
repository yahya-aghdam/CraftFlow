import { Request, Response } from 'express';
import { CookieT } from '../interface';
import { GOOGLE_CLIENT_ID, JWT_SECRET } from '../config/dotenv';

import jwt from 'jsonwebtoken';
import { googleUrls, redirect_api_url } from '../config/constants';
import linksmith from 'linksmith';

// Make sure that all necessary vars are in .env file
export function validateEnv() {
    const requiredVars = [
        'JWT_SECRET',
        "COOKIE_DOMAIN",
        "MAIN_URL",
        "API_PATH",
        "HTTP_PORT",
        "PROTO_URL",
        "PROTO_PORT",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "SUCCESS_AUTH_REDIRECT_PATH"

    ];
    const missingVars = requiredVars.filter((envVar) => !process.env[envVar]);

    if (missingVars.length > 0) {
        console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        process.exit(1);
    }
}

// Get cookies from request
export function getCookies(req: Request): { [key: string]: string } | undefined {

    const headersCookie = req.headers.cookie;
    let cookies = undefined

    if (headersCookie) {
        cookies = headersCookie.split(';').reduce((res, item) => {
            const data = item.trim().split('=')
            const key = data[0].trim();
            const value = data[1]?.trim();
            return { ...res, [key]: value };
        }, {})
    }

    return cookies
}

// Make cookie and save it in client browser
export function cookieMaker(res: Response, cookie: CookieT) {
    res.cookie(cookie.name, cookie.data, cookie.options);
}

// Delete cookie by making expire time to 0
export function cookieDeleter(res: Response, cookieName: string) {
    res.cookie(cookieName, "", { maxAge: 0 });
}

// Sign data with specific algorithm and return it
export function tokenMaker(data: any, algorithm?: string): string {
    return jwt.sign({ data: data, algorithm: algorithm }, JWT_SECRET);
}


// Make URL for redirecting user to Google Oauth2 server
export function googleURLMaker(scope: string = ""): string {

    scope == "" ? scope = googleUrls.scope : scope

    return linksmith(googleUrls.mainUrl, {
        queryParams: {
            redirect_uri: redirect_api_url,
            client_id: GOOGLE_CLIENT_ID,
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: scope,
        }
    })
}

// Return Date object based on expiration days
export function expireTimeMaker(days: number): Date {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}