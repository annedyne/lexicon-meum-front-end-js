export function validateQuery(query, minQueryLength) {
  const trimmedQuery = query.trim();
  return trimmedQuery.length >= minQueryLength ? trimmedQuery : null;
}
