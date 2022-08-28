
export const scriptGetBases = (): string => {
  return 'SELECT * FROM clientes.empresas WHERE estado = 1'
}

export const scriptGetUser = (base: string, usuario: number, password: string): string => {
  return `SELECT * FROM ${base}.usuarios INNER JOIN ${base}.personas ON personas.documentoPersona = usuarios.usuario WHERE usuario = ${usuario} AND password = '${password}'`
}
