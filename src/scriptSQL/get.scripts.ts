export const scriptDocumentsType = (base: string): string => {
  return `SELECT idTipoDocumento, nombreTipoDocumento FROM ${base}.tipodocumento`
}

export const scriptRols = (base: string): string => {
  return `SELECT idRol, nombreRol FROM ${base}.roles`
}
