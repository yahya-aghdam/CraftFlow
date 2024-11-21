import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config/dotenv';
import { DEV_MODE, googleUrls, redirect_api_url } from './config/constants';
import { GetTokenRequestInputT, GetTokenRequestReturn} from './interface';

export default class AuthService {
    // AuthService handles authentication logic such as verifying tokens and fetching OAuth tokens

    // Verifies the validity of a JWT token
    async tokenVerify(token: string, checkTime: boolean = false): Promise<boolean> {
        let isVerified = false; // Initialize verification status as false

        if (token != undefined) {
            // Proceed only if the token is defined
            try {
                jwt.verify(
                    token, // The token to verify
                    JWT_SECRET, // Secret key for verifying the token
                    function (err: any, decoded: any) {
                        // Callback function executed after verification
                        if (decoded) {
                            // If decoding is successful
                            if (checkTime) {
                                // If checkTime is true, validate the expiration time
                                if (new Date(decoded.data.expires) > new Date(Date.now())) {
                                    isVerified = true; // Token is valid and not expired
                                }
                            } else {
                                isVerified = true; // Token is valid (no time check)
                            }
                        } else {
                            // If decoding fails, log the error in development mode
                            DEV_MODE && console.log(err);
                        }
                    },
                );
            } catch (err) {
                // Catch and log any unexpected errors during verification
                DEV_MODE && console.log(err);
            }
        } else {
            // Log a message if the token is undefined
            DEV_MODE && console.log(`Token is undefined`);
        }

        return isVerified; // Return the verification status
    }

    // Fetches tokens from Google's OAuth API using an authorization code
    async getTokenRequest({
        code, // Authorization code from Google's OAuth flow
        clientId, // Google OAuth client ID
        clientSecret, // Google OAuth client secret
    }: GetTokenRequestInputT): Promise<GetTokenRequestReturn> {
        try {
            // Prepare search parameters for the token request
            const searchParams = new URLSearchParams({
                code, // Authorization code received
                client_id: clientId, // OAuth client ID
                client_secret: clientSecret, // OAuth client secret
                redirect_uri: redirect_api_url, // Redirect URI used during authorization
                grant_type: 'authorization_code', // Grant type for the token exchange
            });

            // Make a POST request to Google's token endpoint
            const res = await fetch(googleUrls.tokenUrl, {
                method: 'POST', // Use POST to send the request
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Set the content type for URL-encoded data
                },
                body: searchParams.toString(), // Attach the search parameters as the request body
            });

            const gRes = await res.json(); // Parse the response as JSON
            return gRes; // Return the parsed response
        } catch (error: any) {
            // Handle and log errors during the token request process
            console.error('Failed to fetch auth tokens');
            throw new Error(error.message); // Throw an error to indicate failure
        }
    }
}

