export const scriptDocumentsType = (base: string):string => {
  return `SELECT * FROM ${base}.tipoDocumento;`
}

export const scriptRols = (base: string):string => {
  return `SELECT * FROM ${base}.roles;`
}

export const scriptPositions = (base: string):string => {
  return `SELECT * FROM ${base}.cargo;`
}

export const scriptCompanyType = (base: string):string => {
  return `SELECT * FROM ${base}.tipoEmpresa;`
}

export const scriptUsers = (base: string):string => {
  return `SELECT *, fotoPerfil AS avatar, pe.permisos, un.email, un.idUsuarioNotificar, un.estado AS isNotified FROM ${base}.usuarios u JOIN ${base}.personas p ON p.documentoPersona = u.usuario JOIN ${base}.permisosUsuario pe ON pe.usuario = u.usuario LEFT JOIN ${base}.usuariosNotificar un ON un.usuario = u.usuario;`
}

export const scriptValidateTpCompany = (nombreTipoEmpresa: string, base: string):string => {
  return `SELECT * FROM ${base}.tipoEmpresa WHERE nombreTipoEmpresa = '${nombreTipoEmpresa}';`
}

export const scriptValidatePosition = (nombreCargo: string, base: string):string => {
  return `SELECT * FROM ${base}.cargo WHERE nombreCargo = '${nombreCargo}';`
}

export const scriptCompanies = (base: string, condition?: string):string => {
  return `SELECT
    nit,
    razonSocial,
    fkIdTipoEmpresa,
    nombreTipoEmpresa,
    fkNit,
    idContacto,
    fkidContacto,
    direccion,
    barrio,
    correo,
    celular,
    telefonoFijo,
    fkIdCiudad,
    nombreCiudad,
    fkIdDepartamento,
    nombreDepartamento
  FROM ${base}.empresa e 
    INNER JOIN ${base}.tipoEmpresa te ON e.fkIdTipoEmpresa = te.idTipoEmpresa
    INNER JOIN ${base}.contactoEmpresa ce ON ce.fkNit = e.nit
    INNER JOIN ${base}.contacto co ON co.idContacto = ce.fkidContacto
    INNER JOIN ${base}.ciudad ci ON ci.idCiudad = co.fkIdCiudad
    INNER JOIN ${base}.departamento de ON de.idDepartamento = ci.fkIdDepartamento
  ${condition || ''};`
}

// Obtiene los datos de un empleado o todos los empleados
export const scriptGetPerson = (base: string, documentoPersona?: number):string => {
  return `SELECT 
    p.documentoPersona,
    p.primerNombre,
    p.segundoNombre,
    p.primerApellido,
    p.segundoApellido,
    p.genero,
    p.fechaNacimiento,
    p.fkIdTipoDocumento,
    c.fkIdContacto,
    c.fkDocumentoPersona,
    co.idContacto,
    co.direccion,
    co.barrio,
    co.correo,
    co.celular,
    co.telefonoFijo,
    co.fkIdCiudad,
    ci.nombreCiudad,
    ci.fkIdDepartamento,
    de.nombreDepartamento,
    em.fkIdCargo,
    em.fkIdEmpresa,
    emp.razonSocial,
    ca.nombreCargo,
    td.nombreTipoDocumento
  FROM ${base}.personas AS p
    INNER JOIN ${base}.contactoPersona c ON p.documentoPersona = c.fkDocumentoPersona
    INNER JOIN ${base}.contacto co ON c.fkIdContacto = co.idContacto
    INNER JOIN ${base}.ciudad ci ON ci.idCiudad = co.fkIdCiudad
    INNER JOIN ${base}.departamento de ON de.idDepartamento = ci.fkIdDepartamento
    INNER JOIN ${base}.empleados em ON em.fkDocumentoPersona = p.documentoPersona
    INNER JOIN ${base}.cargo ca ON ca.idCargo = em.fkIdCargo
    INNER JOIN ${base}.tipoDocumento td ON td.idTipoDocumento = p.fkIdTipoDocumento
    INNER JOIN ${base}.empresa emp ON emp.nit = em.fkIdEmpresa
  ${documentoPersona ? `WHERE p.documentoPersona = ${documentoPersona}` : ''};`
}

