import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import { executeQuery, sendEmail } from '../functions/global.functions'
import {
  sccriptCreateUser,
  scriptContacCompany,
  scriptContacPerson,
  scriptCreateCompany,
  scriptCreateContacto,
  scriptCreatePerson,
  scriptCreatePosition,
  scriptCreateStateInability,
  scriptCreateTpCp,
  scriptDisabilityType,
  scriptEmploye,
  scriptDisabilityExtension,
  scriptCreateInability,
  scriptCreateRol,
  scriptCreateDocumentType,
  scriptCreateDepartment,
  scriptCreateCity,
  scriptSaveFile,
  scriptCreatePermissionsUser,
  scriptHistoricalDisability,
  scriptSubscribeNotification,
  scriptCreateNotification,
  scriptCreateTypeOfDocumentToAttach
} from '../scriptSQL/post.scripts'
import {
  scriptCountDaysDisability,
  scriptUsersToNotify,
  scriptValidatePosition,
  scriptValidateTpCompany
} from '../scriptSQL/get.scripts'
import { TypeCompany, ResultSql, Adjunto, UserToNotification } from 'interfaces/general.models'
import { Notifications, columnsTable, rowsTable } from '../interfaces/general.models'

export const insertUser = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const body: any = req.body
    const { permisos } = req.body
    const script = scriptCreatePerson(body, base)
    const result = await executeQuery<ResultSql>(script).then(() => {
      const query = sccriptCreateUser(body, base)
      return executeQuery<ResultSql>(query)
    }).then((result) => {
      const query = scriptCreatePermissionsUser(permisos, base)
      return executeQuery<ResultSql>(query)
    }).then((result) => {
      if (body.isNotified || body.idUsuarioNotificar) {
        const data: UserToNotification = {
          email: `${body.email}`,
          usuario: body.usuario || 0,
          estado: body.isNotified
        }
        const query = scriptSubscribeNotification(data, base)
        return executeQuery<ResultSql>(query)
      } else {
        return result
      }
    })
    res.json({
      message: 'Datos guardados',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createTypeCompany = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const { nombreTipoEmpresa } = req.body
    const resultValidate = await executeQuery<TypeCompany[]>(scriptValidateTpCompany(nombreTipoEmpresa, base))
    if (resultValidate.length > 0) {
      res.status(400).json({
        message: 'Este tipo de empresa ya esta registrado',
        data: resultValidate
      })
    } else {
      const script = scriptCreateTpCp(req.body, base)
      const result = await executeQuery<ResultSql>(script)
      res.json({
        message: 'Datos guardado',
        data: result
      })
    }
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createCompany = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const script = scriptCreateCompany(req.body, base)
    const scriptContact = req.body.oldNit ? '' : scriptCreateContacto(req.body, base)
    const company = await executeQuery<ResultSql[] | ResultSql>(`${script}${scriptContact}`).then((response) => {
      if (!req.body.oldNit) {
        const [, contact] = response as ResultSql[]
        // Registra el la tabla contactoEmpresa
        const scriptRelation = scriptContacCompany({
          fkNit: req.body.nit,
          fkidContacto: req.body.fkidContacto || contact.insertId
        }, base)
        return executeQuery<ResultSql>(scriptRelation)
      } else {
        return response
      }
    })

    res.json({
      message: 'Datos guardados',
      data: company
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createDisabilityType = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const script = scriptDisabilityType(req.body, base)
    const response = await executeQuery<ResultSql>(script)

    res.json({
      message: 'Datos guardados',
      data: response
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createDepartament = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const script = scriptCreateDepartment(req.body, base)
    const response = await executeQuery<ResultSql>(script)

    res.json({
      message: 'Datos guardados',
      data: response
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createCity = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const script = scriptCreateCity(req.body, base)
    const response = await executeQuery<ResultSql>(script)

    res.json({
      message: 'Datos guardados',
      data: response
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createPerson = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const {
      documentoPersona,
      fkIdCargo,
      fkIdContacto,
      fkIdEmpresa,
      fechaInicioLaboral,
      primerNombre,
      primerApellido
    } = req.body

    const script = scriptCreatePerson(req.body, base)
    const scriptContact = scriptCreateContacto(req.body, base)
    const result = await executeQuery<ResultSql[] | ResultSql>(`${script}${scriptContact}`)
      .then((response) => {
        if (!req.body.oldDocumentoPersona) {
          const [, contact] = response as ResultSql[]
          // Registra el la tabla contactoEmpresa
          const scriptRelation = scriptContacPerson({
            fkDocumentoPersona: documentoPersona,
            fkIdContacto: fkIdContacto || contact.insertId
          }, base)
          return executeQuery<ResultSql>(scriptRelation)
        } else {
          return response
        }
      })
      .then(async (responseContact) => {
        // Se ejecuta si es empleado
        if (req.body.isEmploye) {
          const firstDate = new Date(fechaInicioLaboral)
          const secondDate = new Date(Date.now())
          const timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime())
          const differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24))
          if (differentDays <= 30) {
            const usersToNotify = await executeQuery<any[]>(scriptUsersToNotify(base))
            const promesas: any[] = []
            const mails: string[] = []
            usersToNotify.forEach(u => {
              const mensaje = `Empleado identificado con CC. ${documentoPersona}, está en periodo de carencia`
              const data: Notifications = {
                idNotificacion: null,
                usuario: u.usuario,
                mensaje,
                estado: 1
              }
              mails.push(u.email)
              const queryNotification = scriptCreateNotification(base, data)
              promesas.push(executeQuery<any[]>(queryNotification))
            })

            const columns: columnsTable[] = [
              { label: 'DOCUMENTO EMPLEADO' },
              { label: 'NOMBRES EMPLEADO' },
              { label: 'FECHA DE INGRESO LABORAL' }
            ]

            const rows: rowsTable[] = [
              { value: documentoPersona },
              { value: `${primerNombre} ${primerApellido}` },
              { value: `${fechaInicioLaboral}` }
            ]

            const mensaje = 'Hemos encontrado que hay empleados que estan en periodo de carencia'

            sendEmail('carencia', mails, mensaje, rows, columns)

            await Promise.all(promesas).then(res => res).catch(e => e)
          }

          return executeQuery<ResultSql>(scriptEmploye({
            fkDocumentoPersona: documentoPersona,
            fkIdCargo,
            fkIdEmpresa,
            fechaInicioLaboral
          }, base))
        }
        return responseContact
      })
    res.json({
      message: 'Datos guardados',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createPosition = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const { nombreCargo } = req.body
    const resultValidate = await executeQuery<TypeCompany[]>(
      scriptValidatePosition(nombreCargo, base)
    )
    if (resultValidate.length > 0) {
      res.status(400).json({
        message: 'Este cargo ya está registrado',
        data: resultValidate
      })
    } else {
      const script = scriptCreatePosition(req.body, base)
      const result = await executeQuery<ResultSql>(script)
      res.json({
        message: 'Datos guardado',
        data: result
      })
    }
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createStateInability = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const script = scriptCreateStateInability(req.body, base)
    const result = await executeQuery<ResultSql>(script)
    res.json({
      message: 'Datos guardado',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createInability = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const query = scriptCreateInability(req.body, base)
    // Guarda la incapacidad
    const result = await executeQuery<ResultSql>(query)

    let response: any = null
    // Guarda los archivos de la incapacidad
    if (req.body.files.length > 0) {
      let queryFile = ''
      req.body.files.forEach((element: Adjunto) => {
        element.fkRadicado = req.body.radicado ? req.body.radicado : result.insertId
        queryFile = queryFile + scriptSaveFile(element, base)
      })
      const resultFiles = await executeQuery<ResultSql[]>(queryFile)
      response = {
        ...result,
        ...resultFiles
      }
    } else {
      response = {
        ...result
      }
    }
    res.status(200).json({
      message: 'Incapacidad registrada',
      data: response
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createDisabilityExtension = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const query = scriptDisabilityExtension(req.body, base)
    const result = await executeQuery<ResultSql>(query)
    res.status(200).json({
      message: 'Prorroga de incapacidad registrada',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createHistoryInability = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const query = scriptHistoricalDisability(base, req.body)
    const result = await executeQuery<ResultSql>(query)
    res.status(200).json({
      message: 'Historial de incapacidad registrada',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createRol = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const query = scriptCreateRol(req.body, base)
    const result = await executeQuery<TypeCompany[]>(query)
    res.status(200).json({
      message: 'Datos guardados',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createDucumentType = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const query = scriptCreateDocumentType(req.body, base)
    const result = await executeQuery<TypeCompany[]>(query)
    res.status(200).json({
      message: 'Datos guardados',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const createNotifications = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
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

    sendEmail('incapacidad', emails, mensaje, rows, columns)

    const resultN = await Promise.all(promesas).then(res => res).catch(e => e)

    res.status(200).json(resultN)
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const createTypeOfDocumentToAttach = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const query = scriptCreateTypeOfDocumentToAttach(base, req.body)
    const result = await executeQuery<ResultSql>(query)
    res.status(200).json({
      message: 'Datos guardados',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}
