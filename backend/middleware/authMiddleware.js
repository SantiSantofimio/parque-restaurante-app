function authMiddleware(
  req,
  res,
  next
) {
  const userId =
    req.headers[
      'x-user-id'
    ]

  const userName =
    req.headers[
      'x-user-name'
    ]

  if (
    !userId ||
    !userName
  ) {
    return res
      .status(401)
      .json({
        error:
          'No autorizado',
      })
  }

  req.user = {
    id: Number(
      userId
    ),
    name:
      userName,
  }

  next()
}

export default
  authMiddleware