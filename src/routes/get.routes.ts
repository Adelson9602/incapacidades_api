import { Router } from 'express'
import * as getCtroler from '../controllers/get.controllers'
// import { verifyToken } from '../middlewares'

const router = Router()

router.get('/get_menu', getCtroler.getMenu)

router.get('/get_users', getCtroler.getUsers)

router.get('/get_ips_by_eps/:idEps', getCtroler.getIps)

router.get('/get_entidad/:tipoEntidad', getCtroler.getEntidad)

router.get('/get_memberships_by_eps/:idEps', getCtroler.getMembershipsByEps)

router.get('/get_memberships_by_id/:idAfiliacion', getCtroler.getMembershipsById)

router.get('/get_departamento', getCtroler.getDepartamentos)

router.get('/get_tipo_documento', getCtroler.getTipoDocumento)

router.get('/get_parentezco', getCtroler.getParentezco)

router.get('/get_tipo_afiliado', getCtroler.getTipoAfiliado)

router.get('/get_tipo_afiliacion', getCtroler.getTipoAfiliacion)

router.get('/verify_identity/:identificacion', getCtroler.verifyPerson)

router.get('/get_privilegios', getCtroler.getPrivilegios)

module.exports = router
