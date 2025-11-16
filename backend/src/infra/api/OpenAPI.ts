import { OpenAPIV3 } from 'openapi-types';

const openAPIConfig: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Gerenciamento de Tarefas (To-Do List) ',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Identificador único da tarefa.',
            format: 'uuid',
            example: 'ff32f782-0a23-4506-b32c-26d951b860dd',
          },
          title: {
            type: 'string',
            description: 'Título da tarefa.',
            example: 'Comprar mantimentos',
          },
          finished: {
            type: 'boolean',
            description: 'Status de conclusão da tarefa.',
            example: false,
          },
          createdAt: {
            type: 'string',
            description: 'Data e hora de criação da tarefa.',
            format: 'date-time',
            example: '2025-11-15T20:20:58.874Z',
          },
        },
      },
      CreateTaskInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Nova Tarefa' },
        },
        required: ['title'],
      },
      EditTaskInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Nova Tarefa' },
          finished: { type: 'boolean', example: true },
        },
        required: ['title', 'finished'],
      },
    },
  },
  paths: {
    '/register': {
      post: {
        summary: 'Registra um novo usuário.',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'fulano@gmail.com' },
                  password: { type: 'string', example: 'abc123' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Usuário registrado com sucesso.' },
        },
      },
    },
    '/login': {
      post: {
        summary: 'Autentica um usuário e retorna um token JWT.',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'fulano@gmail.com' },
                  password: { type: 'string', example: 'abc123' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Usuário autenticado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    email: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/tasks': {
      post: {
        summary: 'Cria uma nova tarefa.',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTaskInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Tarefa criada com sucesso.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task',
                },
              },
            },
          },
          '401': { description: 'Token inválido.' },
        },
      },
      get: {
        summary: 'Lista tarefas do usuário autenticado.',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de tarefas.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Task' },
                },
              },
            },
          },
        },
      },
    },
    '/tasks/{taskId}': {
      put: {
        summary: 'Alterar uma tarefa.',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EditTaskInput' },
            },
          },
        },
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID da tarefa a ser alterada.',
          },
        ],
        responses: {
          '200': {
            description: 'Tarefa alterada com sucesso.',
            content: {
              'application/json': {},
            },
          },
          '401': { description: 'Token inválido.' },
        },
      },
      delete: {
        summary: 'Exclui uma tarefa.',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID da tarefa a ser excluída.',
          },
        ],
        responses: {
          '204': {
            description: 'Tarefa excluída com sucesso.',
            content: {
              'application/json': {},
            },
          },
          '401': { description: 'Token inválido.' },
        },
      },
    },
  },
};

export default openAPIConfig;
