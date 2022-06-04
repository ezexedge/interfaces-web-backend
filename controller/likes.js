const admin = require("firebase-admin");
const firebase = require("../firebase");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const shortid = require("shortid");
global.XMLHttpRequest = require("xhr2");

exports.likesLocales = async (req, res) => {
  try {
    const { localesID } = req.params;

    let idUsuario = "122345";

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

    let existeUsuario = encontrado.likes.find((val) => val === idUsuario);

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
