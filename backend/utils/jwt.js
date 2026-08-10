import jwt from 'jsonwebtoken'

const JWT_SECRET =
  process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET no ha sido configurado'
  )
}

export function generateToken(
  payload
) {

  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: '1d',
    }
  )

}

export function verifyToken(
  token
) {

  return jwt.verify(
    token,
    JWT_SECRET
  )

}