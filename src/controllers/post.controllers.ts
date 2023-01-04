import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import { executeQuery } from '../functions/global.functions'
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
  scriptHistoryInability,
  scriptCreateInability,
  scriptCreateRol,
  scriptCreateDocumentType,
  scriptCreateDepartment,
  scriptCreateCity,
  scriptSaveFile,
  scriptCreatePermissionsUser
} from '../scriptSQL/post.scripts'
import {
  scriptValidatePosition,
  scriptValidateTpCompany
} from '../scriptSQL/get.scripts'
import { TypeCompany, ResultSql, Adjunto } from 'interfaces/general.models'

export const insertUser = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const script = scriptCreatePerson(req.body, base)
    const result = await executeQuery<ResultSql>(script).then(() => {
      const query = sccriptCreateUser(req.body, base)
      return executeQuery<ResultSql>(query)
    }).then((result) => {
      const query = scriptCreatePermissionsUser(req.body.permisos, base)
      return executeQuery<ResultSql>(query)
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
    const { documentoPersona, fkIdCargo, fkIdContacto, fkIdEmpresa } = req.body

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
      .then((responseContact) => {
        // Se ejecuta si es empleado
        if (req.body.isEmploye) {
          return executeQuery<ResultSql>(scriptEmploye({
            fkDocumentoPersona: documentoPersona,
            fkIdCargo,
            fkIdEmpresa
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

export const createHistoryInability = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const query = scriptHistoryInability(req.body, base)
    const result = await executeQuery<TypeCompany[]>(query)
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
