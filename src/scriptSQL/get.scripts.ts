export const scriptDocumentsType = (base: string): string => {
  return `SELECT idTipoDocumento, nombreTipoDocumento FROM ${base}.tipoDocumento`
}

export const scriptRols = (base: string): string => {
  return `SELECT idRol, nombreRol FROM ${base}.roles`
}

export const scriptUsers = (base: string): string => {
  return `SELECT *, fotoPerfil AS avatar FROM ${base}.usuarios INNER JOIN ${base}.personas ON personas.documentoPersona = usuarios.usuario`
}

export const scriptValidateTpCompany = (nombre: string, base: string): string => {
  return `SELECT * FROM ${base}.tipoEmpresa WHERE nombreTipoEmpresa = '${nombre}'`
}
