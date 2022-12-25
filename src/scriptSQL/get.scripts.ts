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
  return `SELECT *, fotoPerfil AS avatar FROM ${base}.usuarios INNER JOIN ${base}.personas ON personas.documentoPersona = usuarios.usuario;`
}

export const scriptValidateTpCompany = (nombreTipoEmpresa: string, base: string):string => {
  return `SELECT * FROM ${base}.tipoEmpresa WHERE nombreTipoEmpresa = '${nombreTipoEmpresa}';`
}

export const scriptValidatePosition = (nombreCargo: string, base: string):string => {
  return `SELECT * FROM ${base}.cargo WHERE nombreCargo = '${nombreCargo}';`
}

export const scriptCompanies = (base: string, nit?: string):string => {
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
  ${nit ? `WHERE nit = ${nit}` : ''};`
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
  ${documentoPersona ? `WHERE p.documentoPersona = ${documentoPersona}` : ''};`
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

export const scriptDisability = (base: string):string => {
  return `SELECT
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
    ei.nombreEstadoIncapacidad
  FROM ${base}.incapacidades i
    INNER JOIN ${base}.personas p ON p.documentoPersona = i.fkDocumentoPersona
    INNER JOIN ${base}.tipoDocumento td ON p.fkIdTipoDocumento = td.idTipoDocumento
    INNER JOIN ${base}.tipoIncapacidad t ON t.idTipoIncapacidad = i.fkIdTipoIncapacidad
    INNER JOIN ${base}.estadoIncapacidad ei ON ei.idEstadoIncapacidad = i.fkIdEstadoIncapacidad
    INNER JOIN ${base}.codigoCie ci ON ci.codigo = i.cie
    INNER JOIN ${base}.grupoCie gc ON gc.idGrupoCie = ci.idGrupo
    LEFT JOIN ${base}.empresa e ON e.nit = i.fkNitEmpresa
    LEFT JOIN ${base}.empresa e2 ON i.fkEntidad = e2.nit
  ORDER BY radicado DESC`
}

export const scriptHistoryDisability = (base: string, fkRadicado?: string):string => {
  return `SELECT * FROM ${base}.historialIncapacidad ${fkRadicado ? `WHERE fkRadicado = ${fkRadicado}` : ''};`
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
  return `SELECT salarioMinimo FROM ${base}.settings;`
}

export const scriptGetDisabilityById = (base: string, radicado: number):string => {
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
  WHERE radicado = ${radicado};`
}

export const scriptGetfilesByDisability = (base: string, idIncapacidad: number):string => {
  return `SELECT * FROM ${base}.files WHERE fkRadicado = ${idIncapacidad};`
}

export const scriptGetPermissionsUser = (base: string, usuario: number):string => {
  return `SELECT * FROM ${base}.permisosUsuario WHERE usuario = ${usuario};`
}

export const scriptGetPermissionsRol = (base: string, rol: number):string => {
  return `SELECT permisos FROM ${base}.permisosRol WHERE rol = ${rol};`
}

// SELECT DATE_FORMAT(fechaRegistro, '%M') AS mes, e.nombreEstadoIncapacidad, COUNT(i.numeroIncapacidad) AS numeroIncapacidades, SUM(valor) AS totalIncapacidades FROM ${base}.incapacidades i INNER JOIN ${base}.estadoIncapacidad e ON e.idEstadoIncapacidad = i.fkIdEstadoIncapacidad GROUP BY DATE_FORMAT(fechaRegistro, '%M');