// Obtiene las incapacidades para el excel
export const scriptReportExcel = (base: string, condition?: string) => {
  return `SELECT
    i.idIncapacidad,
    i.radicado,
    i.fkIdTipoIncapacidad,
    i.fkNitEmpresa,
    i.numeroIncapacidad,
    i.fechaInicio,
    i.fechaFin,
    i.totalDias,
    i.ibc,
    i.valor,
    i.fkIdEstadoIncapacidad,
    i.fkDocumentoPersona,
    i.cie,
    i.fechaRegistro,
    IF(i.totalDias >= 180, 'SI', 'NO') AS caso180,
    ci.descripcion AS nombreCodigoCie,
    p.genero,
    p.fechaNacimiento,
    p.fkIdTipoDocumento,
    CONCAT(p.primerNombre, ' ',p.segundoNombre, ' ',p.primerApellido,' ',p.segundoApellido) AS nombresApellidos,
    t.nombreTipoIncapacidad,
    e.nit,
    e.razonSocial,
    e.fkIdTipoEmpresa,
    e2.nit AS nitEntidad,
    e2.razonSocial AS razonSocialEntidad,
    td.nombreTipoDocumento,
    ei.nombreEstadoIncapacidad,
    ca.nombreCargo
  FROM ${base}.incapacidades i
    INNER JOIN ${base}.personas p ON p.documentoPersona = i.fkDocumentoPersona
    INNER JOIN ${base}.tipoDocumento td ON p.fkIdTipoDocumento = td.idTipoDocumento
    INNER JOIN ${base}.tipoIncapacidad t ON t.idTipoIncapacidad = i.fkIdTipoIncapacidad
    INNER JOIN ${base}.estadoIncapacidad ei ON ei.idEstadoIncapacidad = i.fkIdEstadoIncapacidad
    INNER JOIN ${base}.codigoCie ci ON ci.codigo = i.cie
    INNER JOIN ${base}.grupoCie gc ON gc.idGrupoCie = ci.idGrupo
    INNER JOIN ${base}.empleados em ON em.fkDocumentoPersona = i.fkDocumentoPersona
    INNER JOIN ${base}.cargo ca ON ca.idCargo = em.fkIdCargo
    LEFT JOIN ${base}.empresa e ON e.nit = i.fkNitEmpresa
    LEFT JOIN ${base}.empresa e2 ON i.fkEntidad = e2.nit
    ${condition}
  ORDER BY radicado DESC`
}

export const scriptDisability = (base: string, condition?: string):string => {
  return `SELECT
    i.idIncapacidad,
    i.radicado,
    i.fkIdTipoIncapacidad,
    i.fkNitEmpresa,
    i.numeroIncapacidad,
    i.fechaInicio,
    i.fechaFin,
    i.totalDias,
    i.ibc,
    i.valor,
    i.fkIdEstadoIncapacidad,
    i.fkDocumentoPersona,
    i.cie,
    gc.idGrupoCie,
    p.primerNombre,
    p.segundoNombre,
    p.primerApellido,
    p.segundoApellido,
    p.genero,
    p.fechaNacimiento,
    p.fkIdTipoDocumento,
    t.nombreTipoIncapacidad,
    e.nit,
    e.razonSocial,
    e.fkIdTipoEmpresa,
    e2.nit AS nitEntidad,
    e2.razonSocial AS razonSocialEntidad,
    td.nombreTipoDocumento,
    ei.nombreEstadoIncapacidad,
    i.fechaRegistro
  FROM ${base}.incapacidades i
    INNER JOIN ${base}.personas p ON p.documentoPersona = i.fkDocumentoPersona
    INNER JOIN ${base}.tipoDocumento td ON p.fkIdTipoDocumento = td.idTipoDocumento
    INNER JOIN ${base}.tipoIncapacidad t ON t.idTipoIncapacidad = i.fkIdTipoIncapacidad
    INNER JOIN ${base}.estadoIncapacidad ei ON ei.idEstadoIncapacidad = i.fkIdEstadoIncapacidad
    INNER JOIN ${base}.codigoCie ci ON ci.codigo = i.cie
    INNER JOIN ${base}.grupoCie gc ON gc.idGrupoCie = ci.idGrupo
    LEFT JOIN ${base}.empresa e ON e.nit = i.fkNitEmpresa
    LEFT JOIN ${base}.empresa e2 ON i.fkEntidad = e2.nit
  ${condition}
  ORDER BY radicado DESC`
}

