"use strict";
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/earth/sign",
      handler: "earth-sign.getSign",
      config: {
        auth: false
      },
    },
  ],
};
