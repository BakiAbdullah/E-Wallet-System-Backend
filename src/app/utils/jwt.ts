import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateJwtToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn || "1d",
  } as SignOptions);
  return token;
};

export const verifyJwtToken = (
  token: string,
  secret: string
): JwtPayload | null => {
  const verifiedToken = jwt.verify(token, secret) as JwtPayload;
  return verifiedToken;
};
