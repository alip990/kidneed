"use strict";
module.exports = {
  async getRoot(ctx) {
    const queryParams = ctx.request.query;
    const whereQuery = {};
    if (queryParams.signId) whereQuery.earth_signs = queryParams.signId;
    console.log(whereQuery);
    const roots = await strapi.db.query("api::earth-root.earth-root").findMany({
      where: whereQuery,
      orderBy: { publishedAt: "DESC" },
    });
    return roots;
  },
};
