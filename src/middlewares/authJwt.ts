import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import db from '../database'
import config from '../config'
import { Token, UserData } from '../interfaces/auth.models'
import httpError from '../helpers/handleError'
import { MysqlError } from 'mysql'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const paramToken:string = req.headers['x-access-token'] as string
    const base:string = req.headers.base as string
    if (!paramToken) return res.status(403).json({ message: 'No ha enviado un token válido', error: 'Para poder realizar operaciones con la API debe enviar un token de autenticación' })
    if (!base) return res.status(403).json({ message: 'No ha enviado un nombre de base de datos', error: 'Para poder realizar operaciones con la API debe especificar la base con la que operará' })

    const decode = jwt.verify(paramToken, process.env.SECRET_KEY || config.SECRET_KEY) as Token

    const query = `SELECT * FROM ${base}.usuarios WHERE usuario = '${decode.id}';`

    db.query(query, async (error: MysqlError, rows: UserData[]) => {
      if (!error) {
        if (rows.length === 0) return res.status(404).json({ message: 'Oops! Usuario no encontrado' })
        next()
      } else {
        throw JSON.stringify({
          message: 'Error al obtener datos del usuario',
          error: error.message
        })
      }
    })
  } catch (error: any) {
    if (error.message === 'jwt expired') {
      return res.status(401).json({
        message: 'Token ha expirado, vuelva a autenticarse'
      })
    }
    httpError(res, req, `${error}`, 400)
  }
}
