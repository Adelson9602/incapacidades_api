import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import jwt from 'jsonwebtoken'
import db from '../database'
import { encryptedAES } from '../libs/encrypt'
import config from '../config'
import { scriptGetBases, scriptGetUser } from '../scriptSQL/auth.scripts'
import { Cliente, UserData } from '../interfaces/auth.models'
import { MysqlError } from 'mysql'

export const postLogin = async (req: Request, res: Response) => {
  try {
    const { usuario, password } = req.body

    const script = scriptGetBases()
    db.query(script, (error: MysqlError, rows: Cliente[]) => {
      if (!error) {
        if (rows.length > 0) {
          const promises: Promise<any>[] = []

          rows.forEach((empresa) => {
            const scriptUser = scriptGetUser(empresa.nombreBase, usuario, encryptedAES(password))
            console.log(scriptUser)
            promises.push(new Promise((resolve, reject) => {
              db.query(scriptUser, (error: MysqlError, [dataUser]: UserData[]) => {
                if (!error) {
                  if (dataUser) {
                    empresa.dataUser = dataUser
                    resolve(empresa)
                  } else {
                    resolve(null)
                  }
                } else {
                  reject(JSON.stringify({
                    message: 'Error al consultar datos del usuario',
                    error: error.message,
                    completeError: error
                  }))
                }
              })
            }))
          })

          Promise.all(promises).then(resUser => {
            const result = resUser.filter(data => data)
            if (result.length > 0) {
              const token = jwt.sign(
                { id: usuario },
                process.env.SECRET_KEY || config.SECRET_KEY,
                { expiresIn: 86400 }
              )
              // Exponemos el token en los headers de la petición
              res.header('Auth-Token', token)
              res.header('Access-Control-Expose-Headers', 'Auth-Token')
              res.json(result)
            } else {
              res.status(401).json({
                message: 'Usuario o contraseña erronea, intente nuevamente'
              })
            }
          }).catch(error => {
            httpError(res, req, error, 400)
          })
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar empresas',
          error: error.message,
          completeError: error
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}
