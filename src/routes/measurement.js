import { Router } from 'express'

const randNumber = () => parseInt(Math.random(10) * 100, 10)

const router = Router()

router.get('/measurement', async (req, res, next) => {
  await new Promise((resolve) => { setTimeout(() => resolve(), 250) })
  return res.send({ data: randNumber() })
})

router.get('/measurements', async (req, res, next) => {
  await new Promise((resolve) => { setTimeout(() => resolve(), 250) })
  return res.send(Array(30).fill(0).map(() => randNumber()))
})

export default router
