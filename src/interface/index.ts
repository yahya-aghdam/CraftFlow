import { CookieOptions } from "express"

export interface ProviderURLT {
    mainUrl: string;
    scope: string;
    tokenUrl: string;
    AcessAPI?: string;
    AcessAPIEmail?: string;
    AccessTokenURL: string;
}

export interface TokenT {
    id: string
    name: string
    email: string
    image: string
    expires: Date
}

export interface CookieT {
    name: string
    data?: any
    options: CookieOptions
}


export interface GetTokenRequestInputT {
    code: string;
    clientId: string;
    clientSecret: string;
}

export interface GetTokenRequestReturn {
    access_token: string;
    token_type: string;
    scope: string;
    expires?: Number;
    refresh_token?: string;
    id_token?: string;
}



