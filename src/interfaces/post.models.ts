export interface Persona {
  idPersona: number;
  idTipoDocumento: number;
  identificacion: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  sexo: string;
  salario: null | string;
}

export interface Contacto {
  idContacto: number;
  correo: string;
  telefonoFijo: string;
  celular: string;
  zona: string;
  localidadComuna: string;
  direccion: string;
  idCiudad: number;
  idpersona?: number;
  identificacion: string;
}

export interface User {
  usuario: string;
  password: string;
  estado: number;
  idPrivilegios: number;
  identificacion: number;
}

export interface Usuario {
  idPersona: number;
  idTipodocumento: number;
  identificacion: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  sexo: string;
  salario: null | string;
  idContacto: number;
  correo: string;
  telefonoFijo: string;
  celular: string;
  zona: string;
  localidadComuna: string;
  direccion: string;
  idCiudad: number;
  idpersona: number;
  idUsuario: number;
  usuario: string;
  password: string;
  estado: number;
  idPrivilegios: number;
}
