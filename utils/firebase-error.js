const firebaseError = require('../firebase-error.json')
exports.getError = (code) => {

    let msg = 'error'
    for(let val in firebaseError[0]){
         if(code === val){
             msg = firebaseError[0][val]
         }
        }

        return msg
    }

//    console.log('encontrar error',encontrarError)

