import { createTransport } from 'nodemailer'
import { MysqlError } from 'mysql'
import db from '../database'
import { columnsTable, rowsTable } from 'interfaces/general.models'

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

export const sendEmail = (type: 'carencia', mails: string[], message?: any, rows?: rowsTable[], columnst?: columnsTable[]) => {
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
    contentHTML = genreTableEmail(rows!, columnst!)
  }

  // Configuraciones del remitente del email y contenido del email
  mails.forEach(e => {
    const mailOptions = {
      from: 'Multiempleo <noreply@multiempleos.com.co>', // Remitente del mensaje
      to: e, // Receptor del mensaje
      subject: 'Notificación sistema👋', // Asunto del mensaje
      html: `
        <div style="border: 1px solid #e3e3e3;
          border-radius: 15px;
          padding: 15px;
          width: 610px;
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

const genreTableEmail = (rows: rowsTable[], columns: columnsTable[]): string => {
  const message = `
    <table style="border: 1px solid #333;">
      <thead style="border: 1px solid #333;">
        ${columns.map(col => {
          return `<th style="border: 1px solid #333;"> ${col.label} </th>`
        }).join('')}
      </thead>
      <tr style="border: 1px solid #333;">
        ${rows.map(row => {
          return `<td style="border: 1px solid #333;"> ${row.value} </td>`
        }).join('')}
      </tr>
    </table>
  `
  return message
}
