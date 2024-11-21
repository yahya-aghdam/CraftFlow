import { cookieDeleter, cookieMaker, getCookies } from "../util";
import { Request, Response } from "express";


describe('getCookies', () => {
    it('should return undefined if there are no cookies', () => {
        const req = { headers: {} } as Request; // Mock request without cookies
        const result = getCookies(req);
        expect(result).toBeUndefined();
    });

    it('should return an object with parsed cookies', () => {
        const req = { headers: { cookie: 'name=John; age=30' } } as Request; // Mock request with cookies
        const result = getCookies(req);
        expect(result).toEqual({ name: 'John', age: '30' });
    });

    it('should handle cookies with spaces around them', () => {
        const req = { headers: { cookie: ' name=John ; age = 30 ' } } as Request; // Mock request with extra spaces
        const result = getCookies(req);
        expect(result).toEqual({ name: 'John', age: '30' });
    });
});

describe('cookieMaker', () => {
    it('should set a cookie in the response', () => {
        const res = {
            cookie: jest.fn(),
        } as unknown as Response;  // Type assertion to Response

        const cookie = { name: 'testCookie', data: 'cookieData', options: { httpOnly: true } };

        cookieMaker(res, cookie);

        // Assert the cookie method was called with the correct arguments
        expect(res.cookie).toHaveBeenCalledWith(cookie.name, cookie.data, cookie.options);
    });
});

describe('cookieDeleter', () => {
    it('should delete the specified cookie', () => {
        const res = {
            cookie: jest.fn(),
        } as unknown as Response;  // Type assertion to Response

        const cookieName = 'testCookie';

        cookieDeleter(res, cookieName);

        // Assert the cookie method was called with correct parameters to delete the cookie
        expect(res.cookie).toHaveBeenCalledWith(cookieName, '', { maxAge: 0 });
    });
});