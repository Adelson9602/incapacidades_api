import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import db from '../database'
import { scriptCompanies, scriptDocumentsType, scriptRols, scriptUsers } from '../scriptSQL/get.scripts'

export const getMenu = (req: Request, res: Response) => {
  try {
    const query = 'SELECT id, nombre FROM eps WHERE estado = 1'
    db.query(query, (err, rows) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar eps para el menu',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getRols = (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptRols(base)
    db.query(query, (err, rows) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar roles',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getDocumentsType = (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptDocumentsType(base)
    db.query(query, (err, rows) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar tipos de documentos',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getUsers = (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptUsers(base)
    db.query(query, (err, rows) => {
      if (!err) {
        res.status(200).json(rows)
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar usuarios',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getCompanies = (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptCompanies(base)
    db.query(query, (err, rows) => {
      if (!err) {
        res.status(200).json(rows)
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar empresas',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getCompany = (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { nit } = req.params
    const query = scriptCompanies(base, nit)
    db.query(query, (err, rows) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows[0])
        } else {
          res.status(400).json({
            message: 'Empresa no econtrada'
          })
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar empresa',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}
