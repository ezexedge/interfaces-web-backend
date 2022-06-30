const admin = require('firebase-admin')
const firebase = require('../firebase')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const {getError} = require('../utils/firebase-error')




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
//console.log('no se puedo registrar', getError(err.errorInfo.code))


res.status(400).json({ 'error': getError(err.errorInfo.code) });
  }
};


exports.login = async(req,res) => {


  try{


  const {email,password} = req.body

   let result = await firebase.auth().signInWithEmailAndPassword(email,password)

   let token = jwt.sign({uid:result.user.uid,email: result.user.email},'123456')

  
   res.cookie('jwt',token,{expire: new Date() + 9999 })


  const db = admin.firestore();
  let consulta = await db.collection("users").get();
  let docs = [];
  consulta.forEach((doc) => {
    docs.push({ ...doc.data() });
  });


  let usuario = docs.find((val) => val.uid === result.user.uid);

  //console.log('encontrado',usuario)
  usuario.token = token

  res.status(200).json({'message': usuario})

  }catch(err){
    //  console.log('error',getError(err.code))

      res.status(400).json({'error': getError(err.code)})
  }



}


exports.logout = (req,res) => {
        try{

            res.clearCookie('jwt')

            res.status(200).json({
                'message' : 'success'
            })


        }catch(err){

            res.status(400).json({
                'error': 'error en logout'
            })

        }
}

exports.resetPassword = async (req, res) => {
    try {
      const { email } = req.params;
  
      await firebase.auth().sendPasswordResetEmail(email);
  
      res.status(200).json({
        message: "revise su bandeja de entrada",
      });
    } catch (err) {

      //console.log('aca el error',err)
      res.status(400).json({
        error: getError(err.code)
      });
    }
  };