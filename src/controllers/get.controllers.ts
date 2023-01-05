import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import {
  scriptCompanies,
  scriptDocumentsType,
  scriptGetCities,
  scriptGetDepartments,
  scriptGetPerson,
  scriptDisability,
  scriptRols,
  scriptStateDisability,
  scriptUsers,
  scriptHistoryDisability,
  scriptPositions,
  scriptCompanyType,
  scriptCompanyByType,
  scriptEmployeSelect,
  scriptDisabilityType,
  scriptTotalDisabilities,
  scriptTotalDisabilitiesByEps,
  scriptTotalDisabilitiesByStatus,
  scriptLatestDisabilities,
  scriptGetSalary,
  scriptCieGroup,
  scriptCieCode,
  scriptGetfilesByDisability,
  scriptGetDisabilityById,
  scriptCieDsibality,
  scriptGetPermissionsUser,
  scriptGetPermissionsRol,
  scriptReportExcel,
  scriptDocumentsAttachByDisabilityType
} from '../scriptSQL/get.scripts'
import { executeQuery } from '../functions/global.functions'
import {
  Rol,
  DocumentType,
  User,
  InformationEmploye,
  Department,
  City,
  DepartemtAndCity,
  HistoryDisability,
  InformationCompany,
  Company,
  Persona,
  DisabilityType,
  ResponseDashboard,
  LatestDisabilities,
  InformationDisability,
  DisabilityState,
  Salary,
  Adjunto,
  InfoCie,
  DisabilityWithCie,
  Permisos,
  Item,
  // ColumnsExcel,
  DocumentsAttach
} from 'interfaces/general.models'
import { generateExcel } from '../helpers/excel'

