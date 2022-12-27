import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs'
import { executeQuery } from '../functions/global.functions'
import { scriptReportExcel } from '../scriptSQL/get.scripts'

const dirRoot = path.join(process.cwd(), 'files')

export const generateExcel = async (base: string) => {
  const workbook = new ExcelJS.Workbook()
  // agregamos una hoja de trabajo
  const sheet = workbook.addWorksheet('Primera hoja')

  sheet.columns = [
    { header: 'Numero de consecutivo', key: 'idIncapacidad' },
    { header: 'Fecha radicado', key: 'fechaRegistro' },
    { header: 'Empresa', key: 'phone' },
    { header: 'Centro de costos', key: 'genre' },
    { header: 'Nombre centro de costos', key: 'function' },
    { header: 'Empresa Cliente', key: 'razonSocial' },
    { header: 'Cargo', key: 'nombreCargo' },
    { header: 'Tipo documento', key: 'nombreTipoDocumento' },
    { header: 'Documento', key: 'fkDocumentoPersona' },
    { header: 'Nombre y Apellido', key: 'nombresApellidos' },
    { header: 'Ciudad', key: 'Ciudad' },
    { header: 'IBC', key: 'ibc' },
    { header: 'Entidad (EPS /ARL)', key: 'razonSocialEntidad' },
    { header: 'Número incapacidad', key: 'numeroIncapacidad' },
    { header: 'Tipo incapacidad', key: 'nombreTipoIncapacidad' },
    { header: 'Diagnóstico', key: 'cie' },
    { header: 'Nombre de Diagnóstico', key: 'nombreCodigoCie' },
    { header: 'Fecha inicial', key: 'fechaInicio' },
    { header: 'Fecha final', key: 'fechaFin' },
    { header: 'Días incapacidad', key: 'totalDias' },
    { header: 'Caso 180', key: 'caso180' },
    { header: 'Días a recobrar', key: 'diasARecobrar' },
    { header: 'Días pagados', key: 'diasARecobrar' },
    { header: 'Prorroga', key: 'prorroga' },
    { header: 'Valor incapacidad', key: 'valor' },
    { header: 'Estado', key: 'nombreEstadoIncapacidad' },
    { header: 'Valor reconocido', key: 'valorReconocido' },
    { header: 'Fecha pago', key: 'fechaPago' },
    { header: 'Causal rechazo', key: 'Causal rechazo' },
    { header: 'Descripción rechazo', key: 'descripcionRechazo' },
    { header: 'Observaciones', key: 'observaciones' },
    { header: 'Fecha proceso derecho de peticion', key: 'fechaDerechoPeticion' },
    { header: 'Fecha proceso derecho de tutela', key: 'fechaDerechoTutela' },
    { header: 'Sentencia', key: 'sentencia' }
  ]

  const data = await executeQuery<any[]>(scriptReportExcel(base))

  data.forEach(e => {
    sheet.addRow({
      idIncapacidad: e.idIncapacidad,
      fechaRegistro: e.fechaRegistro,
      phone: e.phone,
      genre: e.genre,
      function: e.function,
      razonSocial: e.razonSocial,
      nombreCargo: e.nombreCargo,
      nombreTipoDocumento: e.nombreTipoDocumento,
      fkDocumentoPersona: e.fkDocumentoPersona,
      nombresApellidos: e.nombresApellidos,
      Ciudad: e.Ciudad,
      ibc: e.ibc,
      razonSocialEntidad: e.razonSocialEntidad,
      numeroIncapacidad: e.numeroIncapacidad,
      nombreTipoIncapacidad: e.nombreTipoIncapacidad,
      cie: e.cie,
      nombreCodigoCie: e.nombreCodigoCie,
      fechaInicio: e.fechaInicio,
      fechaFin: e.fechaFin,
      totalDias: e.totalDias,
      caso180: e.caso180,
      diasARecobrar: e.diasARecobrar,
      prorroga: e.prorroga,
      valor: e.valor,
      nombreEstadoIncapacidad: e.nombreEstadoIncapacidad,
      valorReconocido: e.valorReconocido,
      fechaPago: e.fechaPago,
      Causal: e.Causal,
      descripcionRechazo: e.descripcionRechazo,
      observaciones: e.observaciones,
      fechaDerechoPeticion: e.fechaDerechoPeticion,
      fechaDerechoTutela: e.fechaDerechoTutela,
      sentencia: e.sentencia
    })
  })

  sheet.getRow(1).font = {
    bold: true,
    color: {
      argb: 'D84C4C'
    }
  }

  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    bgColor: {
      argb: '5E4CD8'
    }
  }
  const dirFile = path.join(dirRoot, 'reports_excel')
  // Creamos la carpeta donde se guardaran los archivos, solo si no existe
  if (!fs.existsSync(dirFile)) fs.mkdirSync(dirFile, { recursive: true })

  await sheet.workbook.xlsx.writeFile(`${dirFile}/test2.xlsx`)
}
