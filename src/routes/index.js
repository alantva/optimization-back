import { Router } from 'express'
import measurementRouter from './measurement'
import optimizationRouter from './optimization'
import errorMiddleware from '../middlewares/error'

const router = Router()

router.use(measurementRouter)
router.use('/optimization', optimizationRouter)
router.use(errorMiddleware)

router.get('*', (req, res) => {
  res.json({ version: process.env.npm_package_version })
})

export default router
