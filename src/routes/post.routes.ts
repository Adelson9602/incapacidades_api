import { Router } from 'express'
import { verifyToken } from '../middlewares'
import * as postCtroler from '../controllers/post.controllers'
import * as uploadCtroler from '../controllers/upload.controller'
import multer from '../libs/uploadFile'
import {
  validateUser,
  validateTypeCp,
  validateCompany,
  validateDisabilityType,
  validatePerson,
  validatePosition
} from '../validators/post.validators'

const router = Router()

router.post('/upload_file/', multer.single('file'), uploadCtroler.uploadFile)

router.post('/user', validateUser, postCtroler.insertUser)

router.post('/company_type', verifyToken, validateTypeCp, postCtroler.createTypeCompany)

router.post('/company', verifyToken, validateCompany, postCtroler.createCompany)

router.post('/person', verifyToken, validatePerson, postCtroler.createPerson)

router.post('/position', verifyToken, validatePosition, postCtroler.createPosition)

router.post('/disability_type', verifyToken, validateDisabilityType, postCtroler.createDisabilityType)

module.exports = router
