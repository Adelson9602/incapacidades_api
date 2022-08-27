import { Router } from 'express'
import * as putCtroler from '../controllers/put.controllers'
import { verifyToken } from '../middlewares'
const router = Router()

router.put('/update_spr_estados/', verifyToken, putCtroler.putSprEstado)

module.exports = router
