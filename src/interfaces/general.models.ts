export interface ResponseFile{
  saved: boolean;
  typeFile: number;
  url: string;
  nameFile: string;
}
export interface Persona {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  documentoPersona: number;
  oldDocumentoPersona?: number;
  genero: number;
  fechaNacimiento: string;
  fkIdTipoDocumento: number;
}

export interface TypeCompany {
  idTipoEmpresa?: number;
  nombreTipoEmpresa: string;
}

export interface Company {
  nit: string;
  oldNit?: string;
  razonSocial: string;
  fkIdTipoEmpresa: number;
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
  fkIdEmpresa: number;
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

export interface InformationCompany {
  nit: string;
  oldNit?: string;
  razonSocial: string;
  fkIdTipoEmpresa: number;
  nombreTipoEmpresa: string;
  fkNit: string;
  fkidContacto: number;
  direccion: string;
  barrio: string;
  correo: string;
  celular: string;
  telefonoFijo: string;
  fkIdCiudad: number;
  nombreCiudad: string;
  fkIdDepartamento: number;
  nombreDepartamento: string;
}

export interface InformationEmploye {
  documentoPersona: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  genero: string;
  fechaNacimiento: string;
  fkIdTipoDocumento: number;
  fkIdContacto: number;
  fkDocumentoPersona: number;
  idContacto: number;
  direccion: string;
  barrio: string;
  correo: string;
  celular: string;
  telefonoFijo: string;
  fkIdCiudad: number,
  nombreCiudad: string;
  razonSocial: string;
  fkIdEmpresa: number;
  fkIdDepartamento: number,
  nombreDepartamento: string;
  fkIdCargo: number,
  nombreTipoDocumento: string;
  nombreCargo: string;
}

export interface DisabilityState {
  idEstadoIncapacidad: number;
  nombreEstadoIncapacidad: string;
}

export interface Salary {
  salarioMinimo: number;
}

export interface Disability {
  radicado: string;
  fkIdTipoIncapacidad: number;
  fkNitEmpresa: number;
  numeroIncapacidad: number;
  fechaInicio: string;
  fechaFin: string;
  totalDias: number;
  ibc: string;
  valor: string;
  cie: string;
  fkIdEstadoIncapacidad: number;
  fkDocumentoPersona: number;
  fkEntidad: number;
}

export interface Adjunto {
  idFiles?: number;
  fkRadicado: number;
  url: string;
  nombreArchivo: string;
  fkIdTipoFile: number
}

export interface InformationDisability {
  idIncapacidad?: number;
  radicado: string;
  fkIdTipoIncapacidad: number;
  fkNitEmpresa: string;
  numeroIncapacidad: number;
  fechaInicio: string;
  fechaFin: string;
  totalDias: number;
  ibc: string;
  valor: number;
  fkIdEstadoIncapacidad: number;
  fkDocumentoPersona: number;
  fkIdArl: string;
  fkIdAfp: string;
  fkIdEps: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  genero: string;
  fechaNacimiento: string;
  fkIdTipoDocumento: number;
  nombreTipoDocumento: string;
  nombreTipoIncapacidad: string;
  codigoDianostico: string;
  nit: string;
  razonSocial: string;
  fkIdTipoEmpresa: number;
  nitArl: string;
  razonSocialArl: string;
  nitAfp: string;
  razonSocialAfp: string;
  nitEps: string;
  razonSocialEps: string;
  nombreEstadoIncapacidad: string;
  files: Adjunto[]
}

export interface DisabilityExtension {
  idProrrogaIncapacidad: number | null;
  fkIdIncapacidad: number;
  fechaIniciaProrroga: string;
  fechaFinProrroga: string;
  diasProrroga: number;
  ibc: number;
  valor: number;
  usuario: number;
  observacion: string;
}

export interface HistoricalDisability {
  idHistorico?: number | null,
  idIncapacidad: number;
  usuario: number,
  nombres: string;
  observaciones: string
}

export interface ResponseDashboard {
  numeroIncapacidades: number;
  totalIncapacidades: number;
  razonSocial?: string;
  nombreEstadoIncapacidad?: string;
}

export interface InfoCie {
  idCodigoCie: number,
  codigo: string,
  descripcion: string,
  idGrupo: number,
  idGrupoCie: number,
  grupoSubgrupo: string
}

export interface LatestDisabilities {
  id: number;
  radicado: string;
  fkIdTipoIncapacidad: number;
  fkNitEmpresa: string;
  numeroIncapacidad: number;
  fechaInicio: string;
  fechaFin: string;
  totalDias: number;
  ibc: string;
  valor: number;
  fkIdEstadoIncapacidad: number;
  fkDocumentoPersona: number;
  fkIdArl: string;
  fkIdAfp: string;
  fkIdEps: string;
  fechaRegistro: string;
}

export interface DisabilityWithCie {
  radicado: number;
  fkIdTipoIncapacidad: number;
  cie: string;
  fkNitEmpresa: string;
  numeroIncapacidad: number;
  fechaInicio: string;
  fechaFin: string;
  totalDias: number;
  ibc: string;
  valor: number;
  fkIdEstadoIncapacidad: number;
  fkDocumentoPersona: number;
  fkEntidad: string;
  fechaRegistro: string;
  nombreEstadoIncapacidad: string;
  nombreTipoIncapacidad: string;
  nitEntidad: string;
  razonSocialEntidad: string;
  empresaEmpleado: string;
  tipoEntidad: string;
  idCodigoCie: number;
  codigo: string;
  descripcion: string;
  idGrupo: number;
  idGrupoCie: number;
  grupoSubgrupo: string;
}

export interface DetailDisability {
  disability: DisabilityWithCie,
  employe: InformationEmploye,
  files: Adjunto[]
  history?: DisabilityExtension[]
}

export interface Actions {
  leer: boolean;
  borrar: boolean;
  update: boolean;
  insert: boolean;
}

export interface Item {
  icon: string;
  text: string;
  route: string;
  actions?: Actions;
}

export interface Modulo {
  modulo: string;
  items: Item[];
}

export interface Permisos {
  modulo: string;
  selected?: boolean;
  items: Item[];
}

export interface PermisosUser {
  idPermisosUsuario: number;
  permisos: string;
  usuario: number;
}

export interface UserToNotification {
  idUsuarioNotificar?: number;
  usuario: number;
  email: string;
  estado: boolean;
}

export interface User extends Persona {
  usuario: number;
  password: string;
  fkIdRol: number;
  estadoUsuario: number;
  fotoPerfil: string;
  avatar: string;
  permisos: Permisos
}

export interface ColumnsExcel {
  header: string;
  key: string;
}

export interface DocumentsAttach {
  documento: string;
}
