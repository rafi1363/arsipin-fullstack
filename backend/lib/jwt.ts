import jwt from "jsonwebtoken";

export type JwtPayload = {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
}

export function generateToken(payload: Omit<JwtPayload, "iat" | "exp">) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}
