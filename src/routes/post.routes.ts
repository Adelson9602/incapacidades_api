import { Router } from 'express'
import { verifyToken } from '../middlewares'
import * as postCtroler from '../controllers/post.controllers'
import * as uploadCtroler from '../controllers/upload.controller'
import multer from '../helpers/uploaderFiles'
import {
  validateUser,
  validateTypeCp,
  validateCompany,
  validateDisabilityType,
  validatePerson,
  validatePosition,
  validateDisabilityState,
  validateDisability,
  validateDisabilityExtension,
  validateRol,
  validateTypeDocument,
  validateDeparment,
  validateCity,
  validateHistoricalDisability
} from '../validators/post.validators'

const router = Router()

router.post('/upload_file/:company/:folder', multer, uploadCtroler.uploadFile)

router.post('/user', validateUser, postCtroler.insertUser)

router.post('/company_type', verifyToken, validateTypeCp, postCtroler.createTypeCompany)

router.post('/company', verifyToken, validateCompany, postCtroler.createCompany)

router.post('/person', verifyToken, validatePerson, postCtroler.createPerson)

router.post('/position', verifyToken, validatePosition, postCtroler.createPosition)

router.post('/disability_type', verifyToken, validateDisabilityType, postCtroler.createDisabilityType)

router.post('/disability_state', verifyToken, validateDisabilityState, postCtroler.createStateInability)

router.post('/disability', verifyToken, validateDisability, postCtroler.createInability)

router.post('/disability_extension', verifyToken, validateDisabilityExtension, postCtroler.createDisabilityExtension)

router.post('/history_disability', verifyToken, validateHistoricalDisability, postCtroler.createHistoryInability)

router.post('/rol', verifyToken, validateRol, postCtroler.createRol)

router.post('/document_type', verifyToken, validateTypeDocument, postCtroler.createDucumentType)

router.post('/department', verifyToken, validateDeparment, postCtroler.createDepartament)

router.post('/city', verifyToken, validateCity, postCtroler.createCity)

router.post('/notification', verifyToken, postCtroler.createNotifications)

module.exports = router
