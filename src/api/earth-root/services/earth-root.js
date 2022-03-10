'use strict';

/**
 * earth-root service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::earth-root.earth-root');
