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
