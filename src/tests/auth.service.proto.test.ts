import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { TokenRequest, TokenResult } from '../protos/auth';
import {verifyToken} from "../protos/auth.service.proto"
import { ExpiredToken, InvalidToken, ValidToken } from './constants';



describe('verifyToken', () => {
    

    it('should return isVerified true for a valid token', (done) => {
        const mockCall = {
            request: {
                token: ValidToken,
                checkTime: true,
            },
        } as ServerUnaryCall<TokenRequest, TokenResult>;

        const mockCallback: sendUnaryData<TokenResult> = (error, response) => {
            expect(response?.isVerified).toBe(true);
            done();
        };

        verifyToken(mockCall, mockCallback);
    },30000);

    it('should return isVerified false for an expired token', (done) => {
        const mockCall = {
            request: {
                token: ExpiredToken,
                checkTime: true,
            },
        } as ServerUnaryCall<TokenRequest, TokenResult>;

        const mockCallback: sendUnaryData<TokenResult> = (error, response) => {
            expect(response?.isVerified).toBe(false);
            done();
        };

        verifyToken(mockCall, mockCallback);
    }, 30000);

    it('should return isVerified false for an invalid token', (done) => {
        const mockCall = {
            request: {
                token: InvalidToken,
                checkTime: false,
            },
        } as ServerUnaryCall<TokenRequest, TokenResult>;

        const mockCallback: sendUnaryData<TokenResult> = (error, response) => {
            expect(response?.isVerified).toBe(false);
            done();
        };

        verifyToken(mockCall, mockCallback);
    }, 30000);

   
});

