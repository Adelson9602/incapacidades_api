import {
  Request,
  Response
} from 'express'
import {
  sccriptCreateUser,
  scriptCreatePerson,
  scriptSubscribeNotification
} from '../scriptSQL/post.scripts'
import { executeQuery } from '../functions/global.functions'
import httpError from '../helpers/handleError'
import { encryptedAES } from '../helpers/encrypt'
import {
  ResultSql,
  UserToNotification
} from '../interfaces/general.models'
import {
  scriptUpdateStatusDisability,
  scriptRestoreDisability,
  scriptUpdateStatusNotification
} from '../scriptSQL/put.scripts'
import { scriptGetUser } from '../scriptSQL/auth.scripts'

export const putChangeStateDisability = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const { estado, idIncapacidad } = req.body
    const query = scriptUpdateStatusDisability(base, idIncapacidad, estado)
    const result = await executeQuery<ResultSql>(query)
    res.status(200).json({
      message: 'Estado actualizdo',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const putUpdateStateNotification = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const { estado, idNotificacion } = req.body
    const query = scriptUpdateStatusNotification(base, idNotificacion, estado)
    const result = await executeQuery<ResultSql>(query)
    res.status(200).json({
      message: 'Actualizado',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const { body } = req
    const script = scriptCreatePerson(body, base)
    const [result] = await executeQuery<any[]>(script).then(() => {
      const query = sccriptCreateUser(body, base)
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
    }).then(() => {
      const scriptUser = scriptGetUser(base, body.usuario, encryptedAES(body.password))
      return executeQuery<any[]>(scriptUser)
    })
    res.json({
      message: 'Datos actualizados',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}

export const restoreDisability = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { numeroIncapacidad } = req.params
    const query = scriptRestoreDisability(base, +numeroIncapacidad)
    await executeQuery<ResultSql>(query)
    res.status(200).json({
      message: 'Incapacidad restaurada'
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al restaurar incapacidad',
      error: error.message,
      completeError: error
    }), 400)
  }
}
