import adminDashboardService
  from '../services/adminDashboardService.js'

export function obtenerDashboardAdmin(
  req,
  res
) {

  const dashboard =
    adminDashboardService.obtenerDashboard()

  return res.json(
    dashboard
  )

}