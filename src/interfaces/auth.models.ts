export interface User {
  usuario: number;
  password: string
}

export interface UserData {
  idPersona: number;
  idTipoDocumento: number;
  identificacion: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  sexo: string;
  usuario: string;
  password: string;
  estado: number;
  idPrivilegios: number;
  documentoPersona: string;
  correo: null | string;
  celular: null | string;
  zona: number | null;
  direccion: null | string;
  idCiudad: number | null;
  nombrePrivilegio: string;
  idDepartamento: number | null;
  tipoDocumento: string;
}

export interface Token {
  id: number,
  pwd: string
}
