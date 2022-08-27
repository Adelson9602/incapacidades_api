import { Request, Response } from 'express'
import logger from './logger'

const httpError = (res: Response, req: Request, customError: string, status: number, error?: string) => {
  logger.error(JSON.stringify({
    path: req?.url,
    body: req?.body,
    params: req?.params,
    error: JSON.parse(customError)
  }))
  if (error) {
    logger.error(error)
  }
  res.status(status || 400).json(JSON.parse(customError))
}

export default httpError
