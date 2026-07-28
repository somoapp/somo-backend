import { Router } from 'express'
import { getAllRoutes, getRouteById } from '../controllers/routesController.js'

const router = Router()

router.get('/', getAllRoutes)
router.get('/:id', getRouteById)

export default router