export const scriptDocumentsType = (): string => {
  return 'SELECT idTipoDocumento, nombreTipoDocumento FROM tipodocumento'
}

export const scriptRols = (): string => {
  return 'SELECT idRol, nombreRol FROM roles'
}
