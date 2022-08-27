import { Request, Response } from 'express'
import db from '../database'
import httpError from '../helpers/handleError'
import { ResultSql, Beneficiario } from '../interfaces/get.models'
import { scriptDeleteBeneficiario } from '../scriptSQL/delete.scripts'
import {
  scriptCreatePerson,
  scriptCreateContacto,
  scriptCreateUser,
  scriptCreateEmpresa,
  scriptCreateEntidad
} from '../scriptSQL/post.scripts'

export const insertAfiliacion = async (req: Request, res: Response) => {
  try {
    const {
      idPersona,
      idUsuarioRadica,
      estadoAfiliacion,
      idTipoDocumentoCotizante,
      identificacionCotizante,
      primerNombreCotizante,
      segundoNombreCotizante,
      primerApellidoCotizante,
      segundoApellidoCotizante,
      fechaNacimientoCotizante,
      salarioCotizante,
      correoCotizante,
      celularCotizante,
      direccionCotizante,
      idEmpresaCotizante,
      idCiudadCotizante,
      localidadComuna,
      zonaCotizante,
      sexoCotizante,
      copiaIdentificacionCotizante,
      copiaContratoCotizante,
      copiaRutCotizante,
      epsAnteriorCotizante,
      codigoAfiliacion,
      idTipoAfiliado,
      idTipoAfiliacion,
      idAfp,
      idArl,
      idIps,
      fechaRetiro,
      beneficiarios
    } = req.body

    const promisePersona = new Promise<ResultSql>((resolve, reject) => {
      const query = `INSERT INTO persona(id, idtipodocumento, identificacion, primernombre, segundonombre, primerapellido, segundoapellido, fechanacimiento, sexo, salario) VALUES (?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE idtipodocumento='${idTipoDocumentoCotizante}', identificacion='${identificacionCotizante}', primernombre='${primerNombreCotizante}', segundonombre='${segundoNombreCotizante || ''}', primerapellido='${primerApellidoCotizante}', segundoapellido='${segundoApellidoCotizante || ''}', fechanacimiento='${fechaNacimientoCotizante}', sexo='${sexoCotizante}', salario='${salarioCotizante}'`
      db.query(query, [
        idPersona,
        idTipoDocumentoCotizante,
        identificacionCotizante,
        primerNombreCotizante,
        segundoNombreCotizante,
        primerApellidoCotizante,
        segundoApellidoCotizante,
        fechaNacimientoCotizante,
        sexoCotizante,
        salarioCotizante
      ], (err, rows) => {
        if (!err) {
          resolve(rows)
        } else {
          reject(new Error(JSON.stringify({
            message: 'Error al guardar afiliación',
            error: err.message,
            completeError: err
          })))
        }
      })
    })

    const resAfiliacion = await promisePersona.then(async (resPerson) => {
      return new Promise<ResultSql>((resolve, reject) => {
        const query = `INSERT INTO contacto(correo, telefono_fijo, celular, zona, localidad_comuna, direccion, idciudad, idpersona) VALUES ('${correoCotizante}', ${celularCotizante}, ${celularCotizante}, '${zonaCotizante}', '${localidadComuna}', '${direccionCotizante}', ${idCiudadCotizante}, (SELECT id FROM persona WHERE identificacion = ${identificacionCotizante})) ON DUPLICATE KEY UPDATE correo='${correoCotizante || ''}', telefono_fijo='${celularCotizante || ''}', celular='${celularCotizante || ''}', zona='${zonaCotizante || ''}', localidad_comuna='${localidadComuna || ''}', direccion='${direccionCotizante || ''}', idciudad='${idCiudadCotizante}'`
        db.query(query, (err, rows) => {
          if (!err) {
            resolve(resPerson)
          } else {
            reject(new Error(JSON.stringify({
              message: 'Error al guardar datos de contacto',
              error: err.message,
              completeError: err
            })))
          }
        })
      })
    }).then((resPerson) => {
      return new Promise<ResultSql>((resolve, reject) => {
        const query = `INSERT INTO filesdocumentos(id, idpersona, url, tipoArchivo) VALUES (${copiaIdentificacionCotizante.id}, '${identificacionCotizante}', '${copiaIdentificacionCotizante.url}', ${copiaIdentificacionCotizante.tipoArchivo}) ON DUPLICATE KEY UPDATE url='${copiaIdentificacionCotizante.url}'`
        db.query(query, (err, rows) => {
          if (!err) {
            resolve(resPerson)
          } else {
            reject(new Error(JSON.stringify({
              message: 'Error al guardar copia del documento',
              error: err.message,
              completeError: err
            })))
          }
        })
      })
    }).then(resPerson => {
      if (idTipoAfiliado === 2) {
        const separateFiles = [copiaContratoCotizante, copiaRutCotizante]
        const promisesFiles: Promise<ResultSql>[] = []
        separateFiles.forEach(file => {
          promisesFiles.push(new Promise<ResultSql>((resolve, reject) => {
            const query = `INSERT INTO filesdocumentos(id, idpersona, url, tipoArchivo) VALUES (${file.id}, '${identificacionCotizante}','${file.url}', ${file.tipoArchivo}) ON DUPLICATE KEY UPDATE url='${file.url}'`
            db.query(query, (err, rows) => {
              if (!err) {
                resolve(resPerson)
              } else {
                reject(new Error(JSON.stringify({
                  message: 'Error al guardar documentos de indepentiente',
                  error: err.message,
                  completeError: err
                })))
              }
            })
          }))
        })
        return Promise.all<ResultSql>(promisesFiles).then(() => resPerson).catch(error => {
          throw error
        })
      }
      return resPerson
    }).then(() => {
      return new Promise<ResultSql>((resolve, reject) => {
        const query = `INSERT INTO afiliacion(idusuario, idtipofiliado, idafpactiva, idarlactica, idpersona, idtipoafiliacion, idips, estado, epsanterior, codigo, fecha_retiro) VALUES ('${idUsuarioRadica}', '${idTipoAfiliado}', '${idAfp}', '${idArl}', (SELECT id FROM persona WHERE identificacion = ${identificacionCotizante}), '${idTipoAfiliacion}', '${idIps}', '${estadoAfiliacion}', '${epsAnteriorCotizante || ''}', '${codigoAfiliacion || 0}', '${fechaRetiro || ''}') ON DUPLICATE KEY UPDATE idtipofiliado='${idTipoAfiliado}', idafpactiva='${idAfp}', idarlactica='${idArl}', idtipoafiliacion='${idTipoAfiliacion}', idips='${idIps}', estado='${estadoAfiliacion}', epsanterior='${epsAnteriorCotizante || ''}', codigo='0', fecha_retiro='${fechaRetiro || ''}'`
        db.query(query, (err, rows) => {
          if (!err) {
            resolve(rows)
          } else {
            reject(new Error(JSON.stringify({
              message: 'Error al guardar afiliación',
              error: err.message,
              completeError: err
            })))
          }
        })
      })
    }).then((resAfiliacion) => {
      if (idTipoAfiliado === 1) {
        return new Promise<ResultSql>((resolve, reject) => {
          const query = `INSERT INTO vinculacion(idpersona, idempresa) VALUES ((SELECT id FROM persona WHERE identificacion = ${identificacionCotizante}), ${idEmpresaCotizante}) ON DUPLICATE KEY UPDATE idempresa=${idEmpresaCotizante}`
          db.query(query, (err, rows) => {
            if (!err) {
              resolve(resAfiliacion)
            } else {
              reject(new Error(JSON.stringify({
                message: 'Error al guardar vinculación',
                error: err.message,
                completeError: err
              })))
            }
          })
        })
      } else {
        return new Promise<ResultSql>((resolve, reject) => {
          const query = `DELETE FROM vinculacion WHERE idpersona = (SELECT id FROM persona WHERE identificacion = ${identificacionCotizante})`
          db.query(query, (err, rows) => {
            if (!err) {
              resolve(resAfiliacion)
            } else {
              reject(new Error(JSON.stringify({
                message: 'Error al eliminar vinculación',
                error: err.message,
                completeError: err
              })))
            }
          })
        })
      }
    }).then(resAfiliacion => {
      if (beneficiarios.length > 0) {
        const promisesBeneficiario:Promise<ResultSql>[] = []
        beneficiarios.forEach((element: Beneficiario) => {
          if (!element.isDelete) {
            const promiseBeneficiario = new Promise<ResultSql>((resolve, reject) => {
              const query = `INSERT INTO persona(id, idtipodocumento, identificacion, primernombre, segundonombre, primerapellido, segundoapellido, fechanacimiento, sexo) VALUES (?, ?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE idtipodocumento='${element.idTipoDocumentoBeneficiario}', identificacion='${element.identificacionBeneficiario}', primernombre='${element.primerNombreBeneficiario}', segundonombre='${element.segundoNombreBeneficiario || ''}', primerapellido='${element.primerApellidoBeneficiario}', segundoapellido='${element.segundoApellidoBeneficiario || ''}', fechanacimiento='${element.fechaNacimientoBeneficiario}', sexo='${element.sexoBeneficiario}'`
              db.query(query, [
                element.idPersona,
                element.idTipoDocumentoBeneficiario,
                element.identificacionBeneficiario,
                element.primerNombreBeneficiario,
                element.segundoNombreBeneficiario,
                element.primerApellidoBeneficiario,
                element.segundoApellidoBeneficiario,
                element.fechaNacimientoBeneficiario,
                element.sexoBeneficiario
              ], (err, rows) => {
                if (!err) {
                  resolve(rows)
                } else {
                  reject(new Error(JSON.stringify({
                    message: 'Error al guardar datos personales del beneficiario',
                    error: err.message,
                    completeError: err
                  })))
                }
              })
            }).then(() => {
              return new Promise<ResultSql>((resolve, reject) => {
                const query = `INSERT INTO beneficiario(idpersona, idafiliacion, idparentezco) VALUES ((SELECT id FROM persona WHERE identificacion = ${element.identificacionBeneficiario}), (SELECT id FROM afiliacion WHERE idpersona = (SELECT id FROM persona WHERE identificacion = ${identificacionCotizante})) ,${element.idParentezcoBeneficiario}) ON DUPLICATE KEY UPDATE idparentezco = ${element.idParentezcoBeneficiario}`
                db.query(query, (err, rows) => {
                  if (!err) {
                    resolve(resAfiliacion)
                  } else {
                    reject(new Error(JSON.stringify({
                      message: 'Error al guardar datos de beneficiario',
                      error: err.message,
                      completeError: err
                    })))
                  }
                })
              })
            }).then((resAfiliacion) => {
              const promiseFileB: Promise<ResultSql>[] = []
              promiseFileB.push(new Promise<ResultSql>((resolve, reject) => {
                const query = `INSERT INTO filesdocumentos(id, idpersona, url, tipoArchivo) VALUES (${element.copiaIdentificacionBeneficiario.id}, ${element.identificacionBeneficiario},'${element.copiaIdentificacionBeneficiario.url}', ${element.copiaIdentificacionBeneficiario.tipoArchivo}) ON DUPLICATE KEY UPDATE url='${element.copiaIdentificacionBeneficiario.url}'`
                db.query(query, (err, rows) => {
                  if (!err) {
                    resolve(rows)
                  } else {
                    reject(new Error(JSON.stringify({
                      message: 'Error al guardar documentos del beneficiario',
                      error: err.message,
                      completeError: err
                    })))
                  }
                })
              }))
              if (element.copiaCartaConyugueBeneficiario?.url) {
                promiseFileB.push(new Promise<ResultSql>((resolve, reject) => {
                  const query = `INSERT INTO filesdocumentos(id, idpersona, url, tipoArchivo) VALUES (${element.copiaCartaConyugueBeneficiario?.id}, ${element.identificacionBeneficiario},'${element.copiaCartaConyugueBeneficiario?.url}', ${element.copiaCartaConyugueBeneficiario?.tipoArchivo}) ON DUPLICATE KEY UPDATE url='${element.copiaCartaConyugueBeneficiario?.url}'`
                  db.query(query, (err, rows) => {
                    if (!err) {
                      resolve(rows)
                    } else {
                      reject(new Error(JSON.stringify({
                        message: 'Error al guardar documentos del beneficiario',
                        error: err.message,
                        completeError: err
                      })))
                    }
                  })
                }))
              }
              return Promise.all(promiseFileB).then(() => resAfiliacion)
            })
            promisesBeneficiario.push(promiseBeneficiario)
          } else {
            promisesBeneficiario.push(new Promise((resolve, reject) => {
              const query = scriptDeleteBeneficiario(element.idPersona)
              db.query(query, (err, rows) => {
                if (!err) {
                  resolve(rows)
                } else {
                  reject(new Error(JSON.stringify({
                    message: 'Error al eliminar beneficiario',
                    error: err.message,
                    completeError: err
                  })))
                }
              })
            }))
          }
        })
        return Promise.all<ResultSql>(promisesBeneficiario).then(() => resAfiliacion).catch(error => {
          throw error
        })
      }
      return resAfiliacion
    }).catch(error => {
      throw error.message
    })

    res.json({
      message: 'Afiliación guardada',
      idradicacion: resAfiliacion.insertId
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const insertUser = (req: Request, res: Response) => {
  try {
    const queryPerson = scriptCreatePerson(req.body)
    const queryContact = scriptCreateContacto(req.body)
    const queryUser = scriptCreateUser(req.body)
    const query = `${queryPerson}; ${queryContact}; ${queryUser}`
    db.query(query, (error, rows) => {
      if (!error) {
        res.json({
          message: 'Guardado',
          data: rows
        })
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al crear persona',
          error: error.message,
          completeError: error
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const insertEmpresa = (req: Request, res: Response) => {
  try {
    const query = scriptCreateEmpresa(req.body)
    db.query(query, (err: any, rows: ResultSql) => {
      if (!err) {
        res.status(200).json({
          message: rows.insertId !== 0 ? 'Empresa creada' : 'Datos actualizados',
          idEmpresa: rows.insertId
        })
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al guardar datos de la empresa',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const createEntidad = (req: Request, res: Response) => {
  try {
    const query = scriptCreateEntidad(req.body)
    db.query(query, (err: any, rows: ResultSql) => {
      if (!err) {
        res.status(200).json({
          message: 'Datos guardados',
          data: rows
        })
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al guardar datos de la entidad',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}
