import { Router } from 'express'
import * as authCtroler from '../controllers/auth.controllers'
// import { verifyToken } from '../middlewares'
import { validateAuth } from '../validators/auth.validators'

const router = Router()

router.post('/login', validateAuth, authCtroler.postLogin)

module.exports = router
