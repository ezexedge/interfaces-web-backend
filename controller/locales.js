const admin = require("firebase-admin");
const firebase = require("../firebase");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const moment = require("moment");
const utils = require("../utils/suffle");

exports.crear = async(req, res) => {
    try {
        const {
            nombre,
            calle,
            altura,
            latitud,
            longitud,
            horaApertura,
            horaCierre,
            imagen,
            categoria,
            usuario,
            descripcion
        } = req.body;

        const db = admin.firestore();

        let obj = {
            nombre: nombre,
            calle: calle,
            altura: altura,
            latitud: latitud,
            longitud: longitud,
            horaApertura: horaApertura,
            horaCierre: horaCierre,
            imagen: imagen,
            likes: [],
            dislikes: [],
            comentarios: [],
            categoria: categoria,
            createdAt: moment().format("YYYY-MM-DD"),
            usuario:usuario,
            descripcion: descripcion
        };

        await db.collection("locales").add(obj);

        res.status(200).json({ message: "locales creado correctamente" });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

exports.getLocales = async(req, res) => {
    try {
        const db = admin.firestore();
        let consulta = await db.collection("locales").get();
        let docs = [];
        consulta.forEach((doc) => {
            console.log("acaaa", doc.id);
            docs.push({...doc.data(), id: doc.id });
        });

        let data = utils.random(docs);

        res.status(200).json({ data: data });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
}

exports.getCategorias = async(req,res) => {
    try{
        const db = admin.firestore();
        let consulta = await db.collection("categorias").get();
        let docs = [];
        consulta.forEach((doc) => {
            console.log("acaaa", doc.id);
            docs.push({...doc.data(), id: doc.id });
        });


        res.status(200).json({ data: docs });

    }catch(err){
        res.status(400).json({
            error: error.message,
        });

    }
}

exports.getById = async(req, res) => {
    try {
        const { id } = req.params;

        const db = admin.firestore();
        let consulta = await db.collection("locales").get();
        let docs = [];
        consulta.forEach((doc) => {
            console.log("acaaa", doc.id);
            docs.push({...doc.data(), id: doc.id });
        });

        let encontrado = docs.find((val) => val.id === id);

        if (!encontrado) throw new Error(`El local con el id: ${id} no existe`);

        res.status(200).json({
            message: encontrado,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

exports.getByUser = async(req, res) => {
    try {
        const { user } = req.params;

        const db = admin.firestore();
        let consulta = await db.collection("locales").get();
        let docs = [];
        consulta.forEach((doc) => {
            console.log("acaaa", doc.id);
            docs.push({...doc.data(), id: doc.id });
        });

        let localesUser = docs.filter((val) => val.usuario === user);


        res.status(200).json({
            message: localesUser
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

exports.eliminarLocal = async(req, res) => {
    try {
        const { id } = req.params;

        const db = admin.firestore();
        let consulta = await db.collection("locales").get();
        let docs = [];
        consulta.forEach((doc) => {
            console.log("acaaa", doc.id);
            docs.push({...doc.data(), id: doc.id });
        });

        await db.collection("locales").doc(id).delete();

        res.status(200).json({ message: "Eliminado correctamente" });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

exports.likesLocales = async (req, res) => {
    try {
      const { localId , userId } = req.params;
  
      let idUsuario = userId
  
      const db = admin.firestore();
      let consulta = await db.collection("locales").get();
      let docs = [];
      consulta.forEach((doc) => {
        console.log("acaaa", doc.id);
        docs.push({ ...doc.data(), id: doc.id });
      });
  
      let encontrado = docs.find((val) => val.id === localId);
  
      if (!encontrado) {
        throw new Error("El local no existe");
      }
  
      let existeUsuario = encontrado.likes.find((val) => val === idUsuario);
      let existeUsuario2 = encontrado.dislikes.find((val) => val === idUsuario);

      if(existeUsuario2){
        let dislikesActualizado = encontrado.dislikes.filter(
            (val) => val !== idUsuario
          );
          encontrado.dislikes = dislikesActualizado
      }
  
      if (!existeUsuario) {
        encontrado.likes.push(idUsuario);
      } else {
        let likesActualizado = encontrado.likes.filter(
          (val) => val !== idUsuario
        );
        encontrado.likes = likesActualizado;
      }
  
      await db
        .collection("locales")
        .doc(encontrado.id)
        .update({
          ...encontrado,
        });
  
      res.status(200).json({ message: "ok" });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  };

  exports.dislikesLocales = async (req, res) => {
    try {
      const { localId , userId } = req.params;
  
      let idUsuario = userId
  
      const db = admin.firestore();
      let consulta = await db.collection("locales").get();
      let docs = [];
      consulta.forEach((doc) => {
        console.log("acaaa", doc.id);
        docs.push({ ...doc.data(), id: doc.id });
      });
  
      let encontrado = docs.find((val) => val.id === localId);
  
      if (!encontrado) {
        throw new Error("El local no existe");
      }
  
      let existeUsuario = encontrado.dislikes.find((val) => val === idUsuario);
      let existeUsuario2 = encontrado.likes.find((val) => val === idUsuario);

      if(existeUsuario2){
        let dislikesActualizado = encontrado.likes.filter(
            (val) => val !== idUsuario
          );
          encontrado.likes = dislikesActualizado
      }
  
      if (!existeUsuario) {
        encontrado.dislikes.push(idUsuario);
      } else {
        let likesActualizado = encontrado.dislikes.filter(
          (val) => val !== idUsuario
        );
        encontrado.dislikes = likesActualizado;
      }
  
      await db
        .collection("locales")
        .doc(encontrado.id)
        .update({
          ...encontrado,
        });
  
      res.status(200).json({ message: "ok" });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  };