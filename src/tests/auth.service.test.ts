import AuthService from '../auth.service';
import { ExpiredToken, InvalidToken, UndefinedToken, ValidToken } from './constants';

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
    });

    it('should return true if the token is valid and not expired', async () => {
        const result = await authService.tokenVerify(ValidToken,true);
        expect(result).toBe(true);
    });

    it('should return false if the token is expired', async () => {
        const result = await authService.tokenVerify(ExpiredToken, true);
        expect(result).toBe(false);
    });

    it('should return false if the token is invalid', async () => {
        const result = await authService.tokenVerify(InvalidToken, true);
        expect(result).toBe(false);
    });

    it('should return false if token is undefined', async () => {
        const result = await authService.tokenVerify(UndefinedToken);
        expect(result).toBe(false);
    });
});