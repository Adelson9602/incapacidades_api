import { Router } from 'express'
import * as putCtroler from '../controllers/put.controllers'
import { verifyToken } from '../middlewares'
const router = Router()

router.put('/update_state_disability/', verifyToken, putCtroler.putChangeStateDisability)

module.exports = router
