import { sign, verify } from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  email: string;
}

export class AuthService {
  signAccessToken(payload: TokenPayload) {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (secret) return sign(payload, secret, { expiresIn: '60m' });
  }

  signRefreshToken(payload: TokenPayload) {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (secret) return sign(payload, secret, {});
  }

  validateAccessToken(accessToken: string) {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;
      if (secret) return verify(accessToken, secret);
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      if (secret) return verify(refreshToken, secret);
    } catch (error) {
      return null;
    }
  }
}