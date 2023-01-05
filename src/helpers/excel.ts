import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs'
import { executeQuery } from '../functions/global.functions'
import { ColumnsExcel } from 'interfaces/general.models'
import { scriptConsolidaEstadoIncapacidades } from '../scriptSQL/get.scripts'

const dirRoot = path.join(process.cwd(), 'files')

export const generateExcel = async (script: string, columns: ColumnsExcel[], nameFile: string, base: string) => {
  const workbook = new ExcelJS.Workbook()
  // agregamos una hoja de trabajo
  const sheet = workbook.addWorksheet('Hoja 1')

  sheet.columns = [...columns]

  const data = await executeQuery<any[]>(script)

  data.forEach(e => {
    sheet.addRow(e)
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

  if (nameFile === 'empleador') {
    const scriptConsolidado = scriptConsolidaEstadoIncapacidades(base)
    const dataConsolidado = await executeQuery<any[]>(scriptConsolidado)
    // sheet.getCell('AJ1').value = 'ESTADO'
    // sheet.getCell('AK1').value = 'CANTIDAD'
    // sheet.getCell('AL1').value = 'VALOR ESTIMADO'

    let key = 2
    const rowsTable: any[] = []
    dataConsolidado.forEach((e, k) => {
      // sheet.getCell(`AJ${key}`).value = e.nombreEstadoIncapacidad
      // sheet.getCell(`AK${key}`).value = e.cantidad
      // sheet.getCell(`AL${key}`).value = e.valorEstimado
      rowsTable.push([e.nombreEstadoIncapacidad, e.cantidad, e.valorEstimado])
      key++
    })

    sheet.addTable({
      name: 'CONSOLIDADO',
      ref: 'AJ1',
      headerRow: true,
      totalsRow: true,
      style: {
        theme: 'TableStyleDark3',
        showRowStripes: true
      },
      columns: [
        { name: 'ESTADO', totalsRowLabel: 'TOTAL:', filterButton: false },
        { name: 'CANTIDAD', totalsRowFunction: 'sum' },
        { name: 'VALOR ESTIMADO', totalsRowFunction: 'sum' }
      ],
      rows: rowsTable
    })
  }

  // Creamos la carpeta donde se guardaran los archivos, solo si no existe
  if (!fs.existsSync(dirFile)) fs.mkdirSync(dirFile, { recursive: true })

  await sheet.workbook.xlsx.writeFile(`${dirFile}/${nameFile}.xlsx`)
}
