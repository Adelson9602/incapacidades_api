import { Router } from 'express'
import * as getCtroler from '../controllers/get.controllers'
// import { verifyToken } from '../middlewares'

const router = Router()

router.get('/get_menu', getCtroler.getMenu)

module.exports = router
