export class ApplicationError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string = 'Recurso não encontrado', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string = 'Erro de validação', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'Não autorizado', details?: any) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message: string = 'Acesso negado', details?: any) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string = 'Conflito de recursos', details?: any) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class DatabaseError extends ApplicationError {
  constructor(message: string = 'Erro de banco de dados', details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

export class ExternalServiceError extends ApplicationError {
  constructor(message: string = 'Erro em serviço externo', details?: any) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', details);
  }
} 