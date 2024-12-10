import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  images: defineTable({
    image_url: v.string(),
    tid: v.string(),
  }).index("by_tid", ["tid"]),
  movies: defineTable({
    runtime: v.number(),
    tid: v.string(),
    title: v.string(),
    year: v.number(),
  })
    .index("by_tid", ["tid"])
    .index("by_year_tid", ["year", "tid"]),
});
