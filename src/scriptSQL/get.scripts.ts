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

export const scriptStateDisability = (base: string):string => {
  return `SELECT * FROM ${base}.estadoIncapacidad;`
}

export const scriptDisability = (base: string):string => {
  return `SELECT * FROM ${base}.incapacidades;`
}

export const scriptHistoryDisability = (base: string, fkRadicado?: string):string => {
  return `SELECT * FROM ${base}.historialIncapacidad ${fkRadicado ? `WHERE fkRadicado = ${fkRadicado}` : ''};`
}
