const admin = require("firebase-admin");
const firebase = require("../firebase");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const shortid = require("shortid");
const moment = require("moment");
const utils = require("../utils/suffle");
const _ = require("lodash");
global.XMLHttpRequest = require("xhr2");

exports.crear = async (req, res) => {
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
      usuario: "12345",
      likes: [],
      comentarios: [],
      categoria: categoria,
      createdAt: moment().format("YYYY-MM-DD"),
    };

    await db.collection("locales").add(obj);

    res.status(200).json({ message: "locales creado correctamente" });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.eliminarLocal = async (req, res) => {
  try {
    const { localesID } = req.params;

    const db = admin.firestore();
    let consulta = await db.collection("locales").get();
    let docs = [];
    consulta.forEach((doc) => {
      console.log("acaaa", doc.id);
      docs.push({ ...doc.data(), id: doc.id });
    });

    await db.collection("locales").doc(localesID).delete();

    res.status(200).json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.crearComentario = async (req, res) => {
  try {
    const { comentario } = req.body;

    const { localesID } = req.params;

    const db = admin.firestore();
    let consulta = await db.collection("locales").get();
    let docs = [];
    consulta.forEach((doc) => {
      console.log("acaaa", doc.id);
      docs.push({ ...doc.data(), id: doc.id });
    });

    let encontrado = docs.find((val) => val.id === localesID);

    if (!encontrado) {
      throw new Error("El local no existe");
    }

    let obj = {
      id: shortid.generate(),
      usuario: "1234565",
      comentario: comentario,
    };

    encontrado.comentarios.push(obj);

    await db
      .collection("locales")
      .doc(encontrado.id)
      .update({
        ...encontrado,
      });

    res.status(200).json({ message: "Comentario agregado" });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};


exports.getLocales = async (req, res) => {
  try {
    const db = admin.firestore();
    let consulta = await db.collection("locales").get();
    let docs = [];
    consulta.forEach((doc) => {
      console.log("acaaa", doc.id);
      docs.push({ ...doc.data(), id: doc.id });
    });

    let data = utils.random(docs);

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

//filtro por viejo , nuevo , y random
exports.filtro = async (req, res) => {
  try {
    const db = admin.firestore();
    let consulta = await db.collection("locales").get();
    let docs = [];
    consulta.forEach((doc) => {
      console.log("acaaa", doc.id);
      docs.push({ ...doc.data(), id: doc.id });
    });

    let consulta2 = await db.collection("categorias").get();
    let docs2 = [];
    consulta2.forEach((doc) => {
      console.log("acaaa", doc.id);
      docs2.push({ ...doc.data(), id: doc.id });
    });

    let categoriaEncontrada = docs2.find(
      (val) => val.id === req.query.categoria
    );

    console.log("categoria encontrada", categoriaEncontrada);
    if (!categoriaEncontrada) throw new Error("la categoria no existe");

    if (categoriaEncontrada) {
      console.log("encontroo y entro");
      docs = docs.filter((val) => val.categoria === categoriaEncontrada.id);
    }

    let data = utils.random(docs);

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.eliminarComentario = async (req, res) => {
  try {
    const { comentarioID, localesID } = req.params;

    console.log("lldld", localesID);

    const db = admin.firestore();
    let consulta = await db.collection("locales").get();
    let docs = [];
    consulta.forEach((doc) => {
      console.log("acaaa", doc.id);
      docs.push({ ...doc.data(), id: doc.id });
    });

    console.log("ddocs", docs);
    let encontrado = docs.find((val) => val.id === localesID);

    if (!encontrado) {
      throw new Error("El local no existe");
    }

    let comentarioEncontrado = encontrado.comentarios.find(
      (val) => val.id === comentarioID
    );

    if (!comentarioEncontrado) {
      throw new Error("El comentario no existe");
    }

    let modificado = encontrado.comentarios.filter(
      (val) => val.id !== comentarioID
    );

    encontrado.comentarios = modificado;

    await db
      .collection("locales")
      .doc(encontrado.id)
      .update({
        ...encontrado,
      });

    res.status(200).json({ message: "comentario eliminado" });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const db = admin.firestore();
    let consulta = await db.collection("locales").get();
    let docs = [];
    consulta.forEach((doc) => {
      console.log("acaaa", doc.id);
      docs.push({ ...doc.data(), id: doc.id });
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
