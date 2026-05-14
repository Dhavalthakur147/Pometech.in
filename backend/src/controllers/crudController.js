import { asyncHandler } from "../utils/asyncHandler.js";

export function createCrudController(model) {
  return {
    list: asyncHandler(async (req, res) => {
      const result = await model.list(req);
      res.json({ success: true, ...result });
    }),
    get: asyncHandler(async (req, res) => {
      const data = await model.getById(req.params.id);
      res.json({ success: true, data });
    }),
    create: asyncHandler(async (req, res) => {
      const data = await model.create(req.body);
      res.status(201).json({ success: true, data });
    }),
    update: asyncHandler(async (req, res) => {
      const data = await model.update(req.params.id, req.body);
      res.json({ success: true, data });
    }),
    remove: asyncHandler(async (req, res) => {
      const data = await model.remove(req.params.id);
      res.json({ success: true, data });
    })
  };
}
