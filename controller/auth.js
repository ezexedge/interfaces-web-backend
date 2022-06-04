const admin = require("firebase-admin");
const firebase = require("../firebase");
const jwt = require("jsonwebtoken");
const multer = require("multer");
global.XMLHttpRequest = require("xhr2");

exports.registrar = async (req, res) => {
  try {
    const { email, nombre, apellido, password } = req.body;

    const db = admin.firestore();

    let result = await admin.auth().createUser({
      email: email,
      password: password,
    });

    let obj = {
      email: email,
      nombre: nombre,
      apellido: apellido,
      uid: result.uid,
      imagen: "",
    };

    await db.collection("users").add(obj);


    res.status(200).json({ message: "creado correctamente" });
  } catch (err) {
    console.log("error", err);
    res.status(400).json({ error: "no se pudo crear el usuario" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let result = await firebase.auth().signInWithEmailAndPassword(email, password);

    let token = await jwt.sign(
      { uid: result.user.uid, email: result.user.email },
      "123456",
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, { expire: new Date() + 9999 });

    res.status(200).json({ message: token });
  } catch (err) {
    console.log("error", err);
    res.status(400).json({ error: "no se pudo logear" });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    res.status(400).json({
      error: "error en logout",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.params;

    await firebase.auth().sendPasswordResetEmail(email);

    res.status(200).json({
      message: "revise su bandeja de entrada",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};