export function applyListQuery(query, req) {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const sortBy = req.query.sortBy || "created_at";
  const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

  query = query.range(from, to).order(sortBy, { ascending: sortOrder === "asc" });

  if (req.query.search && req.searchColumns?.length) {
    const term = `%${req.query.search}%`;
    query = query.or(req.searchColumns.map((column) => `${column}.ilike.${term}`).join(","));
  }

  for (const [key, value] of Object.entries(req.query)) {
    if (!["page", "limit", "sortBy", "sortOrder", "search"].includes(key) && value) {
      query = query.eq(key, value);
    }
  }

  return { query, meta: { page, limit } };
}
