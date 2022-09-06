export const scriptDocumentsType = (base: string): string => {
  return `SELECT idTipoDocumento, nombreTipoDocumento FROM ${base}.tipodocumento`
}

export const scriptRols = (base: string): string => {
  return `SELECT idRol, nombreRol FROM ${base}.roles`
}

export const scriptUsers = (base: string): string => {
  return `SELECT * FROM ${base}.usuarios INNER JOIN ${base}.personas ON personas.documentoPersona = usuarios.usuario`
}
