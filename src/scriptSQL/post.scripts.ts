import { UserData } from '../interfaces/auth.models'
import {
  Company,
  ContactCompany,
  Contact,
  ContactPerson,
  DisabilityType,
  Employe,
  Persona,
  Position,
  TypeCompany,
  Disability,
  DisabilityState,
  HistoryDisability,
  Rol,
  DocumentType,
  Department,
  City
} from '../interfaces/general.models'
import { encryptedAES } from '../libs/encrypt'

export const scriptCreatePerson = (data: Persona, base: string):string => {
  return `INSERT INTO ${base}.personas(documentoPersona, primerNombre, segundoNombre, primerApellido, segundoApellido, genero, fechaNacimiento, fkIdTipoDocumento) VALUES (${data.oldDocumentoPersona ? data.oldDocumentoPersona : data.documentoPersona},'${data.primerNombre}','${data.segundoNombre || ''}','${data.primerApellido}','${data.segundoApellido || ''}','${data.genero}','${data.fechaNacimiento}',${data.fkIdTipoDocumento}) ON DUPLICATE KEY UPDATE ${data.oldDocumentoPersona ? `documentoPersona = ${data.documentoPersona},` : ''} primerNombre='${data.primerNombre}', segundoNombre='${data.segundoNombre || ''}', primerApellido='${data.primerApellido}', segundoApellido='${data.segundoApellido || ''}', genero='${data.genero}', fechaNacimiento='${data.fechaNacimiento}', fkIdTipoDocumento=${data.fkIdTipoDocumento};`
}

export const sccriptCreateUser = (data: UserData, base: string):string => {
  return `INSERT INTO ${base}.usuarios(usuario, password, fkIdRol, estadoUsuario, fotoPerfil) VALUES (${data.usuario},'${encryptedAES(data.password)}',${data.fkIdRol},${data.estadoUsuario},'${data.fotoPerfil}') ON DUPLICATE KEY UPDATE usuario = ${data.usuario}, password = '${encryptedAES(data.password)}', fkIdRol = ${data.fkIdRol}, estadoUsuario = ${data.estadoUsuario}, fotoPerfil = '${data.fotoPerfil}';`
}

// Script para crear tipos de empresa
export const scriptCreateTpCp = (data: TypeCompany, base: string):string => {
  return `INSERT INTO ${base}.tipoEmpresa(idTipoEmpresa, nombreTipoEmpresa) VALUES (${data.idTipoEmpresa || null},'${data.nombreTipoEmpresa}') ON DUPLICATE KEY UPDATE nombreTipoEmpresa = '${data.nombreTipoEmpresa}';`
}

export const scriptCreateCompany = (data: Company, base: string):string => {
  return `INSERT INTO ${base}.empresa(nit, razonSocial, fkIdTipoEmpresa) VALUES ('${data.oldNit ? data.oldNit : data.nit}','${data.razonSocial}', ${data.fkIdTipoEmpresa}) ON DUPLICATE KEY UPDATE ${data.oldNit ? `nit = '${data.nit}',` : ''} razonSocial = '${data.razonSocial}', fkIdTipoEmpresa = ${data.fkIdTipoEmpresa};`
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
  return `INSERT INTO ${base}.empleados(fkDocumentoPersona, fkIdCargo) VALUES (${data.fkDocumentoPersona}, ${data.fkIdCargo}) ON DUPLICATE KEY UPDATE fkDocumentoPersona = ${data.fkDocumentoPersona}, fkIdCargo = ${data.fkIdCargo};`
}

export const scriptCreateStateInability = (data: DisabilityState, base: string):string => {
  return `INSERT INTO ${base}.estadoIncapacidad(idEstadoIncapacidad, nombreEstadoIncapacidad) VALUES (${data.idEstadoIncapacidad},'${data.nombreEstadoIncapacidad}') ON DUPLICATE KEY UPDATE idEstadoIncapacidad = ${data.idEstadoIncapacidad}, nombreEstadoIncapacidad = '${data.nombreEstadoIncapacidad}';`
}

