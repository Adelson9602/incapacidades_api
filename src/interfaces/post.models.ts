export interface Persona {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  documentoPersona: number;
  genero: number;
  fechaNacimiento: string;
  fkIdTipoDocumento: number;
}

export interface TypeCompany {
  idTipoEmpresa?: number;
  nombreTipoEmpresa: string;
}

export interface Compnay {
  nit: string;
  newNit?: string;
  razonSocial: string;
  fkIdTipoEmpresa: number;
}

export interface Contacto {
  idContacto: number;
  direccion: string;
  barrio: string;
  correo: string;
  celular: string;
  telefonoFijo: string;
  fkIdCiudad: number;
}

export interface ContactCompany {
  fkNit: number;
  fkidContacto: number;
}

export interface ContactPerson {
  fkIdContacto: number;
  fkDocumentoPersona: number;
}

export interface DisabilityType {
  idTipoIncapacidad: number;
  nombreTipoIncapacidad: string;
  codigoDianostico: string;
}
