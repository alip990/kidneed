"use strict";
module.exports = {
  async getApproach(ctx) {
    const queryParams = ctx.request.query;
    const approachs = await strapi.db
      .query("api::earth-approach.earth-approach")
      .findMany({
        where: {
          title: {
            $containsi: queryParams.title || "",
          },
        },
        orderBy: { publishedAt: "DESC" },
        populate: ["image"],
      });
    return approachs;
  },
};