// Obtiene los empleados que se cargaran en el select al crear una incapacidad
export const scriptEmployeSelect = (base: string):string => {
  return `SELECT p.documentoPersona, p.primerNombre, p.segundoNombre, p.primerApellido, p.segundoApellido FROM ${base}.personas p INNER JOIN ${base}.empleados e ON e.fkDocumentoPersona = p.documentoPersona ORDER BY p.primerApellido ASC;`
}

// Aplica para obtener todas los departamentos y un departamento por id
export const scriptGetDepartments = (base: string, idDepartamento?: number):string => {
  return `SELECT * FROM ${base}.departamento ${idDepartamento ? `WHERE idDepartamento = ${idDepartamento}` : ''};`
}

// Aplica para obtener todas las ciudades y las ciudades por departamento
export const scriptGetCities = (base: string, fkIdDepartamento?: number):string => {
  return `SELECT * FROM ${base}.ciudad ${fkIdDepartamento ? `WHERE fkIdDepartamento = ${fkIdDepartamento}` : ''};`
}

export const validateStateDisability = (base: string, nombreEstadoIncapacidad: string):string => {
  return `SELECT * FROM ${base}.estadoIncapacidad WHERE nombreEstadoIncapacidad = '${nombreEstadoIncapacidad}';`
}

export const scriptStateDisabilityById = (base: string, idEstado: number):string => {
  return `SELECT * FROM ${base}.estadoIncapacidad WHERE idEstadoIncapacidad = '${idEstado}';`
}

export const scriptStateDisability = (base: string):string => {
  return `SELECT * FROM ${base}.estadoIncapacidad;`
}

export const scriptDisabilityExtension = (base: string, fkIdIncapacidad?: string):string => {
  return `SELECT * FROM ${base}.prorrogasIncapacidad ${fkIdIncapacidad ? `WHERE fkIdIncapacidad = ${fkIdIncapacidad}` : ''};`
}

export const scriptCompanyByType = (base: string, idTipo: string):string => {
  return `SELECT * FROM ${base}.empresa WHERE fkIdTipoEmpresa = ${idTipo};`
}

export const scriptDisabilityType = (base: string):string => {
  return `SELECT * FROM ${base}.tipoIncapacidad;`
}

export const scriptCieGroup = (base: string):string => {
  return `SELECT * FROM ${base}.grupoCie;`
}

export const scriptCieDsibality = (base: string, cie: string):string => {
  return `SELECT * FROM ${base}.codigoCie ci
    INNER JOIN ${base}.grupoCie gc ON gc.idGrupoCie = ci.idGrupo
    WHERE codigo = "${cie}";`
}

export const scriptCieCode = (base: string, idGrupo: number):string => {
  return `SELECT * FROM ${base}.codigoCie WHERE idGrupo = ${idGrupo};`
}

export const scriptTotalDisabilities = (base: string):string => {
  return `SELECT COUNT(radicado) AS numeroIncapacidades, SUM(valor) AS totalIncapacidades FROM ${base}.incapacidades;`
}