// Incapaciades
export const scriptCreateInability = (data: Disability, base: string):string => {
  return `INSERT INTO ${base}.incapacidades(radicado, fkIdTipoIncapacidad, fkNitEmpresa, numeroIncapacidad, fechaInicio, fechaFin, totalDias, ibc, valor, fkIdEstadoIncapacidad, fkDocumentoPersona, fkIdArl, fkIdAfp, fkIdEps) VALUES ('${data.radicado}', ${data.fkIdTipoIncapacidad}, ${data.fkNitEmpresa}, ${data.numeroIncapacidad}, '${data.fechaInicio}', '${data.fechaFin}', ${data.totalDias}, '${data.ibc}', ${data.valor}, ${data.fkIdEstadoIncapacidad}, ${data.fkDocumentoPersona}, ${data.fkIdArl}, ${data.fkIdAfp}, ${data.fkIdEps}) ON DUPLICATE KEY UPDATE radicado ='${data.radicado}', fkIdTipoIncapacidad =${data.fkIdTipoIncapacidad}, fkNitEmpresa =${data.fkNitEmpresa}, numeroIncapacidad = ${data.numeroIncapacidad}, fechaInicio ='${data.fechaInicio}', fechaFin ='${data.fechaFin}', totalDias =${data.totalDias}, ibc ='${data.ibc}', valor =${data.valor}, fkIdEstadoIncapacidad =${data.fkIdEstadoIncapacidad}, fkDocumentoPersona =${data.fkDocumentoPersona}, fkIdArl =${data.fkIdArl}, fkIdAfp=${data.fkIdAfp}, fkIdEps =${data.fkIdEps};`
}

export const scriptHistoryInability = (data: HistoryDisability, base: string):string => {
  return `INSERT INTO ${base}.historialIncapacidad(idHistorialIncapacidad, fkRadicado, estadoIncapidad, fechaFin, fechaProrroga, observacion) VALUES (${data.idHistorialIncapacidad}, '${data.fkRadicado}', ${data.estadoIncapidad}, '${data.fechaFin}', '${data.fechaProrroga}', '${data.observacion}') ON DUPLICATE KEY UPDATE fkRadicado ='${data.fkRadicado}', estadoIncapidad =${data.estadoIncapidad}, fechaFin ='${data.fechaFin}', fechaProrroga ='${data.fechaProrroga}', observacion ='${data.observacion}';`
}

export const scriptCreateRol = (data: Rol, base: string):string => {
  return `INSERT INTO ${base}.roles(idRol, nombreRol) VALUES (${data.idRol}, '${data.nombreRol}') ON DUPLICATE KEY UPDATE nombreRol = '${data.nombreRol}';`
}

export const scriptCreateDocumentType = (data: DocumentType, base: string):string => {
  return `INSERT INTO ${base}.tipoDocumento(idTipoDocumento, nombreTipoDocumento) VALUES (${data.idTipoDocumento}, '${data.nombreTipoDocumento}') ON DUPLICATE KEY UPDATE nombreTipoDocumento = '${data.nombreTipoDocumento}';`
}

export const scriptCreateDepartment = (data: Department, base: string):string => {
  return `INSERT INTO ${base}.departamento(idDepartamento, nombreDepartamento) VALUES (${data.idDepartamento}, '${data.nombreDepartamento}') ON DUPLICATE KEY UPDATE nombreDepartamento = '${data.nombreDepartamento}';`
}

export const scriptCreateCity = (data: City, base: string):string => {
  return `INSERT INTO ${base}.ciudad(idCiudad, nombreCiudad, fkIdDepartamento) VALUES (${data.idCiudad}, '${data.nombreCiudad}', ${data.fkIdDepartamento}) ON DUPLICATE KEY UPDATE nombreCiudad = '${data.nombreCiudad}', fkIdDepartamento = ${data.fkIdDepartamento};`
}
