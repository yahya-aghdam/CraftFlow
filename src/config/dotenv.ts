import dotenv from 'dotenv';
dotenv.config({ path: "src/config/.env" });

// Global
export const MAIN_URL = process.env.MAIN_URL as string;
export const PROTO_URL = process.env.PROTO_URL as string;
export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN as string;
export const API_PATH = process.env.API_PATH as string;
export const HTTP_PORT = process.env.HTTP_PORT as string;
export const PROTO_PORT = process.env.PROTO_PORT as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const SUCCESS_AUTH_REDIRECT_PATH = process.env.SUCCESS_AUTH_REDIRECT_PATH as string;

// Google
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
