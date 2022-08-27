import { User } from '../interfaces/auth.models'

export const scriptInfoAfiliacion = (byIdEps?: boolean, byIdMember?: boolean): string => {
  return `SELECT
  afiliacion.id AS idAfiliacion,
  idusuario AS idUsuarioRadica,
  (SELECT identificacion FROM persona WHERE persona.id = afiliacion.idusuario) AS usuarioRadica,
  idtipofiliado AS idTipoAfiliado,
  idafpactiva AS idAfp,
  idarlactica AS idArl,
  afiliacion.idpersona AS idPersona,
  idtipoafiliacion AS idTipoAfiliacion,
  tipoafiliacion.nombre AS nombreTipoAfiliacion,
  idips AS idIps,
  afiliacion.estado AS estadoAfiliacion,
  DATE_FORMAT(afiliacion.fecharegistro, "%Y-%m-%d") AS fechaRegistroAfiliacion,
  epsanterior AS epsAnteriorCotizante,
  afiliacion.codigo,
  DATE_FORMAT(fecha_retiro, "%Y-%m-%d") AS fechaRetiro,
  persona.id AS idPersona,
  persona.idtipodocumento AS idTipoDocumentoCotizante,
  persona.identificacion AS identificacionCotizante,
  persona.primernombre AS primerNombreCotizante,
  persona.segundonombre AS segundoNombreCotizante,
  persona.primerapellido AS primerApellidoCotizante,
  persona.segundoapellido AS segundoApellidoCotizante,
  persona.fechanacimiento AS fechaNacimientoCotizante,
  persona.salario AS salarioCotizante,
  persona.sexo AS sexoCotizante,
  contacto.correo AS correoCotizante,
  contacto.celular AS celularCotizante,
  contacto.direccion AS direccionCotizante,
  contacto.idciudad AS idCiudadCotizante,
  contacto.localidad_comuna AS localidadComuna,
  contacto.zona AS zonaCotizante,
  ciudad.iddepartamento AS idDepartamentoCotizante,
  ciudad.id AS idCiudadCotizante,
  vinculacion.idempresa AS idEmpresaCotizante,
  tipo_documento.nombre AS nombreTipoDocumentoCotizante,
  arl.nombre AS nombreArl,
  afp.nombre AS nombreAfp,
  departamento.nombre AS nombreDepartamentoCotizante,
  ips.nombre AS nombreIps,
  empresa.nombre AS nombreEmpresa,
  (SELECT nombre FROM tipo_documento WHERE tipo_documento.id = empresa.idtipodocumento) AS nombreTipoDocumentoEmpresa,
  ciudad.nombre AS nombreCiudadCotizante,
  IF(ips.ideps = 1, ciudad.codigo_sanitas, ciudad.codigo_compensar) AS codigoCiudadCotizante,
  IF(ips.ideps = 1, departamento.codigo_sanitas, departamento.codigo_compensar) AS codigoDepartamentoCotizante,
  empresa.identificacion AS identificacionEmpresa,
  empresa.direccion AS direccionEmpresa,
  empresa.telefono AS telefonoEmpresa,
  empresa.correo AS correoEmpresa,
  (SELECT nombre FROM ciudad WHERE ciudad.id = empresa.idciudad) AS nombreCiudadEmpresa,
  (SELECT nombre FROM departamento WHERE departamento.id = (SELECT iddepartamento FROM ciudad WHERE ciudad.id = empresa.idciudad)) AS nombreDepartamentoEmpresa
  FROM afiliacion
  INNER JOIN ips ON ips.id = afiliacion.idips
  INNER JOIN persona ON persona.id = afiliacion.idpersona
  INNER JOIN contacto ON contacto.idpersona = persona.id
  INNER JOIN tipoafiliacion ON tipoafiliacion.id = afiliacion.idtipoafiliacion
  INNER JOIN ciudad ON ciudad.id = contacto.idciudad
  INNER JOIN departamento ON departamento.id = ciudad.iddepartamento
  LEFT JOIN vinculacion ON vinculacion.idpersona = persona.id
  INNER JOIN tipo_documento ON tipo_documento.id = persona.idtipodocumento
  INNER JOIN arl ON arl.id = afiliacion.idarlactica
  INNER JOIN afp ON afp.id = afiliacion.idafpactiva
  LEFT JOIN empresa ON empresa.id = vinculacion.idempresa
  ${byIdEps ? 'WHERE ips.ideps = ?' : byIdMember ? 'WHERE afiliacion.id = ?' : ''}`
}

