export function getUser() {
  if (
    typeof window ===
    'undefined'
  ) {
    return null
  }

  const user =
    localStorage.getItem(
      'user'
    )

  return user
    ? JSON.parse(user)
    : null
}

export function isAuthenticated() {
  return !!getUser()
}

export function redirectToLogin() {
  localStorage.removeItem('token')

  window.location.href = '/auth/login'
}