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
