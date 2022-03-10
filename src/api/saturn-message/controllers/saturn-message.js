// 'use strict';

// /**
//  * A set of functions called "actions" for `saturn-message`
//  */

// module.exports = {
//   // exampleAction: async (ctx, next) => {
//   //   try {
//   //     ctx.body = 'ok';
//   //   } catch (err) {
//   //     ctx.body = err;
//   //   }
//   // }
// };


/**
 *   controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::saturn-message.saturn-message' , ({strapi})=>({
  async childMessages(ctx){
    const { childId } = ctx.request.params;
    const{text , createdAt , type   } = ctx.request.query
    user = ctx.state.user
    
    if (!user) 
      return 'credential not valid';

    where = {
      user:user.id , 
      child : childId  , 
    }
    if (text) 
      where.text = { $containsi : text};
    if(type)
      where.type = type;

    return await strapi.db.query('api::saturn-message.saturn-message').findMany({
      where : where  ,
      orderBy: { createdAt: createdAt },
    })
  },
  async childMessagesCount(ctx){
    const { childId } = ctx.request.params;
    user = ctx.state.user

    return await strapi.db.query('api::saturn-message.saturn-message').count({
      where : {
        user:user,
        child:childId
      }  ,
    })

  }
}));