export const scriptTotalDisabilitiesByEps = (base: string):string => {
  return `SELECT e.razonSocial, COUNT(i.numeroIncapacidad) AS numeroIncapacidades, SUM(valor) FROM ${base}.incapacidades i 
    INNER JOIN ${base}.empresa e ON e.nit = i.fkEntidad 
    INNER JOIN ${base}.tipoEmpresa te ON te.idTipoEmpresa = e.fkIdTipoEmpresa 
    WHERE te.idTipoEmpresa = 1 GROUP BY e.razonSocial;`
}

export const scriptTotalDisabilitiesByStatus = (base: string):string => {
  return `SELECT e.nombreEstadoIncapacidad, COUNT(i.numeroIncapacidad) AS numeroIncapacidades, SUM(valor) AS totalIncapacidades FROM ${base}.incapacidades i INNER JOIN ${base}.estadoIncapacidad e ON e.idEstadoIncapacidad = i.fkIdEstadoIncapacidad GROUP BY i.fkIdEstadoIncapacidad;`
}

export const scriptLatestDisabilities = (base: string):string => {
  return `SELECT * FROM ${base}.incapacidades ORDER BY radicado DESC LIMIT 10;`
}

export const scriptGetSalary = (base: string):string => {
  return `SELECT * FROM ${base}.settings;`
}

export const scriptGetDisabilityById = (base: string, idIncapacidad: number):string => {
  return `SELECT 
    i.*,
    e.nombreEstadoIncapacidad,
    t.nombreTipoIncapacidad,
    em.nit AS nitEntidad,
    em.razonSocial AS razonSocialEntidad,
    emp.razonSocial AS empresaEmpleado,
    te.nombreTipoEmpresa AS tipoEntidad
  FROM ${base}.incapacidades i
    INNER JOIN ${base}.estadoIncapacidad e ON e.idEstadoIncapacidad = i.fkIdEstadoIncapacidad
    INNER JOIN ${base}.tipoIncapacidad t ON t.idTipoIncapacidad = i.fkIdTipoIncapacidad
    INNER JOIN ${base}.empresa em ON em.nit = i.fkEntidad
    INNER JOIN ${base}.empresa emp ON emp.nit = i.fkNitEmpresa
    INNER JOIN ${base}.tipoEmpresa te ON te.idTipoEmpresa = em.fkIdTipoEmpresa
  WHERE idIncapacidad = ${idIncapacidad};`
}

export const scriptGetfilesByDisability = (base: string, idIncapacidad: number):string => {
  return `SELECT * FROM ${base}.files WHERE fkIdIncapacidad = ${idIncapacidad};`
}

export const scriptGetPermissionsUser = (base: string, usuario: number):string => {
  return `SELECT * FROM ${base}.permisosUsuario WHERE usuario = ${usuario};`
}

export const scriptGetPermissionsRol = (base: string, rol: number):string => {
  return `SELECT permisos FROM ${base}.permisosRol WHERE rol = ${rol};`
}

export const scriptDocumentsAttachByDisabilityType = (base: string, idTipoIncapacidad: number):string => {
  return `SELECT documento, idTipoDocumentoAdjuntar FROM ${base}.documentosAdjuntar ta INNER JOIN ${base}.tiposDocumentosAdjuntar tda ON tda.idDocumentoAdjuntar = ta.idTipoDocumentoAdjuntar WHERE ta.idTipoIncapacidad = ${idTipoIncapacidad};`
}

export const scriptConsolidaEstadoIncapacidades = (base: string):string => {
  return `SELECT t.nombreEstadoIncapacidad, t.cantidad, ((t.cantidad * t.valor) + t.tempVal) AS valorEstimado  FROM (SELECT ei.nombreEstadoIncapacidad, COUNT(*) AS cantidad, AVG(i.valor) AS valor, IFNULL((SELECT SUM(hi.valor) FROM ${base}.prorrogasIncapacidad hi INNER JOIN ${base}.incapacidades ic ON ic.idIncapacidad = hi.fkIdIncapacidad WHERE ic.fkIdEstadoIncapacidad = i.fkIdEstadoIncapacidad), 0) AS tempVal FROM ${base}.incapacidades i INNER JOIN ${base}.estadoIncapacidad ei ON ei.idEstadoIncapacidad = i.fkIdEstadoIncapacidad GROUP BY ei.idEstadoIncapacidad) AS t;`
}

