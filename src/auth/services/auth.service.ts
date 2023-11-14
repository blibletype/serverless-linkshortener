import {sign, verify} from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  email: string;
}

export class AuthService {
  signAccessToken(payload: TokenPayload): string | null {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) return null;
    return sign(payload, secret, { expiresIn: '60m' });
  }

  signRefreshToken(payload: TokenPayload): string | null {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) return null;
    return sign(payload, secret, {});
  }

  verifyAccessToken(accessToken: string): TokenPayload | null {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) return null;
      return verify(accessToken, secret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(refreshToken: string): TokenPayload | null {
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) return null;
      return verify(refreshToken, secret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}