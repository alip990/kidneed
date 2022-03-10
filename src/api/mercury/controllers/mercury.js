"use strict";
const jmoment = require("moment-jalaali");

/**
 * A set of functions called "actions" for `mercury`
 */

const validateChildren = async (userId, childrenId) => {
  const children = await strapi.query("api::child.child").findOne({
    where: {
      id: childrenId,
      user: userId
    }
  });

  if(children) return children;

  throw Error();
};

module.exports = {
  async dashboardStats(ctx) {
    const user = ctx.state.user;
    const { childrenId } = ctx.params;
    let { start = null, end = null } = ctx.request.body;

    const condition = {
      user: user.id
    };
    if(childrenId) condition.id = childrenId;

    const children = await strapi.query("api::child.child").findOne({
      where: condition
    });

    if(!children) return null;

    if(start)
      start = jmoment(start);
    else
      start = jmoment().startOf("jMonth");
    start = start.toISOString();

    if(end)
      end = jmoment(end);
    else
      end = jmoment().endOf("jMonth");
    end = end.toISOString();

    const activities = await strapi.query("api::activity.activity").findMany({
      where: {
        date: {
          $gte: start,
          $lte: end
        },
        type: {
          $in: ["book", "game", "video"]
        },
        child: children.id
      }
    });

    return {
      "book": activities.filter(a => a.type === "book").reduce((partialSum, a) => partialSum + a, 0),
      "game": activities.filter(a => a.type === "game").reduce((partialSum, a) => partialSum + a, 0),
      "video": activities.filter(a => a.type === "video").reduce((partialSum, a) => partialSum + a, 0)
    };
  },

  async childrenDashboard(ctx) {
    const user = ctx.state.user;
    const { id: childrenId } = ctx.params;

    const children = await validateChildren(user.id, childrenId);

    const today = new Date().toISOString();
    const activities = await strapi.query("api::activity.activity").findMany({
      where: {
        date: today,
        child: children.id
      }
    });

    return {
      "book": activities.filter(a => a.type === "book"),
      "game": activities.filter(a => a.type === "game"),
      "video": activities.filter(a => a.type === "video"),
      "audio": activities.filter(a => a.type === "audio"),
      "activity": activities.filter(a => a.type === "activity")
    };
  },

  async upsertActivity(ctx) {
    const user = ctx.state.user;
    const { childrenId } = ctx.params;
    let { type = "", date = null, contentId1 = null, contentId2 = null } = ctx.request.body;

    // validation
    if(["book", "game", "video", "activity", "audio"].indexOf(type) === -1) return null;
    if(!date || !jmoment(date, "YYYY-MM-DD").isValid()) return null;
    if([contentId1, contentId2].indexOf(null) !== -1) return null;
    const children = await validateChildren(user.id, childrenId);

    const today = new Date(date).toISOString();
    const todayActivitiesType = await strapi.query("api::activity.activity").findMany({
      where: {
        type,
        date: today,
        child: children.id
      }
    });

    for (const activity of todayActivitiesType) {
      await strapi.query("api::activity.activity").delete({ where: { id: activity.id } });
    }

    let activities = [{ contentId: contentId1 }, { contentId: contentId2 }];
    for (const activity of activities) {
      activity.child = children.id;
      activity.date = today;
      activity.progress = 0;
      activity.done = false;
      activity.payload = {};
      activity.type = type;
      await strapi.query("api::activity.activity").create({ data: activity });
    }

    return activities;
  }
};
