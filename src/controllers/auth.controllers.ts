import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import jwt from 'jsonwebtoken'
import db from '../database'
import { encryptedAES } from '../libs/encrypt'
import config from '../config'
import { UserData } from 'interfaces/auth.models'
import { scriptGetUser } from '../scriptSQL/get.scripts'

export const postLogin = async (req: Request, res: Response) => {
  try {
    const { usuario, password } = req.body
    const query = scriptGetUser(true, req.body)

    db.query(query, async (error, rows) => {
      if (!error) {
        if (rows.length > 0) {
          const [userData] = rows as UserData[]
          if (userData.password === (encryptedAES(password))) {
            const token = jwt.sign(
              { id: usuario },
              config.SECRET,
              { expiresIn: 86400 }
            )
            // Exponemos el token en los headers de la petición
            res.header('Auth-Token', token)
            res.header('Access-Control-Expose-Headers', 'Auth-Token')
            res.status(200).json({
              message: `Bienvenido ${userData.primerNombre} ${userData.primerApellido}`,
              data: userData
            })
            return
          } else {
            return res.status(401).json({
              message: 'Contraseña Incorrecta, Verifique la contraseña.'
            })
          }
        }
        return res.status(401).json({
          message: 'Oops! Usuario no encontrado.'
        })
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al iniciar sesión',
          error: error.message,
          completeError: error
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}
