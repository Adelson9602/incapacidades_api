export const scriptDocumentsType = (base: string):string => {
  return `SELECT * FROM ${base}.tipoDocumento;`
}

export const scriptRols = (base: string):string => {
  return `SELECT * FROM ${base}.roles;`
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
  return `SELECT * FROM ${base}.empresa INNER JOIN ${base}.tipoEmpresa ON empresa.fkIdTipoEmpresa = tipoEmpresa.idTipoEmpresa ${nit ? `WHERE nit = ${nit}` : ''};`
}

// Obtiene los datos de una persona o todas las personas
export const scriptGetPerson = (base: string, documentoPersona?: number):string => {
  return `SELECT * FROM ${base}.personas AS p INNER JOIN ${base}.contactoPersona c ON p.documentoPersona = c.fkDocumentoPersona INNER JOIN ${base}.contacto co ON c.fkIdContacto = co.idContacto ${documentoPersona ? `WHERE p.documentoPersona = ${documentoPersona}` : ''};`
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
