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

router.get('/employe', verifyToken, getCtroler.getPerson)

router.get('/department', verifyToken, getCtroler.getDeparments)

router.get('/city', verifyToken, getCtroler.getCities)

router.get('/department_and_city', verifyToken, getCtroler.getDepartemtAndCity)

router.get('/disability_state', verifyToken, getCtroler.getStateDisability)

router.get('/disability', verifyToken, getCtroler.getDisabilities)

router.get('/disability_delete', verifyToken, getCtroler.getDisabilitiesDelete)

router.get('/disability_by_id/:idIncapacidad', verifyToken, getCtroler.getDisabilityById)

router.get('/disability_extension', verifyToken, getCtroler.getHistoryDisabilities)

router.get('/disability_extension/:idRadicado', verifyToken, getCtroler.getHistoryDisabilities)

router.get('/position', verifyToken, getCtroler.getPosition)

router.get('/company_type', verifyToken, getCtroler.getCompanyType)

router.get('/company_by_type/:idTipo', verifyToken, getCtroler.getCompanyByType)

router.get('/employe_select', verifyToken, getCtroler.getEmployesSelect)

router.get('/disability_type', verifyToken, getCtroler.getDisabilityType)

router.get('/dashboard', verifyToken, getCtroler.getDataDashboard)

router.get('/last_disabilities', verifyToken, getCtroler.getLatestDisabilities)

router.get('/salary', verifyToken, getCtroler.getSalary)

router.get('/cie', verifyToken, getCtroler.getCie)

router.get('/permissions/:usuario', verifyToken, getCtroler.getPermissions)

router.get('/permissions_rol/:rol', verifyToken, getCtroler.getPermissionsByRol)

router.get('/excel_report/:reportType', getCtroler.getExcelReport)

router.get('/documents_attach_by_disability_type/:disabilityType', verifyToken, getCtroler.getDocumentsAttachByDisabilityType)

module.exports = router
