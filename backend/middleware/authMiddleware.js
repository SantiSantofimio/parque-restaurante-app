function authMiddleware(
  req,
  res,
  next
) {
  const res =
  await fetch(
    API_URL,
    {
      headers: {
        'x-user-id':
          String(user?.id),
        'x-user-name':
          user?.name ?? '',
      },
    }
  )

  const { userId, userName } = await res.json()

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