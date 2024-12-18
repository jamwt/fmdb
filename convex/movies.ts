import { query } from "./_generated/server";
import { components, internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { TableAggregate } from "@convex-dev/aggregate";
import { Migrations } from "@convex-dev/migrations";
import { v } from "convex/values";
import romans from "romans";

// For pagination.
const paginatedSet = new TableAggregate<{
  Key: [number, string];
  DataModel: DataModel;
  TableName: "movies";
}>(components.yearTid, {
  sortKey: (doc) => [doc.year, doc.tid],
});

export const getMovieCount = query(async (ctx) => {
  return await paginatedSet.count(ctx);
});

export const pageOfMovies = query({
  args: {
    start: v.number(),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const { key } = await paginatedSet.at(ctx, args.start);
    const { page } = await paginatedSet.paginate(ctx, {
      namespace: undefined,
      bounds: {
        lower: {
          key,
          inclusive: true,
        },
      },
      pageSize: args.count,
    });

    return Promise.all(
      page.map(async (doc) => {
        return await ctx.db.get(doc.id);
      })
    );
  },
});

export const getMovieImage = query({
  args: {
    tid: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("images")
      .withIndex("by_tid", (q) => q.eq("tid", args.tid))
      .first();
    return doc?.image_url;
  },
});

export const migrations = new Migrations<DataModel>(components.migrations);
export const updatePaginatedSet = migrations.define({
  table: "movies",
  migrateOne: async (ctx, doc) => {
    await paginatedSet.insertIfDoesNotExist(ctx, doc);
  },
});

export const runUpdatePaginatedSet = migrations.runner(
  internal.movies.updatePaginatedSet
);

export const updateTitleToString = migrations.define({
  table: "movies",
  migrateOne: async (ctx, doc) => {
    const title = doc.title === null ? "(Unknown)" : doc.title.toString();
    await ctx.db.patch(doc._id, { title });
  },
});

export const runUpdateTitleToString = migrations.runner(
  internal.movies.updateTitleToString
);

export const createFancyYear = migrations.define({
  table: "movies",
  migrateOne: async (ctx, doc) => {
    const year = romans.romanize(doc.year);
    await ctx.db.patch(doc._id, { fancyYear: year });
  },
});

export const runCreateFancyYear = migrations.runner(
  internal.movies.createFancyYear
);

export interface Suggestion {
  id: string;
  text: string;
  position: number;
}

export const searchMovies = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args): Promise<Suggestion[]> => {
    const docs = await ctx.db
      .query("movies")
      .withSearchIndex("by_title", (q) => q.search("title", args.searchTerm))
      .take(10);

    return Promise.all(
      docs.map(async (doc) => {
        const index = await paginatedSet.indexOfDoc(ctx, doc);
        return {
          id: doc._id,
          text: `${doc.title} (${doc.year})`,
          position: index,
        };
      })
    );
  },
});
