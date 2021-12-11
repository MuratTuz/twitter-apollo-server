import jwt from "jsonwebtoken";

const SECRET = "thisismyuniqesecretkey";
const expiresIn = "4h";

export const createToken = (email) => {
  const token = jwt.sign({ email }, SECRET, { expiresIn });
  const _id = Date.now();
  return { token, email, _id };
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};

export const authentication = (next) => (root, args, context) => {
  if (verifyToken(token)) {
    next(root, args, context);
  } else {
    return new Error("Not authorized: Token Error!");
  }
};