export const getRols = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptRols(base)
    const result = await executeQuery<Rol[]>(query)
    res.status(200).json(result)
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al consultar roles',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getDocumentsType = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptDocumentsType(base)
    const result = await executeQuery<DocumentType[]>(query)
    res.status(200).json(result)
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al consultar tipos de documentos',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptUsers(base)
    const result = await executeQuery<User[]>(query)
    res.status(200).json(result)
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al consultar usuarios',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { nit } = req.params

    if (nit) {
      const query = scriptCompanies(base, nit)
      const [result] = await executeQuery<InformationCompany[]>(query)
      res.status(200).json(result)
    } else {
      const query = scriptCompanies(base)
      const result = await executeQuery<InformationCompany[]>(query)
      res.status(200).json(result)
    }
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: req.params.nit ? 'Error al consultar empresa' : 'Error al consultar empresas',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getPerson = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { documentoPersona } = req.query
    const query = documentoPersona ? scriptGetPerson(base, +documentoPersona) : scriptGetPerson(base)
    const result = await executeQuery<InformationEmploye[]>(query)
    if (documentoPersona) {
      if (result.length > 0) {
        res.status(200).json(result[0])
      } else {
        res.status(404).json({
          message: `No hemos encontrado iformación relacionada al documento No. ${documentoPersona}`
        })
      }
    } else {
      if (result.length > 0) {
        res.status(200).json(result)
      } else {
        res.status(404).json({
          message: 'Sin resultados'
        })
      }
    }
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al cosultar iformación',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getEmployesSelect = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptEmployeSelect(base)
    const result = await executeQuery<Persona[]>(query)
    if (result.length > 0) {
      res.status(200).json(result)
    } else {
      res.status(404).json({
        message: 'Sin resultados'
      })
    }
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al cosultar empleados',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getDisabilityType = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptDisabilityType(base)
    const result = await executeQuery<DisabilityType[]>(query)
    if (result.length > 0) {
      res.status(200).json(result)
    } else {
      res.status(404).json({
        message: 'Sin resultados'
      })
    }
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al cosultar empleados',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getDeparments = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptGetDepartments(base)
    const result = await executeQuery<Department[]>(query)
    res.status(200).json(result)
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al cosultar departamentos',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getCities = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptGetCities(base)
    const result = await executeQuery<City[]>(query)
    res.status(200).json(result)
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al cosultar ciudades',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getStateDisability = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptStateDisability(base)
    const result = await executeQuery<DisabilityState[]>(query)
    res.status(200).json(result)
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al consultar estados de incapacidad',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getDisabilities = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptDisability(base)
    const result = await executeQuery<InformationDisability[]>(query)
    const promisesFile: Promise<InformationDisability>[] = []
    result.forEach(e => {
      promisesFile.push(executeQuery<Adjunto[]>(scriptGetfilesByDisability(base, +e.radicado)).then(f => {
        e.files = f
        return e
      }))
    })
    const resultFinal = await Promise.all(promisesFile)
    res.status(200).json(resultFinal)
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al consultar las incapacidad',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getDisabilityById = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { radicado } = req.params
    const query = scriptGetDisabilityById(base, +radicado)
    const [disability] = await executeQuery<DisabilityWithCie[]>(query)

    const queryCie = scriptCieDsibality(base, disability.cie)
    const [disabilityCie] = await executeQuery<InfoCie[]>(queryCie)

    const queryPerson = scriptGetPerson(base, disability.fkDocumentoPersona)
    const [employe] = await executeQuery<InformationEmploye[]>(queryPerson)

    const files = await executeQuery<Adjunto[]>(scriptGetfilesByDisability(base, +radicado))

    const history = await executeQuery<HistoryDisability[]>(scriptHistoryDisability(base, radicado))

    res.status(200).json({ disability: { ...disability, ...disabilityCie }, employe, files, history })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al consultar incapacidad',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getSalary = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptGetSalary(base)
    console.log(query)
    const result = await executeQuery<Salary[]>(query)
    res.status(200).json(result[0])
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al consultar salario',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getHistoryDisabilities = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { idRadicado } = req.params
    const query = scriptHistoryDisability(base, idRadicado)
    const result = await executeQuery<HistoryDisability[]>(query)
    res.status(200).json(idRadicado ? result[0] : result)
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al consultar historico de incapacidades',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getPosition = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { idRadicado } = req.params
    const query = scriptPositions(base)
    const result = await executeQuery<HistoryDisability[]>(query)
    res.status(200).json(idRadicado ? result[0] : result)
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al consultar cargos',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getCompanyType = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { idRadicado } = req.params
    const query = scriptCompanyType(base)
    const result = await executeQuery<HistoryDisability[]>(query)
    res.status(200).json(idRadicado ? result[0] : result)
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al consultar tipos de empresa',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getCompanyByType = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { idTipo } = req.params
    const query = scriptCompanyByType(base, idTipo)
    const result = await executeQuery<Company[]>(query)
    res.status(200).json(result)
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al consultar empresas',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getDepartemtAndCity = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const queryDeparment = scriptGetDepartments(base)
    const promise: Promise<DepartemtAndCity>[] = []
    const resultDepartment = await executeQuery<DepartemtAndCity[]>(queryDeparment)

    if (resultDepartment.length > 0) {
      resultDepartment.forEach(department => {
        const queryCity = scriptGetCities(base, department.idDepartamento)
        promise.push(executeQuery<City[]>(queryCity).then(cities => {
          department.cities = [...cities]
          return department
        }))
      })

      const resutl = await Promise.all(promise)

      res.status(200).json(resutl)
    } else {
      res.status(200).json([])
    }
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al cosultar ciudades',
      error: error.message,
      completeError: error
    }), 400)
  }
}

