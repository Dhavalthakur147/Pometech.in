import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/apiError.js";
import { applyListQuery } from "../utils/query.js";

export function createModel(table, searchColumns = []) {
  return {
    async list(req) {
      req.searchColumns = searchColumns;
      const base = supabase.from(table).select("*", { count: "exact" });
      const { query, meta } = applyListQuery(base, req);
      const { data, error, count } = await query;
      if (error) throw new ApiError(400, error.message);
      return { data, meta: { ...meta, total: count || 0 } };
    },
    async getById(id) {
      const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
      if (error) throw new ApiError(404, `${table} record not found`);
      return data;
    },
    async create(payload) {
      const { data, error } = await supabase.from(table).insert(payload).select("*").single();
      if (error) throw new ApiError(400, error.message);
      return data;
    },
    async update(id, payload) {
      const { data, error } = await supabase.from(table).update(payload).eq("id", id).select("*").single();
      if (error) throw new ApiError(400, error.message);
      return data;
    },
    async remove(id) {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw new ApiError(400, error.message);
      return { id };
    }
  };
}
