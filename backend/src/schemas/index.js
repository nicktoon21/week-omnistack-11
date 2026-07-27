const { z } = require('zod');

const trimmed = (max) => z.string().trim().min(1).max(max);

const ongIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{8}$/, 'ID de ONG inválido.');

const createOngSchema = z.object({
  name: trimmed(120),
  email: z.email('E-mail inválido.').max(160),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\d{10,13}$/, 'Whatsapp deve conter de 10 a 13 dígitos.'),
  city: trimmed(120),
  uf: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Za-z]{2}$/, 'UF deve ter 2 letras.'),
});

const createSessionSchema = z.object({
  id: ongIdSchema,
});

const createIncidentSchema = z.object({
  title: trimmed(120),
  description: trimmed(1000),
  values: z.coerce
    .number('Valor deve ser numérico.')
    .positive('Valor deve ser maior que zero.'),
});

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
});

const incidentIdSchema = z.object({
  id: z.coerce.number().int().positive('ID de caso inválido.'),
});

module.exports = {
  createOngSchema,
  createSessionSchema,
  createIncidentSchema,
  paginationSchema,
  incidentIdSchema,
};
