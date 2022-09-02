import { ResultSql } from '../interfaces/get.models'
import { MysqlError } from 'mysql'
import db from '../database'

export const executeQuery = <T>(script: string, isCreate: boolean) => {
  if (isCreate) {
    return new Promise<ResultSql>((resolve, reject) => {
      db.query(script, (error: MysqlError, rows: ResultSql) => {
        if (!error) {
          resolve(rows)
        } else {
          reject(error)
        }
      })
    })
  }
  return new Promise<T>((resolve, reject) => {
    db.query(script, (error: MysqlError, rows: T) => {
      if (!error) {
        resolve(rows)
      } else {
        reject(error)
      }
    })
  })
}
