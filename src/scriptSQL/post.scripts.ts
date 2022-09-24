import { UserData } from '../interfaces/auth.models'
import {
  Compnay,
  ContactCompany,
  Contact,
  ContactPerson,
  DisabilityType,
  Employe,
  Persona,
  Position,
  TypeCompany
} from '../interfaces/general.models'
import { encryptedAES } from '../libs/encrypt'

export const scriptCreatePerson = (data: Persona, base: string):string => {
  return `INSERT INTO ${base}.personas(documentoPersona, primerNombre, segundoNombre, primerApellido, segundoApellido, genero, fechaNacimiento, fkIdTipoDocumento) VALUES (${data.documentoPersona},'${data.primerNombre}','${data.segundoNombre || ''}','${data.primerApellido}','${data.segundoApellido || ''}','${data.genero}','${data.fechaNacimiento}',${data.fkIdTipoDocumento}) ON DUPLICATE KEY UPDATE documentoPersona =${data.documentoPersona} , primerNombre='${data.primerNombre}', segundoNombre='${data.segundoNombre || ''}', primerApellido='${data.primerApellido}', segundoApellido='${data.segundoApellido || ''}', genero='${data.genero}', fechaNacimiento='${data.fechaNacimiento}', fkIdTipoDocumento=${data.fkIdTipoDocumento};`
}

export const sccriptCreateUser = (data: UserData, base: string):string => {
  return `INSERT INTO ${base}.usuarios(usuario, password, fkIdRol, estadoUsuario, fotoPerfil) VALUES (${data.usuario},'${encryptedAES(data.password)}',${data.fkIdRol},${data.estadoUsuario},'${data.fotoPerfil}') ON DUPLICATE KEY UPDATE usuario = ${data.usuario}, password = '${encryptedAES(data.password)}', fkIdRol = ${data.fkIdRol}, estadoUsuario = ${data.estadoUsuario}, fotoPerfil = '${data.fotoPerfil}';`
}

// Script para crear tipos de empresa
export const scriptCreateTpCp = (data: TypeCompany, base: string):string => {
  return `INSERT INTO ${base}.tipoEmpresa(idTipoEmpresa, nombreTipoEmpresa) VALUES (${data.idTipoEmpresa || null},'${data.nombreTipoEmpresa}') ON DUPLICATE KEY UPDATE nombreTipoEmpresa = '${data.nombreTipoEmpresa}';`
}

export const scriptCreateCompany = (data: Compnay, base: string):string => {
  return `INSERT INTO ${base}.empresa(nit, razonSocial, fkIdTipoEmpresa) VALUES ('${data.nit}','${data.razonSocial}', ${data.fkIdTipoEmpresa}) ON DUPLICATE KEY UPDATE nit = '${data.newNit ? data.newNit : data.nit}', razonSocial = '${data.razonSocial}', fkIdTipoEmpresa = ${data.fkIdTipoEmpresa};`
}

export const scriptContacCompany = (data: ContactCompany, base: string) => {
  return `INSERT INTO ${base}.contactoEmpresa(fkNit, fkidContacto) VALUES (${data.fkNit}, ${data.fkidContacto});`
}

export const scriptContacPerson = (data: ContactPerson, base: string):string => {
  return `INSERT INTO ${base}.contactoPersona(fkIdContacto, fkDocumentoPersona) VALUES (${data.fkIdContacto}, ${data.fkDocumentoPersona}) ON DUPLICATE KEY UPDATE fkIdContacto = ${data.fkIdContacto}, fkDocumentoPersona = ${data.fkDocumentoPersona};`
}

export const scriptCreateContacto = (data: Contact, base: string):string => {
  return `INSERT INTO ${base}.contacto(idContacto, direccion, barrio, correo, celular, telefonoFijo, fkIdCiudad) VALUES (${data.idContacto}, '${data.direccion}', '${data.barrio}', '${data.correo}', '${data.celular}', '${data.telefonoFijo}', ${data.fkIdCiudad}) ON DUPLICATE KEY UPDATE idContacto = ${data.idContacto}, direccion = '${data.direccion}', barrio = '${data.barrio}', correo = '${data.correo}', celular = '${data.celular}', telefonoFijo = '${data.telefonoFijo}', fkIdCiudad = ${data.fkIdCiudad};`
}

export const scriptDisabilityType = (data: DisabilityType, base: string):string => {
  return `INSERT INTO ${base}.tipoIncapacidad(idTipoIncapacidad, nombreTipoIncapacidad, codigoDianostico) VALUES (${data.idTipoIncapacidad}, '${data.nombreTipoIncapacidad}', '${data.codigoDianostico}') ON DUPLICATE KEY UPDATE idTipoIncapacidad = ${data.idTipoIncapacidad}, nombreTipoIncapacidad = '${data.nombreTipoIncapacidad}, codigoDianostico = '${data.codigoDianostico}';`
}

export const scriptCreatePosition = (data: Position, base: string):string => {
  return `INSERT INTO ${base}.cargo(idCargo, nombreCargo) VALUES (${data.idCargo}, '${data.nombreCargo}') ON DUPLICATE KEY UPDATE nombreCargo = '${data.nombreCargo}';`
}

export const scriptEmploye = (data: Employe, base: string):string => {
  return `INSERT INTO ${base}.empleados(fkDocumentoPersona, fkIdCargo) VALUES (${data.fkDocumentoPersona}, ${data.fkIdCargo}) ON DUPLICATE KEY UPDATE fkDocumentoPersona = ${data.fkDocumentoPersona}, fkIdCargo = ${data.fkIdCargo}`
}