export const scriptConsolidadoPorDiagnostico = (base: string) :string => {
  return `SELECT t.descripcion, t.cantidad, t.dias , ((t.cantidad * t.valor) + t.tempVal) AS valorEstimado  FROM (SELECT c.descripcion, c.codigo, COUNT(*) AS cantidad, AVG(i.valor) AS valor, (SELECT (SELECT SUM(hi.diasProrroga) FROM ${base}.prorrogasIncapacidad hi INNER JOIN ${base}.incapacidades ic ON ic.idIncapacidad = hi.fkIdIncapacidad WHERE ic.cie = i.cie) + (SELECT SUM(ic.totalDias) FROM ${base}.incapacidades ic WHERE ic.cie = i.cie)) AS dias, IFNULL((SELECT SUM(hi.valor) FROM ${base}.prorrogasIncapacidad hi INNER JOIN ${base}.incapacidades ic ON ic.idIncapacidad = hi.fkIdIncapacidad WHERE ic.cie = i.cie), 0) AS tempVal FROM ${base}.incapacidades i INNER JOIN ${base}.codigoCie c ON c.codigo = i.cie GROUP BY c.codigo) AS t`
}

export const scriptHistoricalDisability = (base: string, idIncapacidad: number) :string => {
  return `SELECT h.*, CONCAT(p.primerNombre, ' ', p.primerApellido) AS nombres FROM ${base}.historicoIncapacidad h JOIN ${base}.personas p ON p.documentoPersona = h.usuario WHERE h.idIncapacidad = ${idIncapacidad}`
}

export const scriptCountDaysDisability = (base: string) :string => {
  return `SELECT 
    idIncapacidad,
    fkIdTipoIncapacidad,
    t.nombreTipoIncapacidad,
    fechaRegistro,
    fkNitEmpresa,
    e.razonSocial,
    p.documentoPersona,
    fkIdEstadoIncapacidad,
    CONCAT(p.primerNombre, p.primerApellido) AS nombres,
    IFNULL(totalDias + (SELECT SUM(diasProrroga) FROM ${base}.prorrogasIncapacidad WHERE fkIdIncapacidad = i.idIncapacidad), i.totalDias) AS totalDias
  FROM ${base}.incapacidades i
    JOIN ${base}.empresa e ON e.nit = i.fkNitEmpresa
    JOIN ${base}.personas p ON p.documentoPersona = i.fkDocumentoPersona
    JOIN ${base}.tipoIncapacidad t ON t.idTipoIncapacidad = i.fkIdTipoIncapacidad
  WHERE fkIdEstadoIncapacidad != 4 AND fkIdEstadoIncapacidad != 7`
}

export const scriptUsersToNotify = (base: string) :string => {
  return `SELECT * FROM ${base}.usuariosNotificar WHERE estado = 1;`
}

export const scriptGetToNotifies = (base: string, usuario: string) :string => {
  return `SELECT * FROM ${base}.notificaciones WHERE usuario = ${usuario};`
}

export const scriptGetTypeOfDocumentToAttach = (base: string) :string => {
  return `SELECT * FROM ${base}.tiposDocumentosAdjuntar;`
}

export const scriptGetClients = () :string => {
  return 'SELECT * FROM empresas;'
}

// SELECT DATE_FORMAT(fechaRegistro, '%M') AS mes, e.nombreEstadoIncapacidad, COUNT(i.numeroIncapacidad) AS numeroIncapacidades, SUM(valor) AS totalIncapacidades FROM ${base}.incapacidades i INNER JOIN ${base}.estadoIncapacidad e ON e.idEstadoIncapacidad = i.fkIdEstadoIncapacidad GROUP BY DATE_FORMAT(fechaRegistro, '%M');
