import { Empresa, Ips, Entidad } from '../interfaces/get.models'
import { Persona, Contacto, User } from '../interfaces/post.models'
import { encryptedAES } from '../libs/encrypt'

export const scriptCreatePerson = ({
  idTipoDocumento,
  identificacion,
  primerNombre,
  segundoNombre,
  primerApellido,
  segundoApellido,
  fechaNacimiento,
  sexo,
  salario
}: Persona):string => {
  return `INSERT INTO persona(idtipodocumento, identificacion, primernombre, segundonombre, primerapellido, segundoapellido, fechanacimiento, sexo, salario) VALUES (${idTipoDocumento},${identificacion},'${primerNombre}','${segundoNombre || ''}','${primerApellido}','${segundoApellido || ''}','${fechaNacimiento}','${sexo}','${salario || 0}') ON DUPLICATE KEY UPDATE idtipodocumento='${idTipoDocumento}', identificacion='${identificacion}', primernombre='${primerNombre}', segundonombre='${segundoNombre || ''}', primerapellido='${primerApellido}', segundoapellido='${segundoApellido || ''}', fechanacimiento='${fechaNacimiento}', sexo='${sexo}', salario='${salario || 0}'`
}

export const scriptCreateContacto = ({
  correo,
  celular,
  zona,
  localidadComuna,
  direccion,
  idCiudad,
  telefonoFijo,
  identificacion
}: Contacto):string => {
  return `INSERT INTO contacto(correo, telefono_fijo, celular, zona, localidad_comuna, direccion, idciudad, idpersona) VALUES ('${correo}',' ${telefonoFijo || ''}', ${celular}, '${zona}', '${localidadComuna}', '${direccion}', ${idCiudad}, (SELECT id FROM persona WHERE identificacion = ${identificacion})) ON DUPLICATE KEY UPDATE correo='${correo || ''}', telefono_fijo='${telefonoFijo || ''}', celular='${celular}', zona='${zona || ''}', localidad_comuna='${localidadComuna || ''}', direccion='${direccion || ''}', idciudad=${idCiudad}`
}

export const scriptCreateUser = ({
  usuario,
  password,
  estado,
  idPrivilegios,
  identificacion
}: User):string => {
  return `INSERT INTO usuario(usuario, password, estado, idprivilegios, documentoPersona) VALUES ('${usuario}','${encryptedAES(password)}',${estado},${idPrivilegios}, '${identificacion}') ON DUPLICATE KEY UPDATE usuario='${usuario}', password='${encryptedAES(password)}', estado='${estado}', idprivilegios='${idPrivilegios}'`
}

export const scriptCreateEmpresa = ({
  idTipoDocumento,
  nombre,
  identificacion,
  estado,
  telefono,
  idCiudad,
  correo,
  direccion
}: Empresa):string => {
  return `INSERT INTO empresa(idtipodocumento, nombre, identificacion, estado, telefono, idciudad, correo, direccion) VALUES (${idTipoDocumento},'${nombre}',${identificacion},${estado},'${telefono}',${idCiudad},'${correo}','${direccion}') ON DUPLICATE KEY UPDATE idtipodocumento = ${idTipoDocumento}, nombre ='${nombre}', identificacion =${identificacion}, estado =${estado}, telefono =${telefono}, idciudad =${idCiudad}, correo ='${correo}', direccion ='${direccion}'`
}

export const scriptCreateEps = ({
  nombre,
  identificacion,
  estado,
  telefono
}:Entidad):string => {
  return `INSERT INTO eps(nombre, identificacion, estado, telefono) VALUES ('${nombre}','${identificacion}',${estado},${telefono})`
}

export const scriptCreateIps = ({
  id,
  idEps,
  idCiudad,
  nombre,
  identificacion,
  estado,
  direccion,
  telefono
}:Ips):string => {
  return `INSERT INTO ips(id, ideps, idciudad, nombre, identificacion, estado, direccion, telefono) VALUES (${id},${idEps},${idCiudad}, '${nombre}','${identificacion}',${estado}, '${direccion}', '${telefono}') ON DUPLICATE KEY UPDATE ideps =${idEps}, idciudad =${idCiudad}, nombre ='${nombre}', identificacion ='${identificacion}', estado =${estado}, direccion ='${direccion}', telefono ='${telefono}'`
}

export const scriptCreateArl = ({
  nombre,
  identificacion,
  telefono,
  estado
}: Entidad):string => {
  return `INSERT INTO arl(nombre, identificacion, telefono, estado) VALUES ('${nombre}','${identificacion}','${telefono}',${estado}) ON DUPLICATE KEY UPDATE nombre ='${nombre}', identificacion ='${identificacion}', telefono ='${telefono}', estado = '${estado}'`
}

export const scriptCreateAfp = ({
  nombre,
  identificacion,
  telefono,
  estado
}: Entidad):string => {
  return `INSERT INTO afp(nombre, identificacion, telefono, estado) VALUES ('${nombre}','${identificacion}','${telefono}',${estado}) ON DUPLICATE KEY UPDATE nombre ='${nombre}', identificacion ='${identificacion}', telefono ='${telefono}', estado = '${estado}'`
}

export const scriptCreateEntidad = ({
  tipoEntidad,
  id,
  tabla,
  idTipoDocumento,
  nombre,
  identificacion,
  estado,
  telefono,
  idCiudad,
  correo,
  direccion,
  localidad,
  idEps
}: Entidad):string => {
  // if (tipoEntidad === 'ips') {
  //   console.log('IPS')
  //   return `INSERT INTO ${tabla}(id, nombre, estado, telefono, idciudad, correo, direccion, localidad, ideps) VALUES (${id}, '${nombre}', ${estado}, '${telefono}', ${idCiudad}, '${correo}', '${direccion}', '${localidad}', ${idEps}) ON DUPLICATE KEY UPDATE nombre ='${nombre}', estado =${estado}, telefono ='${telefono}', idciudad = ${idCiudad}, correo ='${correo}', direccion ='${direccion}', localidad ='${localidad}', ideps= ${idEps}`
  // }
  return `INSERT INTO ${tabla}(id, idtipodocumento, nombre, identificacion, estado, telefono, idciudad, correo, direccion, localidad ${tipoEntidad === 'ips' ? ', ideps' : ''}) VALUES (${id}, ${idTipoDocumento},'${nombre}','${identificacion}',${estado}, '${telefono}', ${idCiudad}, '${correo}', '${direccion}', '${localidad}' ${tipoEntidad === 'ips' ? `, ${idEps}` : ''}) ON DUPLICATE KEY UPDATE idtipodocumento =${idTipoDocumento}, nombre ='${nombre}', identificacion ='${identificacion}', estado =${estado}, telefono ='${telefono}', idciudad = ${idCiudad}, correo ='${correo}', direccion ='${direccion}', localidad ='${localidad}' ${tipoEntidad === 'ips' ? `, ideps= ${idEps}` : ''}`
}
