import jwt from 'jsonwebtoken';

export default function tokenGenerator(userId, email, secretKey, expiresIn) {
  const token = jwt.sign({ userId, email }, secretKey, { expiresIn });

  return token;
}
