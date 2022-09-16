import { UserData } from '../interfaces/auth.models'
import { Compnay, Persona, TypeCompany } from '../interfaces/post.models'
import { encryptedAES } from '../libs/encrypt'

export const scriptCreatePerson = (data: Persona, base: string):string => {
  return `INSERT INTO ${base}.personas(documentoPersona, primerNombre, segundoNombre, primerApellido, segundoApellido, genero, fechaNacimiento, fkIdTipoDocumento) VALUES (${data.documentoPersona},'${data.primerNombre}','${data.segundoNombre || ''}','${data.primerApellido}','${data.segundoApellido || ''}','${data.genero}','${data.fechaNacimiento}',${data.fkIdTipoDocumento}) ON DUPLICATE KEY UPDATE documentoPersona =${data.documentoPersona} , primerNombre='${data.primerNombre}', segundoNombre='${data.segundoNombre || ''}', primerApellido='${data.primerApellido}', segundoApellido='${data.segundoApellido || ''}', genero='${data.genero}', fechaNacimiento='${data.fechaNacimiento}', fkIdTipoDocumento=${data.fkIdTipoDocumento}`
}

export const sccriptCreateUser = (data: UserData, base: string):string => {
  return `INSERT INTO ${base}.usuarios(usuario, password, fkIdRol, estadoUsuario, fotoPerfil) VALUES (${data.usuario},'${encryptedAES(data.password)}',${data.fkIdRol},${data.estadoUsuario},'${data.fotoPerfil}') ON DUPLICATE KEY UPDATE usuario = ${data.usuario}, password = '${encryptedAES(data.password)}', fkIdRol = ${data.fkIdRol}, estadoUsuario = ${data.estadoUsuario}, fotoPerfil = '${data.fotoPerfil}'`
}

// Script para crear tipos de empresa
export const scriptCreateTpCp = (data: TypeCompany, base: string):string => {
  return `INSERT INTO ${base}.tipoEmpresa(idTipoEmpresa, nombreTipoEmpresa) VALUES (${data.idTipoEmpresa || null},'${data.nombreTipoEmpresa}') ON DUPLICATE KEY UPDATE nombreTipoEmpresa = '${data.nombreTipoEmpresa}'`
}

export const scriptCreateCompany = (data: Compnay, base: string):string => {
  return `INSERT INTO ${base}.empresa(nit, razonSocial, fkIdTipoEmpresa) VALUES ('${data.nit}','${data.razonSocial}', ${data.fkIdTipoEmpresa}) ON DUPLICATE KEY UPDATE nit = '${data.newNit ? data.newNit : data.nit}', razonSocial = '${data.razonSocial}', fkIdTipoEmpresa = ${data.fkIdTipoEmpresa}`
}
