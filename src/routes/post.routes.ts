import { Router } from 'express'
import * as postCtroler from '../controllers/post.controllers'
import * as uploadCtroler from '../controllers/upload.controller'
import multer from '../libs/uploadFile'
import { validateAfiliacion, validateEntidad, validateUser } from '../validators/post.validators'

const router = Router()

router.post('/upload_file/', multer.single('file'), uploadCtroler.uploadFile)

router.post('/insert_user/', validateUser, postCtroler.insertUser)

router.post('/create_membership', validateAfiliacion, postCtroler.insertAfiliacion)

router.post('/create_entidad', validateEntidad, postCtroler.createEntidad)

module.exports = router
