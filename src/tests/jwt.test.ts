import jwt from 'jsonwebtoken';
import { tokenMaker } from '../util';
import { JWT_SECRET } from '../config/dotenv';
import { TokenData, ValidToken } from './constants';

jest.mock('jsonwebtoken');

describe('tokenMaker', () => {
    it('should generate a valid token', () => {
        const mockToken = ValidToken;
        const mockData = TokenData;

        // Mock jwt.sign method
        (jwt.sign as jest.Mock).mockReturnValue(mockToken);

        const result = tokenMaker(mockData);

        expect(result).toBe(mockToken);
        expect(jwt.sign).toHaveBeenCalledWith(
            { data: mockData },
            JWT_SECRET
        );
    });
});