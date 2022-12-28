import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs'
import { executeQuery } from '../functions/global.functions'
import { ColumnsExcel } from 'interfaces/general.models'

const dirRoot = path.join(process.cwd(), 'files')

export const generateExcel = async (script: string, columns: ColumnsExcel[], nameFile: string) => {
  const workbook = new ExcelJS.Workbook()
  // agregamos una hoja de trabajo
  const sheet = workbook.addWorksheet('Primera hoja')

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
  // Creamos la carpeta donde se guardaran los archivos, solo si no existe
  if (!fs.existsSync(dirFile)) fs.mkdirSync(dirFile, { recursive: true })

  await sheet.workbook.xlsx.writeFile(`${dirFile}/${nameFile}.xlsx`)
}
