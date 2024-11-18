import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config/dotenv';
import { DEV_MODE, googleUrls, redirect_api_url } from './config/constants';
import { GetTokenRequestInputT, GetTokenRequestReturn} from './interface';


export default class AuthService {

    async tokenVerify(token: string, checkTime: boolean = false,): Promise<boolean> {
        let isVerified = false

        if (token != undefined) {

            try {
                jwt.verify(
                    token,
                    JWT_SECRET,
                    function (err: any, decoded: any) {
                        if (decoded) {
                            if (checkTime) {
                                isVerified = true;
                                if (new Date(decoded.data.expires) <= new Date(Date.now())) {
                                    isVerified = false;
                                }
                            }
                        } else {
                            DEV_MODE && console.log(err);
                        }
                    },
                );
            } catch (err) {
                DEV_MODE && console.log(err);
            }

        } else {
            DEV_MODE && console.log(`Token is undefined`);
        }

        return isVerified
    }

    async getTokenRequest({
        code,
        clientId,
        clientSecret,
    }: GetTokenRequestInputT): Promise<GetTokenRequestReturn> {
        try {
            const searchParams = new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirect_api_url,
                grant_type: 'authorization_code',
            });

            const res = await fetch(googleUrls.tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: searchParams.toString(),
            });

            const gRes = await res.json()
            return gRes;
        } catch (error: any) {
            console.error('Failed to fetch auth tokens');
            throw new Error(error.message);
        }

    }



    async test(data: any) {

        return data;
    };
}


