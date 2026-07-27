const AppError = require('../errors/AppError');

/**
 * Valida partes da requisição contra schemas Zod.
 *
 * O resultado tipado fica em `request.validated`, e não sobrescrevendo
 * `request.query` — no Express 5 essa propriedade é somente leitura.
 */
function validate(schemas) {
  return (request, response, next) => {
    request.validated = request.validated || {};

    for (const [source, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(request[source]);

      if (!result.success) {
        const details = result.error.issues.map((issue) => ({
          field: [source, ...issue.path].join('.'),
          message: issue.message,
        }));

        throw new AppError('Dados inválidos na requisição.', 422, details);
      }

      request.validated[source] = result.data;
    }

    return next();
  };
}

module.exports = validate;
