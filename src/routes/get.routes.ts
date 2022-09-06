import { Router } from 'express'
import * as getCtroler from '../controllers/get.controllers'
import { verifyToken } from '../middlewares'

const router = Router()

router.get('/menu', verifyToken, getCtroler.getMenu)

router.get('/rols', verifyToken, getCtroler.getRols)

router.get('/documents_type', verifyToken, getCtroler.getDocumentsType)

router.get('/users', verifyToken, getCtroler.getUsers)

module.exports = router
