import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import jwt from 'jsonwebtoken'
import db from '../database'
import { encryptedAES } from '../libs/encrypt'
import config from '../config'

export const postLogin = async (req: Request, res: Response) => {
  try {
    const { usuario, password } = req.body
    console.log(db)
    console.log(jwt)
    console.log(encryptedAES)
    console.log(config)
    console.log(usuario)
    console.log(password)
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}
