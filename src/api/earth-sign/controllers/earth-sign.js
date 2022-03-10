"use strict";
module.exports = {
  async getSign(ctx) {
    const queryParams = ctx.request.query;
    const whereQuery = {};
    if (queryParams.approachId)
      whereQuery.earth_approaches = queryParams.approachId;
    const signs = await strapi.db.query("api::earth-sign.earth-sign").findMany({
      where: whereQuery,
      orderBy: { publishedAt: "DESC" },
    });
    return signs;
  },
};
