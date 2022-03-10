"use strict";
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/earth/approach",
      handler: "earth-approach.getApproach",
      config: {
        auth: false
      },
    },
  ],
};
