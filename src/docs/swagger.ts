import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc'

const swaggerDefinition: OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'Qinspecting API',
    description: 'API público para la plataforma de administración de flotas, que mediante CheckList Electrónicos, proporciona ganancia de tiempo, reducción de costos operacionales, trazabilidad y mayor calidad en la gestión de la información, que afecta la seguridad de sus operaciones.',
    version: '2.0.0',
    contact: {
      name: 'Appears',
      url: 'https://appears.com.co',
      email: 'appearssas@gmail.com'
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
      Company: {
        type: 'object',
        properties: {
          nombreBase: {
            type: 'string'
          },
          autCreateCap: {
            type: 'integer'
          },
          numeroDocumento: {
            type: 'integer'
          },
          password: {
            type: 'string'
          },
          apellidos: {
            type: 'string'
          },
          nombres: {
            type: 'string'
          },
          numeroCelular: {
            type: 'string'
          },
          email: {
            type: 'string'
          },
          nombreCargo: {
            type: 'string'
          },
          urlFoto: {
            type: 'string'
          },
          idEmpresa: {
            type: 'integer'
          },
          idRol: {
            type: 'integer'
          },
          tieneFirma: {
            type: 'integer'
          },
          razonSocial: {
            type: 'string'
          },
          nombreQi: {
            type: 'string'
          },
          urlQi: {
            type: 'string'
          },
          rutaLogo: {
            type: 'string'
          }
        }
      },
      DocumentUser: {
        type: 'object',
        required: ['usuario'],
        properties: {
          usuario: {
            type: 'number'
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
    '/get_token': {
      post: {
        description: 'Genere un token enviando un usuario y contraseña, este token se usa para autenticación en la API y poder realizar cualquier petición',
        tags: ['Auth'],
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
            description: 'Retorna un token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/Token'
                },
                example: {
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEyMTgzOTkzNSwicHdkIjoiMTEyMTgzOTkzNSIsImlhdCI6MTY1Njc3ODEzOH0.QKJqN4Y134qv1hur3AvXdrBHg6Q1-TZm1olbweQb8d'
                }
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
    },
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
    },
    '/remember_data': {
      post: {
        description: 'Debe enviar en el body el número de documento del usuario, con este dato se retorna una lista de empresas y algunos datos del usuario',
        tags: ['Auth'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DocumentUser'
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
    },
    '/send_email_remember_data': {
      post: {
        description: 'Debe enviar en el body los datos del schema Remember, estos datos lo podra consultar de alguno de los objetos retornados en el path remember_data, con estos datos se enviará un email y se retornará',
        tags: ['Auth'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DataRemember'
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
                example: {
                  message: 'Email enviado a email@gmail.com',
                  messageId: '<e49c432c-b75e-7c20-9bdf-1fc0ae927369@qinspecting.com>'
                }
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
