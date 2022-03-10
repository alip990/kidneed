"use strict";
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/earth/root",
      handler: "earth-root.getRoot",
      config: {
        auth: false
      },
    },
  ],
};
