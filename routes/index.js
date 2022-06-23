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
    router.get("/categorias", locales.getCategorias);
    router.get("/locales", locales.getLocales);
    router.get("/locales/:id", locales.getById);
    router.get("/locales/user/:user", locales.getByUser);
    router.delete("/locales/:id", locales.eliminarLocal);
    router.put("/likes/:localId/:userId", locales.likesLocales);
    router.put("/dislikes/:localId/:userId", locales.dislikesLocales);


    return router

}