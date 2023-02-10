import { createTransport } from 'nodemailer'
import { MysqlError } from 'mysql'
import db from '../database'
import { columnsTable, DisabilityTable, Notifications, rowsTable, TypeTable } from 'interfaces/general.models'
import { scriptCountDaysDisability, scriptUsersToNotify } from '../scriptSQL/get.scripts'
import { scriptCreateNotification } from '../scriptSQL/post.scripts'

export const executeQuery = <T>(script: string) => {
  return new Promise<T>((resolve, reject) => {
    db.query(script, (error: MysqlError, rows: T) => {
      if (!error) {
        resolve(rows)
      } else {
        reject(error)
      }
    })
  })
}

export const sendEmail = (type: TypeTable, mails: string[], message?: any, rows?: rowsTable[], columnst?: columnsTable[]) => {
  // Host para enviar el email
  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'noreply@multiempleos.com.co',
      pass: 'aacarewushxrkdfe'
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  let contentHTML = ''

  if (type === 'carencia') {
    contentHTML = genreTableEmail(rows!, columnst!, type)
  } else if (type === 'incapacidad') {
    contentHTML = genreTableEmail(rows!, columnst!, type)
  }

  // Configuraciones del remitente del email y contenido del email
  const uniqueMails = [...new Set(mails)]
  uniqueMails.forEach(e => {
    const mailOptions = {
      from: 'Multiempleo <noreply@multiempleos.com.co>', // Remitente del mensaje
      to: e, // Receptor del mensaje
      subject: 'Notificación sistema👋', // Asunto del mensaje
      html: `
        <div style="border: 1px solid #e3e3e3;
          border-radius: 15px;
          padding: 15px;
          min-width: 610px;
          text-align: justify;
          background-image: url('https://qinspecting.com/img/background_email.png');
          background-size: cover;
        ">
          <h3> Hola </h3>
          <p>${message}</p>
          <div>
            ${contentHTML}
          </div>
        </div>
      ` // Contenido html del mensaje
    }
    transporter.sendMail(mailOptions, (err, respuesta) => {
      if (err) {
        throw new Error('Error al enviar email')
      } else {
        return 'Email enviado'
      }
    })
  })
}

const genreTableEmail = (rows: rowsTable[], columns: columnsTable[], type: TypeTable): string => {
  const message = `
    <table style="border: 1px solid #333;">
      <thead style="border: 1px solid #333;">
        ${columns.map(col => {
          return `<th style="border: 1px solid #333;"> ${col.label} </th>`
        }).join('')}
      </thead>
      ${generateRowsTable(rows, type)}
    </table>
  `
  return message
}

const generateRowsTable = (rows: rowsTable[] | DisabilityTable[], type: 'carencia' | 'incapacidad'): string => {
  if (type === 'carencia') {
    const rowsCarencia = [...rows] as rowsTable[]
    return rowsCarencia.map(row => {
      return `<td style="border: 1px solid #333;"> ${row.value} </td>`
    }).join('')
  } else {
    // type === 'incapacidad'
    const rowsIncapacidad = [...rows] as DisabilityTable[]
    return rowsIncapacidad.map(row => {
      return `
      <tr style="border: 1px solid #333;">
        <td style="border: 1px solid #333;">${row.idIncapacidad}</td>
        <td style="border: 1px solid #333;">${row.nombreTipoIncapacidad}</td>
        <td style="border: 1px solid #333;">${row.fkNitEmpresa}</td>
        <td style="border: 1px solid #333;">${row.razonSocial}</td>
        <td style="border: 1px solid #333;">${row.documentoPersona}</td>
        <td style="border: 1px solid #333;">${row.nombres}</td>
        <td style="border: 1px solid #333;">${row.totalDias}</td>
        <td style="border: 1px solid #333;">${row.observaciones}</td>
      </tr>
      `
    }).join('')
  }
}

export const createNotifications = async (base: string) => {
  try {
    const query = scriptCountDaysDisability(base)
    const result = await executeQuery<any[]>(query)
    const usersToNotify = await executeQuery<any[]>(scriptUsersToNotify(base))
    const promesas: any[] = []
    const notifications: any[] = []
    const rows: rowsTable[] = []
    const columns: columnsTable[] = [
      { label: 'ID INCAPACIDAD' },
      { label: 'TIPO INCAPACIDAD' },
      { label: 'NIT EMPRESA' },
      { label: 'NOMBRE EMPRESA' },
      { label: 'DOCUMENTO EMPLEADO' },
      { label: 'NOMBRES EMPLEADOS' },
      { label: 'TOTAL DÍAS' },
      { label: 'OBSERVACIONES' }
    ]
    const mensaje = 'Revisa las novedades con las siguientes incapacidades'

    result.forEach(disability => {
      // Notificaciones para accidente de transito y enfermedad general
      if (disability.fkIdTipoIncapacidad === 1 || disability.fkIdTipoIncapacidad === 2) {
        if (disability.totalDias === 70) {
          disability.observaciones = 'Incapacidad a 10 días de completar 80 días'
          notifications.push({ ...disability, message: `La incapacidad con ID ${disability.idIncapacidad}, está a 10 días de cumpletar 80 días` })
          rows.push(disability)
        } else if (disability.totalDias === 165) {
          disability.observaciones = 'Incapacidad a 15 días de completar 180 días'
          notifications.push({ ...disability, message: `La incapacidad con ID ${disability.idIncapacidad}, está a 15 días de cumpletar 180 días` })
          rows.push(disability)
        }
      }
      // Licencia de maternidad
      if (disability.fkIdTipoIncapacidad === 3) {
        disability.observaciones = 'Incapacidad no debe exceder los 30 días.'
        notifications.push({ ...disability, message: `La incapacidad con ID ${disability.idIncapacidad}, no pueden exceder los 30 días` })
        rows.push(disability)
      }
    })

    const emails: string[] = []

    notifications.forEach(n => {
      usersToNotify.forEach(u => {
        const data: Notifications = {
          idNotificacion: null,
          usuario: u.usuario,
          mensaje: n.message,
          estado: 1
        }
        emails.push(u.email)
        const queryNotification = scriptCreateNotification(base, data)
        promesas.push(executeQuery<any[]>(queryNotification))
      })
    })

    // sendEmail('incapacidad', emails, mensaje, rows, columns)

    await Promise.all(promesas).then(res => res).catch(e => e)
  } catch (error: any) {
    throw new Error(error)
  }
}
