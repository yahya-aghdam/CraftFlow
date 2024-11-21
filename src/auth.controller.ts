import { Request, Response } from 'express';
import { cookieDeleter, cookieMaker, expireTimeMaker, getCookies, googleURLMaker, tokenMaker } from './util';
import { authCooieOptions, authCookieName, DEV_MODE, expireAfterDays, googleUrls } from './config/constants';
import AuthService from './auth.service';
import { TokenT } from './interface';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SUCCESS_AUTH_REDIRECT_PATH } from './config/dotenv';


export default class AuthController {
    // A class to handle authentication-related logic

    private authService: AuthService; // Private instance of the AuthService

    constructor() {
        this.authService = new AuthService(); // Initialize the AuthService
    }

    // Handles user registration and login
    public async register_login(req: Request, res: Response) {
        const gAuth = getCookies(req)?.[authCookieName]; // Retrieve the authentication cookie from the request

        if (gAuth) {
            // If the authentication cookie exists, verify the token
            const tokenVerification: boolean = await this.authService.tokenVerify(gAuth, true);

            if (tokenVerification) {
                // If the token is valid, redirect to the success path
                res.redirect(SUCCESS_AUTH_REDIRECT_PATH);
            } else {
                // If the token is invalid, delete the cookie and redirect to the Google authentication URL
                cookieDeleter(res, authCookieName);
                res.redirect(googleURLMaker());
            }
        } else {
            // If no authentication cookie exists, redirect to the Google authentication URL
            res.redirect(googleURLMaker());
        }
    }

    // Handles Google authentication
    public async google(req: Request, res: Response) {
        // Get tokens (id_token and access_token) from the Google OAuth server using the authorization code
        const { id_token, access_token } = await this.authService.getTokenRequest({
            code: req.query.code as string, // The authorization code from the request query
            clientId: GOOGLE_CLIENT_ID, // Google OAuth client ID
            clientSecret: GOOGLE_CLIENT_SECRET, // Google OAuth client secret
        });

        let decodedToken: TokenT; // Placeholder for the decoded user token

        // Fetch additional user information using the access token
        await fetch(googleUrls.AccessTokenURL + access_token, {
            headers: {
                Authorization: `Bearer ${id_token}`, // Use id_token as Bearer token for authorization
            },
        })
            .then(async (gRes) => {
                const user = await gRes.json(); // Parse the user data from the response

                const expires = expireTimeMaker(expireAfterDays); // Calculate the token's expiration time

                // Create a decoded token object with the user's data
                decodedToken = {
                    id: user.id, // User ID
                    name: user.name, // User's name
                    picture: user.picture, // User's profile picture
                    email: user.email, // User's email address
                    expires, // Expiration time
                };

                const token = tokenMaker(decodedToken); // Create a token from the decoded user data
                const options = authCooieOptions; // Retrieve cookie options (e.g., secure, httpOnly)
                options.expires = expires; // Set cookie expiration

                // Save the token in a cookie
                cookieMaker(res, {
                    name: authCookieName, // Name of the authentication cookie
                    data: token, // Token data
                    options, // Cookie options
                });

                // Redirect the user to the success path after successful authentication
                res.redirect(SUCCESS_AUTH_REDIRECT_PATH);
            })
            .catch((error) => {
                // Handle errors during the fetch operation
                DEV_MODE && console.error('Failed to fetch access api: ', error.message);
            });
    }

    // Response for successful authentication
    public async successfulAuth(req: Request, res: Response) {
        // Send a JSON response indicating the token is saved in cookies
        res.status(400).json({ message: 'Token saved successfuly as "g_auth" in cookies.' });
    }
}
