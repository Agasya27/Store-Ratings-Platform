const ALLOWED_ROLES = ['ADMIN', 'NORMAL', 'OWNER'];

function parseSort(sortBy, sortOrder, allowedColumns, defaultColumn = 'created_at') {
  const column = allowedColumns.includes(sortBy) ? sortBy : defaultColumn;
  const order = String(sortOrder || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  return { column, order };
}

function parsePagination(page, limit, maxLimit = 100) {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), maxLimit);
  const offset = (parsedPage - 1) * parsedLimit;
  return { page: parsedPage, limit: parsedLimit, offset };
}

function buildIlikeFilter(conditions, column, value) {
  if (value) {
    conditions.push(`${column} ILIKE $${conditions.length + 1}`);
  }
}

module.exports = { ALLOWED_ROLES, parseSort, parsePagination, buildIlikeFilter };
