import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import { executeQuery } from '../functions/global.functions'
import { sccriptCreateUser, scriptContacCompany, scriptCreateCompany, scriptCreateContacto, scriptCreatePerson, scriptCreateTpCp, scriptDisabilityType } from '../scriptSQL/post.scripts'
import { ResultSql } from '../interfaces/get.models'
import { scriptValidateTpCompany } from '../scriptSQL/get.scripts'
import { TypeCompany } from 'interfaces/post.models'

export const insertUser = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
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
    const base:string = req.headers.base as string
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
    const base:string = req.headers.base as string
    const script = scriptCreateCompany(req.body, base)
    const scriptContact = scriptCreateContacto(req.body, base)
    const company = await executeQuery<ResultSql[]>(`${script}${scriptContact}`).then(([, contact]) => {
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
    const base:string = req.headers.base as string
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
