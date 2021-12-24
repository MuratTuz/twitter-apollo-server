import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server";

const SECRET = "thisismyuniqesecretkey";
const expiresIn = "4h";

export const createToken = (username) => {
  const token = jwt.sign({ username }, SECRET, { expiresIn });
  //const _id = Date.now();
  //console.log("token", token);
  return { token };
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};

export const authentication = (next) => (parent, args, context) => {
  const token = context.token.split(" "); // Bearer jwt_token
  if (verifyToken(token[1])) {
    next(parent, args, context);
  } else {
    return new AuthenticationError("Authentication Error: No Token");
  }
};
