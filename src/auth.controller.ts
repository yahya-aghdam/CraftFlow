import { Request, Response } from 'express';
import { cookieDeleter, cookieMaker, expireTimeMaker, getCookies, googleURLMaker, tokenMaker } from './util';
import { authCooieOptions, authCookieName, DEV_MODE, expireAfterDays, googleUrls } from './config/constants';
import AuthService from './auth.service';
import { TokenT } from './interface';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SUCCESS_AUTH_REDIRECT_PATH } from './config/dotenv';

export default class AuthController {

    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }


    public async register_login(req: Request, res: Response) {
        const gAuth = getCookies(req)?.[authCookieName]

        if (gAuth) {
            const tokenVerification: boolean = await this.authService.tokenVerify(gAuth, true)

            if (tokenVerification) {
                res.redirect(SUCCESS_AUTH_REDIRECT_PATH)
            } else {
                cookieDeleter(res, authCookieName)
                res.redirect(googleURLMaker())
            }
        } else {
            res.redirect(googleURLMaker())
        }

    };


    public async google(req: Request, res: Response) {
        const { id_token, access_token } = await this.authService.getTokenRequest({
            code: req.query.code as string,
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        });

        let decodedToken: TokenT;

        await fetch(googleUrls.AccessTokenURL + access_token, {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        })
            .then(async (gRes) => {
                const user = await gRes.json();
                const expires = expireTimeMaker(expireAfterDays)
                decodedToken = {
                    id: user.id ,
                    name: user.name,
                    picture: user.picture ,
                    email: user.email,
                    expires
                };

                const token = tokenMaker(decodedToken)
                const options = authCooieOptions
                options.expires = expires

                cookieMaker(res, {
                    name: authCookieName,
                    data: token,
                    options
                })

                //   Redirect user
                res.redirect(SUCCESS_AUTH_REDIRECT_PATH);
            })
            .catch((error) => {
                DEV_MODE && console.error('Failed to fetch access api: ', error.message);
            });

    };


    public async successfulAuth(req: Request, res: Response) {
        res.status(400).json({ message: 'Token saved successfuly as "g_auth" in cookies.' });
    };

}
