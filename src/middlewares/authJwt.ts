import jwt from 'jsonwebtoken'
import config from '../config'
import { encryptedAES } from '../libs/encrypt'
import db from '../database'
import { Request, Response, NextFunction } from 'express'
import { Token } from '../interfaces/auth.models'
import httpError from '../helpers/handleError'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const paramToken:string = req.headers['x-access-token'] as string
    if (!paramToken) return res.status(403).json({ message: 'No ha enviado un token válido', error: 'Para poder realizar operaciones con la API debe enviar un token de autenticación' })

    const decode = jwt.verify(paramToken, config.SECRET) as Token

    const query = 'SELECT base FROM qinspect_planesQi.Empresas WHERE estado != 0'
    db.query(query, (err, rows) => {
      if (!err) {
        if (rows.length > 0) {
          const promesas:Promise<unknown>[] = []
          rows.forEach((bases: any) => {
            const base = bases.base
            const promesa = new Promise((resolve, reject) => {
              const query = `SELECT numeroDocumento, password FROM ${base}.personal WHERE numeroDocumento='${decode.id}' AND password = '${encryptedAES(decode.pwd)}'`
              db.query(query, (err, rows) => {
                if (!err) {
                  resolve(rows[0])
                } else {
                  reject(JSON.stringify({
                    message: 'Error al validar datos del usuario',
                    error: err.message
                  }))
                }
              })
            })
            promesas.push(promesa)
          })
          Promise.all(promesas)
            .then((result) => result.filter((data) => data))
            .then((empresas) => {
              // Validamos si empresas es mayor a 0, si es mayor a 0, entonces la contraseña si coincidio en alguna empresa, caso contrario esta errada
              if (empresas.length > 0) {
                next()
              } else {
                return res.status(401).json({
                  message: 'Oops! Usuario no encontrado',
                  error: 'No hemos encontrado ningun usuario con el token enviado'
                })
              }
            })
            .catch((err) => {
              throw JSON.stringify({
                message: 'Error al validar datos del usuario',
                error: err.message
              })
            })
        } else {
          // Respuesta sin contenido
          res.status(200).json({
            message: 'No se han encontrado empresas'
          })
        }
      } else {
        return httpError(res, req, JSON.stringify({
          message: 'Error al obtener lista de empresas',
          error: err.message
        }), 400)
      }
    })
  } catch (error) {
    return httpError(res, req, JSON.stringify(error), 400)
  }
}
