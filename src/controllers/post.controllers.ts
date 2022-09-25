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
  scriptCreateInability
} from '../scriptSQL/post.scripts'
import {
  scriptValidatePosition,
  scriptValidateTpCompany
} from '../scriptSQL/get.scripts'
import { TypeCompany, ResultSql } from 'interfaces/general.models'

export const insertUser = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const script = scriptCreatePerson(req.body, base)
    const result = await executeQuery<ResultSql>(script).then(() => {
      const query = sccriptCreateUser(req.body, base)
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
      res.json({
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
    const scriptContact = scriptCreateContacto(req.body, base)
    const company = await executeQuery<ResultSql[]>(`${script}${scriptContact}`).then(([, contact]) => {
      // Registra el la tabla contactoEmpresa
      const scriptRelation = scriptContacCompany({
        fkNit: req.body.nit,
        fkidContacto: req.body.fkidContacto || contact.insertId
      }, base)
      return executeQuery<ResultSql>(scriptRelation)
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

export const createPerson = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const { documentoPersona, fkIdCargo, fkIdContacto } = req.body

    const script = scriptCreatePerson(req.body, base)
    const scriptContact = scriptCreateContacto(req.body, base)
    const result = await executeQuery<ResultSql[]>(`${script}${scriptContact}`)
      .then(([, contact]) => {
        // Registra el la tabla contactoPersona
        const query = scriptContacPerson({
          fkIdContacto: fkIdContacto || contact.insertId,
          fkDocumentoPersona: documentoPersona
        }, base)
        return executeQuery<ResultSql>(query)
      })
      .then((responseContact) => {
        // Se ejecuta si es empleado
        if (req.body.isEmploye) {
          return executeQuery<ResultSql>(scriptEmploye({
            fkDocumentoPersona: documentoPersona,
            fkIdCargo
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
      res.json({
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
    const { nombreCargo } = req.body
    const resultValidate = await executeQuery<TypeCompany[]>(
      scriptValidatePosition(nombreCargo, base)
    )
    if (resultValidate.length > 0) {
      res.json({
        message: 'Este cargo ya está registrado',
        data: resultValidate
      })
    } else {
      const script = scriptCreateStateInability(req.body, base)
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

export const createInability = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const query = scriptCreateInability(req.body, base)
    const result = await executeQuery<TypeCompany[]>(query)
    res.status(200).json({
      message: 'Incapacidad registrada',
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
