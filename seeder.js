const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "https://SECRET.firebaseio.com",
});

const importData = async () => {
  try {
    let db = admin.firestore();

    let categorias = ["pepa", "coco", "tony", "didi", "juana"];

    let consulta = await db.collection("categorias").get();

    let docs = [];
    consulta.forEach((doc) => {
      docs.push({ ...doc.data() });
    });

    if (docs.length > 0) {
      throw new Error("Ya existen cargadas las categorias");
    }

    for (let val of categorias) {
      let obj = {
        nombre: val,
      };

      await db.collection("categorias").add(obj);
    }

    console.log("categorias creadas con exito");
    process.exit();
  } catch (error) {
    console.log("error", error.message);

    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    const db = admin.firestore();

    let consulta = await db.collection("categorias").get();
    let docs = [];
    consulta.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
    });

    for (let val of docs) {
      await db.collection("categorias").doc(val.id).delete();
    }

    console.log("eliminado todoo correctamente");
    process.exit();
  } catch (err) {
    console.log("error", err);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  deleteData();
} else {
  importData();
}
