"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  router.post("/api/user/register", controller.user.register);
  router.post("/api/user/login", controller.user.login);
  router.get("/api/user/get_userInfo", _jwt, controller.user.getUserInfo);
  router.post("/api/user/edit_userInfo", _jwt, controller.user.editUserInfo);
  router.post("/api/upload", controller.upload.upload);
  /* -----------------------bill----------------------- */
  router.post("/api/bill/add", _jwt, controller.bill.add);
  router.get("/api/bill/list", _jwt, controller.bill.list);
  router.post("/api/bill/edit", _jwt, controller.bill.edit);
  router.post("/api/bill/delete", _jwt, controller.bill.delete);
  /* -----------------------test----------------------- */
  router.get("/api/user/test", _jwt, controller.user.test);
};
