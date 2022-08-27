import { Router } from 'express'
import * as deleteCtroler from '../controllers/delete.controllers'
import { verifyToken } from '../middlewares'
const router = Router()

router.delete('/delete_file/:company/:folder/:file_name', verifyToken, deleteCtroler.deleteFile)

module.exports = router
