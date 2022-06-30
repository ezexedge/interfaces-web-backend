const firebase = require("../firebase");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const moment = require("moment");
const utils = require("../utils/suffle");
const admin = require('firebase-admin')

const db = admin.firestore

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
          descripcion,
          pais,
          provincia,
          localidad
      } = req.body;


      let consulta = await db().collection("categorias").get();
      let docsCategorias = [];
      consulta.forEach((doc) => {
         // console.log("acaaa", doc.id);
          docsCategorias.push({...doc.data(), id: doc.id });
      });

      let categoriaEncontrada = docsCategorias.find((val) => val.id === categoria);
   

      let obj = {
          nombre: nombre,
          calle: calle,
          altura: altura,
          latitud: latitud,
          longitud: longitud,
          horaApertura: horaApertura,
          horaCierre: horaCierre,
          imagen: imagen,
          pais: pais ? pais : '',
          provincia: provincia?provincia:'',
          localidad: localidad?localidad:'',
          likes: [],
          dislikes: [],
          comentarios: [],
          categoria: categoria,
          createdAt: new Date(),
          usuario:usuario,
          descripcion: descripcion,
          nombreCategoria: categoriaEncontrada.nombre
      };

    let result =  await db().collection("locales").add(obj);
      //console.log('acaaa creo local',result)
      res.status(200).json({ message: result });
  } catch (error) {
      res.status(400).json({
          error: error.message,
      });
  }
};
exports.getLocales = async(req, res) => {
    try {
      
        let consulta = await db().collection("locales").get();
        let docs = [];
        consulta.forEach((doc) => {
           // console.log("acaaa", doc.id);
            docs.push({...doc.data(), id: doc.id });
        });


        let sortedDates = docs.sort(function(a, b){
          return moment(b.createdAt).format()-moment(a.createdAt).format()
        });

        res.status(200).json({ data: sortedDates });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
}

exports.getCategorias = async(req,res) => {
    try{
        let consulta = await db().collection("categorias").get();
        let docs = [];
        consulta.forEach((doc) => {
           // console.log("acaaa", doc.id);
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

        let consulta = await db().collection("locales").get();
        let docs = [];
        consulta.forEach((doc) => {
           // console.log("acaaa", doc.id);
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



        let consultaUsers = await db().collection("users").get();
        let docsUsers = [];
        consultaUsers.forEach((doc) => {
            docsUsers.push({...doc.data(), id: doc.id });
        });

        let usuarioEncontrado = docsUsers.find(val => val.uid === user )

        

        if(!usuarioEncontrado)throw new Error('El usuario no existe')

        let consulta = await db().collection("locales").get();
        let docs = [];
        consulta.forEach((doc) => {
            //console.log("acaaa", doc.id);
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

        let consulta = await db().collection("locales").get();
        let docs = [];
        consulta.forEach((doc) => {
            //console.log("acaaa", doc.id);
            docs.push({...doc.data(), id: doc.id });
        });

        let localEncontrado = docs.find(val => val.id === id )

        if(!localEncontrado)throw new Error(`El id: ${id} no existe`)

        await db().collection("locales").doc(id).delete();

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
  
      let consulta = await db().collection("locales").get();
      let docs = [];
      consulta.forEach((doc) => {
        //console.log("acaaa", doc.id);
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
  
      await db()
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
  
      let consulta = await db().collection("locales").get();
      let docs = [];
      consulta.forEach((doc) => {
        //console.log("acaaa", doc.id);
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
  
      await db()
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

  exports.getPopulares = async(req, res) => {
    try {
        let consulta = await db().collection("locales").get();
        let docs = [];
        consulta.forEach((doc) => {
            //console.log("acaaa", doc.id);
            docs.push({...doc.data(), id: doc.id });
        });

        docs = docs.filter(val => val.likes.length > 0) 

        let ordenado = docs.sort(function(a, b) {
          return b.likes.length - a.likes.length
        });
        res.status(200).json({ data: ordenado });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
}



exports.editar = async(req, res) => {
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
          descripcion,
          likes,
          dislikes,
          createdAt
      } = req.body;

      const {id} = req.params

      //console.log('acaa esta el id',id)

      let consulta2 = await db().collection("categorias").get();
      let docsCategorias = [];
      consulta2.forEach((doc) => {
         // console.log("acaaa", doc.id);
          docsCategorias.push({...doc.data(), id: doc.id });
      });

      let categoriaEncontrada = docsCategorias.find((val) => val.id === categoria);
   


      

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
          descripcion: descripcion,
          nombreCategoria: categoriaEncontrada.nombre

      };

              let consulta = await db().collection("locales").get();
        let docs = [];
        consulta.forEach((doc) => {
            //console.log("acaaa", doc.id);
            docs.push({...doc.data(), id: doc.id });
        });

        let encontrado = docs.find((val) => val.id === id);

        if (!encontrado) throw new Error(`El local con el id: ${id} no existe`);


    let result =  await db().collection("locales").doc(id).update(obj)
      //console.log('acaaa edito local',result)
      res.status(200).json({ message: result });
      
  } catch (error) {
      res.status(400).json({
          error: error.message,
      });
  }
};