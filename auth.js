import jwt from "jsonwebtoken";

const SECRET = "thisismyuniqesecretkey";
const expiresIn = "4h";

export const createToken = (username) => {
  const token = jwt.sign({ username }, SECRET, { expiresIn });
  const _id = Date.now();
  return { token, username, _id };
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};

export const authentication = (next) => (root, args, context) => {
  if (verifyToken(context.token)) {
    next(root, args, context);
  } else {
    return new Error("Not authorized: Token Error!");
  }
};
