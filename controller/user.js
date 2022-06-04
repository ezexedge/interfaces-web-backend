const admin = require("firebase-admin");
const firebase = require("../firebase");
const jwt = require("jsonwebtoken");
const multer = require("multer");
global.XMLHttpRequest = require("xhr2");

exports.user = async (req, res) => {
  try {
    let cookie = req.cookies["jwt"];

    const data = await jwt.decode(cookie);

    const db = admin.firestore();
    let consulta = await db.collection("users").get();
    let docs = [];
    consulta.forEach((doc) => {
      docs.push({ ...doc.data() });
    });

    let usuario = docs.find((val) => val.uid === data.uid);

    res.status(200).json({
      message: usuario,
    });

    console.log(data);
    // console.log('cookiesss de user',cookie)
  } catch (err) {
    console.log("error", err);
    res.status(400).json({ error: "no estas autenticado" });
  }
};

exports.userUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const { nombre, apellido, imagen } = req.body;

    let db = admin.firestore();

    let consulta = await db.collection("users").get();
    let docs = [];
    consulta.forEach((doc) => {
      console.log("acaaa", doc.id);
      docs.push({ ...doc.data(), id: doc.id });
    });

    console.log("aca los docs", docs);

    let usuario = docs.find((val) => val.uid === id);

    let imagenCurrent = usuario.imagen;

    await db
      .collection("users")
      .doc(usuario.id)
      .update({
        ...usuario,
        nombre: nombre,
        apellido: apellido,
        imagen: imagen ? imagen : imagenCurrent,
      });

    res.status(200).json({
      message: "modificado",
    });
  } catch (err) {
    console.log("error", err);
    res.status(400).json({ error: "no estas autenticado" });
  }
};
