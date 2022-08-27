import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import db from '../database'
import {
  Adjunto,
  Afiliacion,
  Ips,
  Entidad,
  Departamento,
  Option,
  Beneficiario
} from 'interfaces/get.models'
import {
  scriptInfoAfiliacion,
  scriptGetIps,
  scriptGetDepartamento,
  scriptGetCiudad,
  scriptGetTipoDoc,
  scriptGetParentezco,
  scriptGetTipoAfiliado,
  scriptGetTipoAfiliacion,
  scriptVerifyPerson,
  scriptGetUser,
  scriptGetPrivilegios,
  scriptGetEntidad,
  scriptBeneficiario
} from '../scriptSQL/get.scripts'
import { UserData } from '../interfaces/auth.models'

export const getMenu = (req: Request, res: Response) => {
  try {
    const query = 'SELECT id, nombre FROM eps WHERE estado = 1'
    db.query(query, (err, rows) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar eps para el menu',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getUserData = (req: Request, res: Response) => {
  try {
    res.json({
      message: 'datos de usuario'
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getMembershipsByEps = async (req: Request, res: Response) => {
  try {
    const { idEps } = req.params
    const promiseMemberships = new Promise<Afiliacion[]>((resolve, reject) => {
      const query = scriptInfoAfiliacion(true)
      db.query(query, [idEps], (err, rows) => {
        if (!err) {
          if (rows.length > 0) {
            resolve(rows)
          } else {
            resolve([])
          }
        } else {
          httpError(res, req, JSON.stringify({
            message: 'Error al consultar afiliaciones',
            error: err.message,
            completeError: err
          }), 400)
        }
      })
    })
    const resMemberships = await promiseMemberships.then(async (resMemberShip) => {
      const promisesFiles: Promise<Afiliacion>[] = []
      resMemberShip.forEach((element) => {
        element.copiaIdentificacionCotizante = {
          id: null,
          url: null,
          tipoArchivo: null,
          idPersona: null
        }
        element.copiaRutCotizante = {
          id: null,
          url: null,
          tipoArchivo: null,
          idPersona: null
        }
        element.copiaContratoCotizante = {
          id: null,
          url: null,
          tipoArchivo: null,
          idPersona: null
        }
        promisesFiles.push(new Promise((resolve, reject) => {
          const query = 'SELECT id, idpersona AS idPersona, url, tipoArchivo FROM filesdocumentos WHERE idpersona = ?'
          db.query(query, [element.identificacionCotizante], (err, rows) => {
            if (!err) {
              if (rows.length > 0) {
                const copiaDoc = rows.find((file:Adjunto) => file.tipoArchivo === 1)
                element.copiaIdentificacionCotizante = copiaDoc
                const copidContrato = rows.find((file:Adjunto) => file.tipoArchivo === 2)
                const copidRut = rows.find((file:Adjunto) => file.tipoArchivo === 3)

                if (copidContrato) {
                  element.copiaContratoCotizante = copidContrato
                }
                if (copidRut) {
                  element.copiaRutCotizante = copidRut
                }
                resolve(element)
              } else {
                resolve(element)
              }
            } else {
              reject(JSON.stringify({
                message: 'Error al consultar archivos',
                error: err.message,
                completeError: err
              }))
            }
          })
        }))
      })
      return await Promise.all(promisesFiles).then(response => {
        return response
      })
    }).then(async resMemberShip => {
      const pormiseBeneficiario: Promise<Afiliacion>[] = []
      resMemberShip.forEach(element => {
        pormiseBeneficiario.push(new Promise((resolve, reject) => {
          const query = scriptBeneficiario()
          db.query(query, [element.idAfiliacion], (err, rows) => {
            if (!err) {
              element.beneficiarios = []
              if (rows.length > 0) {
                element.beneficiarios = [...rows]
                resolve(element)
              }
              resolve(element)
            } else {
              reject(JSON.stringify({
                message: 'Error al consultar beneficiarios',
                error: err.message,
                completeError: err
              }))
            }
          })
        }))
      })
      return await Promise.all(pormiseBeneficiario)
    }).then(async resMemberShip => {
      // Buscamos los adjuntos de los beneficiarios
      const promisesFiles: Promise<Beneficiario>[] = []
      resMemberShip.forEach((element) => {
        if (element.beneficiarios.length > 0) {
          element.beneficiarios.forEach((beneficiario) => {
            promisesFiles.push(new Promise((resolve, reject) => {
              const query = 'SELECT id, idpersona AS idPersona, url, tipoArchivo FROM filesdocumentos WHERE idpersona = ?'
              db.query(query, [beneficiario.identificacionBeneficiario], (err, rows) => {
                if (!err) {
                  const copiaDoc = rows.find((file:Adjunto) => file.tipoArchivo === 1)
                  beneficiario.copiaIdentificacionBeneficiario = copiaDoc || {
                    id: null,
                    url: null,
                    tipoArchivo: 1,
                    idPersona: null
                  }
                  const copidCarta = rows.find((file:Adjunto) => file.tipoArchivo === 4)
                  beneficiario.copiaCartaConyugueBeneficiario = copidCarta || {
                    id: null,
                    url: null,
                    tipoArchivo: 4,
                    idPersona: null
                  }
                  resolve(beneficiario)
                } else {
                  reject(JSON.stringify({
                    message: 'Error al consultar archivos',
                    error: err.message,
                    completeError: err
                  }))
                }
              })
            }))
          })
        }
      })
      return await Promise.all(promisesFiles).then(resFiles => {
        resMemberShip.forEach(element => {
          if (element.beneficiarios.length > 0) {
            element.beneficiarios.forEach(beneficiario => {
              beneficiario = resFiles.find(file => file.identificacionBeneficiario === beneficiario.identificacionBeneficiario)!
            })
          }
        })
        return resMemberShip
      })
    })
    res.json(resMemberships)
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getMembershipsById = async (req: Request, res: Response) => {
  try {
    const { idAfiliacion } = req.params
    const promiseMember = new Promise<Afiliacion | null>((resolve, reject) => {
      const query = scriptInfoAfiliacion(false, true)
      db.query(query, [idAfiliacion], (err, rows) => {
        if (!err) {
          if (rows.length > 0) {
            resolve(rows[0])
          } else {
            resolve(null)
          }
          // res.json(rows)
        } else {
          httpError(res, req, JSON.stringify({
            message: 'Error al consultar afiliaciones',
            error: err.message,
            completeError: err
          }), 400)
        }
      })
    })
    promiseMember.then(async (resMembership) => {
      if (resMembership) {
        resMembership.copiaIdentificacionCotizante = {
          id: null,
          url: null,
          tipoArchivo: null,
          idPersona: null
        }
        resMembership.copiaRutCotizante = {
          id: null,
          url: null,
          tipoArchivo: null,
          idPersona: null
        }
        resMembership.copiaContratoCotizante = {
          id: null,
          url: null,
          tipoArchivo: null,
          idPersona: null
        }
        const promiseDocs = new Promise<Afiliacion>((resolve, reject) => {
          const query = 'SELECT id, idpersona AS idPersona, url, tipoArchivo FROM filesdocumentos WHERE idpersona = ?'
          db.query(query, [resMembership.identificacionCotizante], (err, rows) => {
            if (!err) {
              if (rows.length > 0) {
                const copiaDoc = rows.find((file:Adjunto) => file.tipoArchivo === 1)
                resMembership.copiaIdentificacionCotizante = copiaDoc
                const copidContrato = rows.find((file:Adjunto) => file.tipoArchivo === 2)
                const copidRut = rows.find((file:Adjunto) => file.tipoArchivo === 3)

                if (copidContrato) {
                  resMembership.copiaContratoCotizante = copidContrato
                }
                if (copidRut) {
                  resMembership.copiaRutCotizante = copidRut
                }
                resolve(resMembership)
              }
            } else {
              reject(JSON.stringify({
                message: 'Error al consultar archivos',
                error: err.message,
                completeError: err
              }))
            }
          })
        })

        const resMember = await promiseDocs.then(async resMemberShip => {
          return new Promise<Afiliacion>((resolve, reject) => {
            const query = `SELECT
              persona.id AS idPersona,
              idtipodocumento AS idTipoDocumentoBeneficiario,
              identificacion AS identificacionBeneficiario,
              primernombre AS primerNombreBeneficiario,
              segundonombre AS segundoNombreBeneficiario,
              primerapellido AS primerApellidoBeneficiario,
              segundoapellido AS segundoApellidoBeneficiario,
              fechanacimiento AS fechaNacimientoBeneficiario,
              sexo AS sexoBeneficiario,
              beneficiario.idparentezco AS idParentezcoBeneficiario,
              tipo_documento.nombre AS nombreTipoDocumentoBneficiario,
              parentezco.nombre AS nombreParentezco
            FROM persona
            INNER JOIN beneficiario ON beneficiario.idpersona = persona.id
            INNER JOIN tipo_documento ON tipo_documento.id = persona.idtipodocumento
            INNER JOIN parentezco ON parentezco.id = beneficiario.idparentezco
            WHERE beneficiario.idafiliacion = ?`
            db.query(query, [resMemberShip.idAfiliacion], (err, rows) => {
              if (!err) {
                resMemberShip.beneficiarios = []
                if (rows.length > 0) {
                  resMemberShip.beneficiarios = [...rows]
                  resolve(resMemberShip)
                }
                resolve(resMemberShip)
              } else {
                reject(JSON.stringify({
                  message: 'Error al consultar beneficiarios',
                  error: err.message,
                  completeError: err
                }))
              }
            })
          })
        }).then(async resMemberShip => {
          if (resMemberShip.beneficiarios.length > 0) {
            const promisesFiles: Promise<Afiliacion>[] = []
            resMemberShip.beneficiarios.forEach((beneficiario) => {
              promisesFiles.push(new Promise((resolve, reject) => {
                const query = 'SELECT id, idpersona AS idPersona, url, tipoArchivo FROM filesdocumentos WHERE idpersona = ?'
                db.query(query, [beneficiario.identificacionBeneficiario], (err, rows) => {
                  if (!err) {
                    if (rows.length > 0) {
                      const copiaDoc = rows.find((file:Adjunto) => file.tipoArchivo === 1)
                      beneficiario.copiaIdentificacionBeneficiario = copiaDoc
                      const copidCarta = rows.find((file:Adjunto) => file.tipoArchivo === 4)
                      beneficiario.copiaCartaConyugueBeneficiario = copidCarta || {
                        id: null,
                        url: null,
                        tipoArchivo: null,
                        idPersona: null
                      }
                      resolve(resMemberShip)
                    }
                    resolve(resMemberShip)
                  } else {
                    reject(JSON.stringify({
                      message: 'Error al consultar archivos',
                      error: err.message,
                      completeError: err
                    }))
                  }
                })
              }))
            })
            const [resFiles] = await Promise.all(promisesFiles)
            return resFiles
          }
          return resMemberShip
        })
        res.json({
          message: 'Afiliación encontrada',
          data: resMember
        })
      } else {
        res.json({
          message: 'Afiliación no encontrada',
          data: null
        })
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getUsers = (req: Request, res: Response) => {
  try {
    const query = scriptGetUser(false)
    db.query(query, (err: any, rows: UserData[]) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        console.log('AQUIi')
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar los usuarios',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getIps = (req: Request, res: Response) => {
  try {
    const { idEps } = req.params
    const query = scriptGetIps(idEps)
    db.query(query, (err: any, rows: Ips[]) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar las ips',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getEntidad = (req: Request, res: Response) => {
  try {
    const { tipoEntidad } = req.params
    const query = scriptGetEntidad(tipoEntidad)
    db.query(query, (err: any, rows: Entidad[]) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar las empresa',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getDepartamentos = (req: Request, res: Response) => {
  try {
    const query = scriptGetDepartamento()
    const queryCiudad = scriptGetCiudad()
    db.query(`${query}; ${queryCiudad}`, (err: any, rows: [Departamento[], Option[]]) => {
      if (!err) {
        const [departamentos, ciudades] = rows
        if (departamentos.length > 0) {
          departamentos.forEach(departamento => {
            departamento.ciudades = [...ciudades.filter(ciudad => ciudad.idDepartamento === departamento.value)]
          })
          res.status(200).json(departamentos)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar departamentos',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getTipoDocumento = (req: Request, res: Response) => {
  try {
    const query = scriptGetTipoDoc()
    db.query(query, (err: any, rows: Option[]) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar nombre error',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getParentezco = (req: Request, res: Response) => {
  try {
    const query = scriptGetParentezco()
    db.query(query, (err: any, rows: Option[]) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar parentezcos',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getTipoAfiliado = (req: Request, res: Response) => {
  try {
    const query = scriptGetTipoAfiliado()
    db.query(query, (err: any, rows: Option[]) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar tipo afialiado',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getTipoAfiliacion = (req: Request, res: Response) => {
  try {
    const query = scriptGetTipoAfiliacion()
    db.query(query, (err: any, rows: Option[]) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar tipo afialiación',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getPrivilegios = (req: Request, res: Response) => {
  try {
    const query = scriptGetPrivilegios()
    db.query(query, (err: any, rows: Option[]) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.json([])
        }
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar privilegios',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const verifyPerson = (req: Request, res: Response) => {
  try {
    const { identificacion } = req.params
    const query = scriptVerifyPerson(identificacion)
    db.query(query, (err: any, rows: any) => {
      if (!err) {
        const [result] = rows
        if (result.cantidadPersonas !== 0) {
          return res.status(200).json({
            message: 'Este documento ya esta registrado',
            estado: false
          })
        }
        res.status(200).json({
          message: 'Puede continuar con el registro',
          estado: true
        })
      } else {
        httpError(res, req, JSON.stringify({
          message: 'Error al consultar nombre error',
          error: err.message,
          completeError: err
        }), 400)
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}
