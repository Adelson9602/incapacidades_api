import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import db from '../database'
import { scriptDocumentsType, scriptRols } from '../scriptSQL/get.scripts'

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
    const query = scriptRols()
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
    const query = scriptDocumentsType()
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
