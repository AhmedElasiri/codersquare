import jwt from 'jsonwebtoken';

import { JwtObject } from './types';

export function signJwt(obj: JwtObject): string {
  return jwt.sign(obj, getJwtSecret(), { expiresIn: process.env.JWT_EXPIRES_IN });
}

// Throws on bad tokens
export function virifyJwt(token: string): JwtObject {
  return jwt.verify(token, getJwtSecret()) as JwtObject;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('Missing JWT secret');
    process.exit(1);
  }
  return secret;
}
