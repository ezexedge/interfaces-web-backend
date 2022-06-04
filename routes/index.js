const express = require("express");

const router = express.Router();

const auth = require("../controller/auth.js");
const user = require("../controller/user.js");
const locales = require("../controller/locales");
const likes = require("../controller/likes");

module.exports = function () {
  router.post("/registrar", auth.registrar);
  router.post("/login", auth.login);
  router.post("/logout", auth.logout);
  router.get("/user", user.user);
  router.put("/user/:id/edit", user.userUpdate);
  router.post("/crear-local", locales.crear);
  router.get("/locales-categoria", locales.filtro),
  router.get("/locales", locales.getLocales),
    router.get("/locales/:id", locales.getById);
  router.post("/reset-password/:email", auth.resetPassword);
  router.delete("/eliminar-local/:localesID", locales.eliminarLocal);
  router.post("/crear-comentario/:localesID", locales.crearComentario);
  router.delete(
    "/eliminar-comentario/:localesID/:comentarioID",
    locales.eliminarComentario
  );
  router.put("/likes/:localesID", likes.likesLocales);
  return router;
};
