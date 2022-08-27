import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc'

const swaggerDefinition: OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'Gesadmin API',
    description: 'Api público para la plataforma para la gestión de procesos administrativos.',
    version: '2.0.0',
    contact: {
      name: 'Gesadmin',
      url: '',
      email: ''
    }
  },
  servers: [
    {
      url: 'http://localhost:3012'
    }
  ],
  components: {
    parameters: {
      AccessToken: {
        name: 'x-access-token',
        in: 'header',
        description: 'Access Token',
        required: true,
        schema: {
          type: 'string'
        }
      }
    },
    schemas: {
      AuthUser: {
        type: 'object',
        required: ['usuario', 'password'],
        properties: {
          usuario: {
            type: 'integer'
          },
          password: {
            type: 'string'
          }
        }
      },
      DataRemember: {
        type: 'object',
        required: ['nombres', 'email', 'password', 'numeroDocumento', 'urlQi'],
        properties: {
          numeroDocumento: {
            type: 'number'
          },
          nombres: {
            type: 'string'
          },
          email: {
            type: 'string'
          },
          password: {
            type: 'string'
          },
          urlQi: {
            type: 'string'
          }
        }
      },
      Token: {
        type: 'object',
        properties: {
          token: {
            type: 'string'
          }
        }
      },
      ErrorModel: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          error: {
            type: 'string'
          }
        }
      }
    }
  },
  paths: {
    '/login': {
      post: {
        description: 'Debe enviar el token en el header con la propiedad x-acess-token, en el body envia el usuario y contraseña, con estos datos se retorna una lista de empresas y algunos datos del usuario',
        tags: ['Auth'],
        parameters: [
          {
            $ref: '#components/parameters/AccessToken'
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthUser'
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: 'Retorna una lista de empresa y datos del usuario',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  $ref: '#/components/schemas/Company'
                },
                example: [
                  {
                    nombreBase: 'qinspect',
                    autCreateCap: 1,
                    numeroDocumento: '987654321',
                    password: '987654321',
                    apellidos: 'DEVELOPER',
                    nombres: 'DEVELOPER',
                    numeroCelular: '3111111111',
                    email: 'DEVELOPER@HOTMAIL.COM',
                    nombreCargo: 'JEFE PROYECTO',
                    urlFoto: 'https://apis.qinspecting.com/pflutter/files/user-default.png',
                    idEmpresa: 1,
                    idRol: 1,
                    tieneFirma: 1,
                    razonSocial: 'Appears SAS',
                    nombreQi: 'Qinspecting',
                    urlQi: 'https://app.qinspecting.com',
                    rutaLogo: 'https://apis.qinspecting.com/pflutter/files/1572462011.png'
                  }
                ]
              }
            }
          },
          400: {
            description: 'Retorna un objeto con un mensaje indicando cual fue el error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/ErrorModel'
                }
              }
            }
          },
          401: {
            description: 'Retorna un objeto indicando que no esta autorizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/ErrorModel'
                }
              }
            }
          }
        }
      }
    }
  }
}

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts']
}

export default swaggerJSDoc(swaggerOptions)
