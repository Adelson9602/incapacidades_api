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

export interface User extends Persona {
  usuario: number;
  password: string;
  fkIdRol: number;
  estadoUsuario: number;
  fotoPerfil: string;
  avatar: string;
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
  // Datos que retorna cuando se haga el inner join con tabla tipoEmpresa
  nombreTipoEmpresa?: string;
  idTipoEmpresa?: number;
}

export interface Contact {
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

export interface Person extends Persona, Contact, ContactPerson {
// Se crea esta interfaz solo para unir propiedades de otras interfaces
}

export interface DisabilityType {
  idTipoIncapacidad: number;
  nombreTipoIncapacidad: string;
  codigoDianostico: string;
}

export interface Position {
  idCargo: number;
  nombreCargo: string;
}

export interface Employe {
  fkDocumentoPersona: number;
  fkIdCargo: number;
}

export interface ResultSql {
  fieldCount: number,
  affectedRows: number,
  insertId: number,
  serverStatus: number,
  warningCount: number,
  message: string,
  protocol41: boolean,
  changedRows: number
}

export interface Adjunto {
  id: number | null;
  idPersona: null | string;
  url: null | string;
  tipoArchivo?: number | null;
}

export interface Rol {
  idRol: number;
  nombreRol: string;
}

export interface DocumentType {
  idTipoDocumento: number;
  nombreTipoDocumento: string;
}

export interface Department {
  idDepartamento: number;
  nombreDepartamento: string;
}

export interface City {
  idCiudad: number;
  nombreCiudad: string;
  fkIdDepartamento: number;
}

export interface DepartemtAndCity extends Department {
  cities: City[]
}

export interface InabilityType {
  idEstadoIncapacidad: number;
  nombreEstadoIncapacidad: string;
}

export interface StateInability {
  nombreEstadoIncapacidad: string;
  idEstadoIncapacidad: number;
}

export interface Inability {
  radicado: string;
  fkIdTipoIncapacidad: number;
  fkNitEmpresa: number;
  numeroIncapacidad: number;
  fechaInicio: string;
  fechaFin: string;
  totalDias: number;
  ibc: string;
  valor: string;
  fkIdEstadoIncapacidad: number;
  fkDocumentoPersona: number;
  fkIdArl: number;
  fkIdAfp: number;
  fkIdEps: number;
}

export interface HistoryInability {
  idHistorialIncapacidad: number;
  fkRadicado: string;
  estadoIncapidad: number;
  fechaFin: string;
  fechaProrroga: string;
  observacion: string;
}
