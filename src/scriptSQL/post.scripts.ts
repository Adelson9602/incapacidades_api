import { UserData } from '../interfaces/auth.models'
import { Persona } from '../interfaces/post.models'

export const scriptCreatePerson = (data: Persona):string => {
  return `INSERT INTO computrabajo.personas(documentoPersona, primerNombre, segundoNombre, primerApellido, segundoApellido, genero, fechaNacimiento, fkIdTipoDocumento) VALUES (${data.documentoPersona},'${data.primerNombre}','${data.segundoNombre || ''}','${data.primerApellido}','${data.segundoApellido || ''}','${data.genero}','${data.fechaNacimiento}',${data.fkIdTipoDocumento}) ON DUPLICATE KEY UPDATE documentoPersona =${data.documentoPersona} , primerNombre='${data.primerNombre}', segundoNombre='${data.segundoNombre || ''}', primerApellido='${data.primerApellido}', segundoApellido='${data.segundoApellido || ''}', genero='${data.genero}', fechaNacimiento='${data.fechaNacimiento}', fkIdTipoDocumento=${data.fkIdTipoDocumento}`
}

export const sccriptCreateUser = (data: UserData):string => {
  return `INSERT INTO usuarios(usuario, password, fkIdRol, estadoUsuario, fotoPerfil) VALUES (${data.usuario},'${data.password}',${data.fkIdRol},${data.estadoUsuario},'${data.fotoPerfil}') ON DUPLICATE KEY UPDATE usuario = ${data.usuario}, password = '${data.password}', fkIdRol = ${data.fkIdRol}, estadoUsuario = ${data.estadoUsuario}, fotoPerfil = '${data.fotoPerfil}'`
}
