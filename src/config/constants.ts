import linksmith from "linksmith";
import { ProviderURLT } from "../interface";
import { MAIN_URL, HTTP_PORT, COOKIE_DOMAIN, PROTO_PORT, PROTO_URL } from "./dotenv";
import { CookieOptions } from "express";

// You can see logs if it is true
export const DEV_MODE = true;

// Cookie name
export const authCookieName = "gAuth"

// Cookie options
export const authCooieOptions: CookieOptions = {
    domain: COOKIE_DOMAIN,
    path: "/",
    httpOnly: true,
    priority: "high",
    secure: true,
}

// Expire cookie time
export const expireAfterDays = 30

// Google query and url. You can pass scoops to googleURLMaker() function if you dont want default scoops.
export const googleUrls: ProviderURLT = {
    mainUrl: 'https://accounts.google.com/o/oauth2/v2/auth?',
    scope:
        'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    AccessTokenURL:
        'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=',
};

// Dont change these
export const redirect_api_url = linksmith(MAIN_URL, { port: HTTP_PORT, paths: ["api", "g_auth", "google"] })
export const proto_url = `${PROTO_URL}:${PROTO_PORT}`

