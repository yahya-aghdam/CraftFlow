import linksmith from "linksmith";
import { ProviderURLT } from "../interface";
import { MAIN_URL, HTTP_PORT, COOKIE_DOMAIN, PROTO_PORT, PROTO_URL } from "./dotenv";
import { CookieOptions } from "express";

export const DEV_MODE = true;

export const authCookieName = "gAuth"

export const authCooieOptions: CookieOptions = {
    domain: COOKIE_DOMAIN,
    path: "/",
    httpOnly: true,
    priority: "high",
    secure: true,
}

export const expireAfterDays = 30

export const googleUrls: ProviderURLT = {
    mainUrl: 'https://accounts.google.com/o/oauth2/v2/auth?',
    scope:
        'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    AccessTokenURL:
        'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=',
};

export const redirect_api_url = linksmith(MAIN_URL, { port: HTTP_PORT, paths: ["api", "g_auth", "google"] })
export const proto_url = `${PROTO_URL}:${PROTO_PORT}`

