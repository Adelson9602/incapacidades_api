import { Router } from 'express'
import * as getCtroler from '../controllers/get.controllers'
import { verifyToken } from '../middlewares'

const router = Router()

// router.get('/menu', verifyToken, getCtroler.getMenu)

router.get('/rols', verifyToken, getCtroler.getRols)

router.get('/documents_type', verifyToken, getCtroler.getDocumentsType)

router.get('/users', verifyToken, getCtroler.getUsers)

router.get('/company', verifyToken, getCtroler.getCompanies)

router.get('/company/:nit', verifyToken, getCtroler.getCompanies)

router.get('/person', verifyToken, getCtroler.getPerson)

router.get('/department', verifyToken, getCtroler.getDeparments)

router.get('/city', verifyToken, getCtroler.getCities)

router.get('/department_and_city', verifyToken, getCtroler.getDepartemtAndCity)

router.get('/disability_state', verifyToken, getCtroler.getStateDisability)

router.get('/disability', verifyToken, getCtroler.getDisabilities)

router.get('/history_disability', verifyToken, getCtroler.getHistoryDisabilities)

router.get('/history_disability/:idRadicado', verifyToken, getCtroler.getHistoryDisabilities)

module.exports = router
