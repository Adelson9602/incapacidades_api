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

export interface Beneficiario {
  isDelete: boolean;
  idPersona: number;
  idParentezcoBeneficiario: number;
  idTipoDocumentoBeneficiario: number;
  identificacionBeneficiario: string;
  primerNombreBeneficiario: string;
  segundoNombreBeneficiario: string;
  primerApellidoBeneficiario: string;
  segundoApellidoBeneficiario: string;
  fechaNacimientoBeneficiario: string;
  sexoBeneficiario: string;
  copiaIdentificacionBeneficiario: Adjunto;
  copiaCartaConyugueBeneficiario?: Adjunto;
}

export interface Afiliacion {
  idAfiliacion: number;
  idUsuarioRadica: number;
  idTipoAfiliado: number;
  idAfp: number;
  idArl: number;
  idPersona: number;
  idTipoAfiliacion: number;
  nombreTipoAfiliacion: string;
  idIps: number;
  estadoAfiliacion: number;
  fechaRegistroAfiliacion: string;
  epsAnteriorCotizante: string;
  codigo: string;
  fechaRetiro: string;
  idTipoDocumentoCotizante: number;
  identificacionCotizante: string;
  primerNombreCotizante: string;
  segundoNombreCotizante: string;
  primerApellidoCotizante: string;
  segundoApellidoCotizante: string;
  fechaNacimientoCotizante: string;
  salarioCotizante: string;
  sexoCotizante: string;
  correoCotizante: string;
  celularCotizante: string;
  direccionCotizante: string;
  idCiudadCotizante: number;
  localidadComuna: string;
  zonaCotizante: string;
  idDepartamentoCotizante: number;
  idEmpresaCotizante: number;
  copiaIdentificacionCotizante: Adjunto;
  copiaRutCotizante: Adjunto;
  copiaContratoCotizante: Adjunto;
  beneficiarios: Beneficiario[];
}

export interface Ips {
  id: number;
  idEps: number;
  idCiudad: number;
  nombre: string;
  identificacion: string;
  fechaRegistro: string;
  estado: number;
  direccion: string;
  telefono: string;
}

export interface Entidad {
  tipoEntidad: null;
  id: number;
  tabla: string;
  idTipoDocumento: number;
  nombre: string;
  identificacion: string;
  estado: number;
  telefono: string;
  idCiudad: number;
  correo: string;
  direccion: string;
  localidad: string;
  idEps: null;
}

export interface Empresa {
  id: number;
  idTipoDocumento: number;
  nombre: string;
  identificacion: string;
  fechaRegistro: string;
  estado: number;
  telefono: string;
  idCiudad: number;
  correo: string;
  direccion: string;
}

export interface Option {
  label: string;
  value: number;
  idDepartamento: number;
}

export interface Departamento {
  label: string;
  value: number;
  ciudades: Option[];
}
