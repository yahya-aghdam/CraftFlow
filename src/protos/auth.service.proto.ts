import jwt from 'jsonwebtoken';
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { DEV_MODE } from "../config/constants";
import { JWT_SECRET } from "../config/dotenv";
import { TokenRequest, TokenResult } from './auth';


export async function VerifyToken(
    call: ServerUnaryCall<TokenRequest, TokenResult>,
    callback: sendUnaryData<TokenResult>
) {
    const tokenRequest = call.request
    let tokenResult: TokenResult = {
        isVerified: false,
        data: {
            id: "",
            name: "",
            email: "",
            image: "",
            expires: "",
        }
    }

    if (tokenRequest.token != undefined) {

        try {
            jwt.verify(
                tokenRequest.token,
                JWT_SECRET,
                function (err: any, decoded: any) {

                    if (decoded) {

                        tokenResult = {
                            isVerified: true,
                            data: {
                                id: decoded.data.id,
                                name: decoded.data.name,
                                email: decoded.data.email,
                                image: decoded.data.image,
                                expires: decoded.data.expires,
                            }
                        }

                        if (tokenRequest.checkTime) {
                            if (new Date(decoded.data.expires) <= new Date(Date.now())) {
                                tokenResult = {
                                    isVerified: false,
                                    data: {
                                        id: "",
                                        name: "",
                                        email: "",
                                        image: "",
                                        expires: "",
                                    }
                                }
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

    callback(null, tokenResult)

}