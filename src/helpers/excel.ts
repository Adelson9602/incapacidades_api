import ExcelJS, { Fill } from 'exceljs'
import path from 'path'
import fs from 'fs'
import { executeQuery } from '../functions/global.functions'
import { ColumnsExcel } from 'interfaces/general.models'
import { scriptConsolidadoPorDiagnostico, scriptConsolidaEstadoIncapacidades } from '../scriptSQL/get.scripts'

const dirRoot = path.join(process.cwd(), 'files')

export const generateExcel = async (script: string, columns: ColumnsExcel[], typeFile: string, base: string) => {
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

  const styleFont = {
    bold: true,
    color: {
      argb: 'FFFFFF'
    }
  }

  const styleCell: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D84C4C' },
    bgColor: { argb: 'D84C4C' }
  }

  const rowsTable: any[] = []
  let columnsTable: any[] = []
  let positionTable: string = ''

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'

    // These options are needed to round to whole numbers if that's what you want.
    // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  })

  if (typeFile === 'empleador') {
    const scriptConsolidado = scriptConsolidaEstadoIncapacidades(base)
    const dataConsolidado = await executeQuery<any[]>(scriptConsolidado)
    // sheet.getCell('AJ1').value = 'ESTADO'
    // sheet.getCell('AK1').value = 'CANTIDAD'
    // sheet.getCell('AL1').value = 'VALOR ESTIMADO'

    let key = 2
    let sumCantidad = 0
    let sumValor = 0

    dataConsolidado.forEach((e, k) => {
      sumCantidad = sumCantidad + e.cantidad
      sumValor = sumValor + e.valorEstimado
      rowsTable.push([e.nombreEstadoIncapacidad, e.cantidad, formatter.format(e.valorEstimado)])
      key++
    })

    sheet.getCell(`X${key}`).value = 'TOTAL'
    sheet.getCell(`Y${key}`).value = sumCantidad
    sheet.getCell(`Z${key}`).value = formatter.format(sumValor)

    sheet.getCell(`X${key}`).fill = styleCell
    sheet.getCell(`Y${key}`).fill = styleCell
    sheet.getCell(`Z${key}`).fill = styleCell

    sheet.getCell(`X${key}`).font = styleFont
    sheet.getCell(`Y${key}`).font = styleFont
    sheet.getCell(`Z${key}`).font = styleFont

    columnsTable = [
      { name: 'ESTADO' },
      { name: 'CANTIDAD' },
      { name: 'VALOR ESTIMADO' }
    ]
    positionTable = 'X1'
  } else if (typeFile === 'cliente') {
    let key = 2
    let sumCantidad = 0
    let totalDias = 0
    let sumValor = 0
    let percentage = 0
    const scriptConsolidado = scriptConsolidadoPorDiagnostico(base)
    const dataConsolidado = await executeQuery<any[]>(scriptConsolidado)
    dataConsolidado.forEach((e, k) => {
      sumCantidad = sumCantidad + e.cantidad
      totalDias = totalDias + e.dias
      sumValor = sumValor + e.valorEstimado
      rowsTable.push([e.descripcion, e.cantidad, e.dias, formatter.format(e.valorEstimado)])
      key++
    })
    dataConsolidado.forEach((e, k) => {
      percentage = (100 * e.cantidad) / sumCantidad
      rowsTable[k].push(percentage.toFixed(2))
    })

    sheet.getCell(`T${key}`).value = 'TOTAL'
    sheet.getCell(`U${key}`).value = sumCantidad
    sheet.getCell(`V${key}`).value = totalDias
    sheet.getCell(`W${key}`).value = formatter.format(sumValor)
    // sheet.getCell(`X${key}`).value = percentage

    sheet.getCell(`T${key}`).fill = styleCell
    sheet.getCell(`U${key}`).fill = styleCell
    sheet.getCell(`V${key}`).fill = styleCell
    sheet.getCell(`W${key}`).fill = styleCell

    sheet.getCell(`T${key}`).font = styleFont
    sheet.getCell(`U${key}`).font = styleFont
    sheet.getCell(`V${key}`).font = styleFont
    sheet.getCell(`W${key}`).font = styleFont

    columnsTable = [
      { name: 'DIAGNÓSTICOS' },
      { name: 'CANTIDAD' },
      { name: 'DÍAS' },
      { name: 'VALOR' },
      { name: '%' }
    ]
    positionTable = 'T1'
  }

  if (typeFile === 'empleador' || typeFile === 'cliente') {
    sheet.addTable({
      name: 'Consolidado',
      ref: positionTable,
      headerRow: true,
      style: {
        theme: 'TableStyleLight1',
        showRowStripes: true
      },
      columns: columnsTable,
      rows: rowsTable
    })
  }

  // Creamos la carpeta donde se guardaran los archivos, solo si no existe
  if (!fs.existsSync(dirFile)) fs.mkdirSync(dirFile, { recursive: true })

  await sheet.workbook.xlsx.writeFile(`${dirFile}/${typeFile}.xlsx`)

  return `${typeFile}.xlsx`
}
