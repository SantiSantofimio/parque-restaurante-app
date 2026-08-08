import dashboardService
  from '../services/dashboardService.js'

export function obtenerDashboard(
  req,
  res
) {

  const dashboard =
    dashboardService.obtenerDashboard(
      req.user.id
    )

  return res.json(
    dashboard
  )

}