export const scriptBeneficiario = () => {
  return `SELECT
    persona.id AS idPersona,
    idtipodocumento AS idTipoDocumentoBeneficiario,
    identificacion AS identificacionBeneficiario,
    primernombre AS primerNombreBeneficiario,
    segundonombre AS segundoNombreBeneficiario,
    primerapellido AS primerApellidoBeneficiario,
    segundoapellido AS segundoApellidoBeneficiario,
    fechanacimiento AS fechaNacimientoBeneficiario,
    sexo AS sexoBeneficiario,
    beneficiario.idparentezco AS idParentezcoBeneficiario,
    tipo_documento.nombre AS nombreTipoDocumentoBneficiario,
    parentezco.nombre AS nombreParentezco
  FROM persona
  INNER JOIN beneficiario ON beneficiario.idpersona = persona.id
  INNER JOIN tipo_documento ON tipo_documento.id = persona.idtipodocumento
  INNER JOIN parentezco ON parentezco.id = beneficiario.idparentezco
  WHERE beneficiario.idafiliacion = ?`
}

export const scriptGetUser = (isLogin: boolean, usuario?:User) => `SELECT 
  usuario.id AS idUsuario,
  persona.id AS idPersona,
  idtipodocumento AS idTipoDocumento,
  identificacion,
  primernombre AS primerNombre,
  segundonombre AS segundoNombre,
  primerapellido AS primerApellido,
  segundoapellido AS segundoApellido,
  fechanacimiento AS fechaNacimiento,
  sexo,
  usuario,
  password,
  estado,
  usuario.idprivilegios AS idPrivilegios,
  documentoPersona,
  correo,
  celular,
  zona,
  direccion,
  idciudad AS idCiudad,
  privilegios.nombre AS nombrePrivilegio,
  privilegios.id AS idPrivilegios,
  ciudad.iddepartamento AS idDepartamento,
  tipo_documento.nombre AS tipoDocumento
FROM usuario
  INNER JOIN persona ON persona.identificacion = usuario.documentoPersona
  INNER JOIN tipo_documento ON tipo_documento.id = persona.idtipodocumento
  LEFT JOIN contacto ON contacto.idpersona = persona.id
  INNER JOIN privilegios ON privilegios.id = usuario.idprivilegios
  LEFT JOIN ciudad ON ciudad.id = contacto.idciudad 
${isLogin ? `WHERE usuario = ${usuario?.usuario}` : ''}`

export const scriptGetIps = (idEps?: string): string => `SELECT id, ideps As idEps, idciudad AS idCiudad, nombre, identificacion, DATE_FORMAT(fecharegistro, "%Y-%m-%d") AS fechaRegistro, estado, direccion, telefono FROM ips ${idEps ? `WHERE ideps = ${idEps}` : ''}`

export const scriptGetDepartamento = (): string => 'SELECT id AS value, nombre AS label FROM departamento'

export const scriptGetCiudad = (): string => 'SELECT id AS value, nombre AS label, iddepartamento AS idDepartamento FROM ciudad'

export const scriptGetTipoDoc = (): string => 'SELECT id AS value, nombre AS label FROM tipo_documento'

export const scriptGetTipoAfiliado = (): string => 'SELECT id AS value, nombre AS label FROM tipo_cotizante'

export const scriptGetParentezco = (): string => 'SELECT id AS value, nombre AS label FROM parentezco'

export const scriptGetTipoAfiliacion = (): string => 'SELECT id AS value, nombre AS label FROM tipoafiliacion'

export const scriptVerifyPerson = (identificacion: string) => `SELECT COUNT(identificacion) AS cantidadPersonas FROM persona WHERE identificacion = ${identificacion}`

export const scriptGetPrivilegios = () => 'SELECT id AS value, nombre AS label FROM privilegios'

export const scriptGetEntidad = (tipoEntidad: string) => `SELECT id, idtipodocumento AS idTipoDocumento, nombre, identificacion, DATE_FORMAT(fecharegistro, "%Y-%m-%d") AS fechaRegistro, estado, telefono, idciudad AS idCiudad, correo, direccion, localidad ${tipoEntidad === 'ips' ? ', ideps AS idEps' : ''} FROM ${tipoEntidad}`