export const getDataDashboard = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = `${scriptTotalDisabilities(base)} ${scriptTotalDisabilitiesByEps(base)} ${scriptTotalDisabilitiesByStatus(base)}`
    const [totalDisabilities, totalDisabilitiesByEps, totalDisabilitiesByStatus] = await executeQuery<[ResponseDashboard[], ResponseDashboard[], ResponseDashboard[]]>(query)
    res.status(200).json({
      totalDisabilities: totalDisabilities[0],
      totalDisabilitiesByEps,
      totalDisabilitiesByStatus
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getLatestDisabilities = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptLatestDisabilities(base)
    const response = await executeQuery<LatestDisabilities[]>(query)
    res.status(200).json(response)
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getCie = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const query = scriptCieGroup(base)
    const response = await executeQuery<any[]>(query)
    const promises:any = []

    response.forEach(e => {
      const query = scriptCieCode(base, e.idGrupoCie)
      promises.push(executeQuery<any[]>(query).then(data => {
        e.cieCodes = data
        return e
      }).catch(e => e))
    })

    const resAll = await Promise.all(promises)
    res.status(200).json(resAll)
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { usuario } = req.params
    const query = scriptGetPermissionsUser(base, +usuario)
    const [result] = await executeQuery<Permisos[]>(query)

    if (result) {
      const tempPerrmissions: Item[] = JSON.parse(`${result.permisos}`)
      result.permisos = tempPerrmissions

      res.status(200).json(result)
    } else {
      res.status(404).json({
        message: 'No hemos encontrado permisos asociados a este usuario'
      })
    }
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getPermissionsByRol = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { rol } = req.params
    const query = scriptGetPermissionsRol(base, +rol)
    const [result] = await executeQuery<Permisos[]>(query)

    if (result) {
      res.status(200).json(JSON.parse(`${result.permisos}`))
    } else {
      res.status(404).json({
        message: 'No hemos encontrado permisos asociados a este rol'
      })
    }
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const getExcelReport = (req: Request, res: Response) => {
  const base:string = req.headers.base as string
  const { reportType } = req.params
  const { nit, cc, nitEntidad } = req.query

  const columnsGeneral = [
    { header: 'NUMERO DE CONSECUTIVO', key: 'idIncapacidad' },
    { header: 'FECHA RAICADO', key: 'fechaRegistro' },
    // { header: 'EMPRESA', key: '' },
    // { header: 'CENTRO DE COSTOS', key: '' },
    // { header: 'NOMBRE CENTRO DE COSTOS', key: '' },
    { header: 'EMPRESA CLIENTE', key: 'razonSocial' },
    { header: 'CARGO', key: 'nombreCargo' },
    { header: 'TIPO DOCUMENTO', key: 'nombreTipoDocumento' },
    { header: 'DOCUMENTO', key: 'fkDocumentoPersona' },
    { header: 'NOMBRE Y APELLIDO', key: 'nombresApellidos' },
    { header: 'CIUDAD', key: 'ciudad' },
    { header: 'IBC', key: 'ibc' },
    { header: 'ENTIDAD (EPS /ARL)', key: 'razonSocialEntidad' },
    { header: 'NÚMERO INCAPACIDAD', key: 'numeroIncapacidad' },
    { header: 'TIPO INCAPACIDAD', key: 'nombreTipoIncapacidad' },
    { header: 'DIAGNÓSTICO', key: 'cie' },
    { header: 'NOMBRE DE DIAGNÓSTICO', key: 'nombreCodigoCie' },
    { header: 'FECHA INICIAL', key: 'fechaInicio' },
    { header: 'FECHA FINAL', key: 'fechaFin' },
    { header: 'DÍAS INCAPACIDAD', key: 'totalDias' },
    { header: 'CASO 180', key: 'caso180' },
    // { header: 'DÍAS A RECOBRAR', key: '' },
    // { header: 'DÍAS PAGADOS', key: '' },
    { header: 'PRORROGA', key: 'prorroga' },
    { header: 'VALOR INCAPACIDAD', key: 'valor' },
    { header: 'ESTADO', key: 'nombreEstadoIncapacidad' }
    // { header: 'VALOR RECONOCIDO', key: '' },
    // { header: 'FECHA PAGO', key: '' },
    // { header: 'CAUSAL RECHAZO', key: '' },
    // { header: 'DESCRIPCIÓN RECHAZO', key: '' },
    // { header: 'OBSERVACIONES', key: '' },
    // { header: 'FECHA PROCESO DERECHO DE PETICION', key: '' },
    // { header: 'FECHA PROCESO DERECHO DE TUTELA', key: '' },
    // { header: 'SENTENCIA', key: '' }

  ]
  // const columns: ColumnsExcel[] = []
  let condition = ''
  if (reportType === 'cliente') {
    // columns = [columnsGeneral]
    if (!nit) return res.status(400).json({ message: 'Debe enviar el nit de la empresa' })

    condition = `WHERE i.fkNitEmpresa = ${nit}`
  } else if (reportType === 'empleado') {
    if (!cc) return res.status(400).json({ message: 'Debe enviar el documento del empleado' })
    condition = `WHERE i.fkDocumentoPersona = ${cc}`
    // columns = [...columnsGeneral]
  } else {
    // Entitdad
    if (!nitEntidad) return res.status(400).json({ message: 'Debe enviar el nit de la entidad' })
    condition = `WHERE i.fkEntidad = ${nitEntidad}`
    // columns = [...columnsGeneral]
  }

  const script = scriptReportExcel(base, condition)

  generateExcel(script, columnsGeneral, reportType, base)
  res.json({ message: 'Archivo generado' })
}

export const getDocumentsAttachByDisabilityType = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { disabilityType } = req.params
    const query = scriptDocumentsAttachByDisabilityType(base, +disabilityType)
    const result = await executeQuery<DocumentsAttach[]>(query)

    res.status(200).json(result)
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}
