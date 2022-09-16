import { MysqlError } from 'mysql'
import db from '../database'

export const executeQuery = <T>(script: string) => {
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
