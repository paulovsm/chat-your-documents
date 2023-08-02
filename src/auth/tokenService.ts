import nookies from 'nookies';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY';
const ACCESSTOKEN_SECRET = process.env.NEXT_PUBLIC_ACCESSTOKEN_SECRET;
const ACCESSTOKEN_EXPIRATION = '1h';

const ONE_SECOND = 1;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_YEAR = ONE_DAY * 365;

export const tokenService = {
    async save(userId: number, ctx = null) {
        const accessToken = await this.generateAccessToken(userId);

        nookies.set(ctx, ACCESS_TOKEN_KEY, accessToken, {
            maxAge: ONE_YEAR,
            path: '/',
        });
    },
    get(ctx = null) {
        const cookies = nookies.get(ctx);
        return cookies[ACCESS_TOKEN_KEY] || '';
    },
    delete(ctx = null) {
        nookies.destroy(ctx, ACCESS_TOKEN_KEY);
    },
    async generateAccessToken(userId: number) {
        return await jwt.sign(
            { roles: ['user'] },
            ACCESSTOKEN_SECRET,
            { subject: String(userId), expiresIn: ACCESSTOKEN_EXPIRATION }
        );
    },
    async decodeToken(token: string) {
        return await jwt.decode(token);
    }
}