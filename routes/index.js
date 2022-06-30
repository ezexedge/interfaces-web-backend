const express = require('express')

const router = express.Router()

const auth = require('../controller/auth')
const locales = require('../controller/locales')


module.exports = function() {



    router.post('/registrar', auth.registrar)
    router.post('/login', auth.login)
    router.post('/logout', auth.logout)
    router.post("/reset-password/:email", auth.resetPassword);
    router.post("/crear-local", locales.crear);
    router.put("/editar-local/:id", locales.editar);
    router.get("/locales", locales.getLocales);
    router.get("/locales/:id", locales.getById);
    router.get("/locales-ordenados", locales.getPopulares);
    router.delete("/locales/:id", locales.eliminarLocal);
    router.get("/categorias", locales.getCategorias);
    router.get("/locales/user/:user", locales.getByUser);
    router.put("/likes/:localId/:userId", locales.likesLocales);
    router.put("/dislikes/:localId/:userId", locales.dislikesLocales);



    return router

}