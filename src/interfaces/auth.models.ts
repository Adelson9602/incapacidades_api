export interface User {
  usuario: number;
  password: string
}

export interface Token {
  id: number,
  pwd: string
}

export interface UserData {
  documentoPersona: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  genero: string;
  fechaNacimiento: string;
  fkIdTipoDocumento: number;
  usuario: number;
  password: string;
  fkIdRol: number;
  estadoUsuario: number;
  fotoPerfil: string;
}

export interface Cliente {
  idEmpresa: number;
  razonSocial: string;
  nombreSistema: string;
  urlLogo: string;
  nombreBase: string;
  estado: number;
  direccion: string;
  telefono: string;
  email: string;
  dataUser?: UserData
}
