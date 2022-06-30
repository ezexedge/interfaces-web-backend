const app = require('../server')
const request = require('supertest')
const randomEmail = require('random-email');
const moment = require("moment");

describe('GET /api/locales',()=>{
    test('deberia regresar un status 200', async()=>{
        const response = await request(app).get('/api/locales').send()
        expect(response.status).toBe(200)
    
    })
})

describe('GET /api/locales/ordenados',()=>{
    test('deberia regresar un status 200', async()=>{
        const response = await request(app).get('/api/locales/ordenados').send()
        expect(response.status).toBe(200)
    
    })
})


describe('GET /api/locales/:id',()=>{
   
    test('deberia regresar un status 200', async()=>{
        const response = await request(app).get('/api/locales/6Yfskfe6ABn0y9lYyqge').send()
        expect(response.status).toBe(200)
    
    })

    test('deberia regresar un mensaje de error', async()=>{
        const response = await request(app).get('/api/locales/xxx').send()
        expect(JSON.parse(response.error.text)['error']).toBe('El local con el id: xxx no existe')
    
    })
})


describe('POST /api/crear-local',()=>{
    test('deberia regresar un status 200 al crear el local', async()=>{

        try{
        const response = await request(app).post('/api/crear-local').send({
            nombre: "prueba",
            calle: "falsa",
            altura: "123",
            latitud: -7.271854499999999,
            longitud: 112.7492258,
            horaApertura: "10:00",
            horaCierre:  "10:00",
            imagen: "https://ichef.bbci.co.uk/news/800/cpsprodpb/127AF/production/_110259657_tv058727610.jpg.webp",
            likes: [],
            dislikes: [],
            comentarios: [],
            categoria: "hN9XMGXD0MPqgp7tsXbw",
            createdAt: moment().format("YYYY-MM-DD"),
            usuario:"Lu0YxvFEk3d0vxVDhRzqxpzCQ6R2",
            descripcion: "esto es una descripcion"
        })


        expect(response.status).toBe(200)
  
       
       await request(app).delete(`/api/locales/${JSON.parse(response.text)['message']['_path']['segments'][1]}`)
    }catch(err){
        console.log('error',err)
    }
    })

})


describe('DELETE /api/locales/:id',()=>{
    test('deberia regresar un status 200 al eliminar un local', async()=>{
        try{
        const response = await request(app).post('/api/crear-local').send({
            nombre: "prueba",
            calle: "falsa",
            altura: "123",
            latitud: -7.271854499999999,
            longitud: 112.7492258,
            horaApertura: "10:00",
            horaCierre:  "10:00",
            imagen: "https://ichef.bbci.co.uk/news/800/cpsprodpb/127AF/production/_110259657_tv058727610.jpg.webp",
            likes: [],
            dislikes: [],
            comentarios: [],
            categoria: "hN9XMGXD0MPqgp7tsXbw",
            createdAt: moment().format("YYYY-MM-DD"),
            usuario:"Lu0YxvFEk3d0vxVDhRzqxpzCQ6R2",
            descripcion: "esto es una descripcion"
        })


 
         const responseDelete = await request(app).delete(`/api/locales/${JSON.parse(response.text)['message']['_path']['segments'][1]}`)
         expect(responseDelete.status).toBe(200)

    }catch(err){
        console.log('error',err)
    }

    })

    test('deberia regresar un status 400', async()=>{
        const response = await request(app).delete('/api/locales/xxxededxx').send()
        expect(JSON.parse(response.error.text)['error']).toBe('El id: xxxededxx no existe')
        expect(response.status).toBe(400)
    
    })

})



describe('GET /api/locales/user/:user',()=>{
    test('deberia regresar un status 200', async()=>{
        const response = await request(app).get('/api/locales/user/G4x4i3wSTNMoDV4xZHxGo72Ss7j2').send()
        expect(response.status).toBe(200)
    
    })
    test('deberia regresar un status 400 y un mensaje de error', async()=>{
        const response = await request(app).get('/api/locales/user/xxx').send()
        expect(JSON.parse(response.error.text)['error']).toBe('El usuario no existe')
        expect(response.status).toBe(400)

    
    })
})




//login
describe('POST /api/login',()=>{
    test('deberia regresar un status 200 a un usuario existente', async()=>{
        const response = await request(app).post('/api/login').send({
            email: 'enzo@gmail.com',
            password: '123456'
        })
        expect(response.status).toBe(200)

    
    })

    test('deberia regresar un status 400 a un usuario que no existe', async()=>{
        const response = await request(app).post('/api/login').send({
            email: 'pdwodwedweoidio@gmail.com',
            password: '123456'
        })
        expect(response.status).toBe(400)

    
        
    })

})


describe('POST /api/logout',()=>{
    test('deberia regresar un status 200 ', async()=>{
        const response = await request(app).post('/api/logout')
        expect(response.status).toBe(200)

    
    })



})

describe('POST /api/registar',()=>{
    test('generar nuevos usuarios y se espera una respuesta 200', async()=>{
        const response = await request(app).post('/api/registrar').send({
            email: randomEmail({ domain: 'gmail.com' }),
            nombre: 'coco',
            apellido: 'didi',
            password: '123456'
        })
        expect(response.status).toBe(200)

    
    })

    test('se espera error por un password menor a 6 caracteres ', async()=>{
        const response = await request(app).post('/api/registrar').send({
            email: randomEmail({ domain: 'gmail.com' }),
            nombre: 'coco',
            apellido: 'didi',
            password: '1236'
        })

        expect(JSON.parse(response.error.text)['error']).toBe('La contraseña no es válida, debe tener al menos 6 caracteres de longitud')

    
    })

    test('se espera error por repetir el email ', async()=>{
        const response = await request(app).post('/api/registrar').send({
            email: 'enzo@gmail.com',
            nombre: 'coco',
            apellido: 'didi',
            password: '123456'
        })
        expect(JSON.parse(response.error.text)['error']).toBe('El correo electrónico proporcionado ya está en uso')

    
    })


})



describe('POST /reset-password/:email',()=>{
    test('deberia regresar un status 200 a un usuario existente', async()=>{
        const response = await request(app).post('/api/reset-password/enzo@gmail.com')
        expect(response.status).toBe(200)

    
    })

    test('deberia regresar un status 400 a un usuario que no existe', async()=>{
        const response = await request(app).post(`/api/reset-password/${randomEmail({ domain: 'gmail.com' })}`)
        expect(response.status).toBe(400)

    
        
    })


})

describe('PUT /likes/:localId/:userId',()=>{
    test('deberia regresar un status 200', async()=>{
        const response = await request(app).put('/api/likes/6Yfskfe6ABn0y9lYyqge/G4x4i3wSTNMoDV4xZHxGo72Ss7j2')
        expect(response.status).toBe(200)

    
    })

    test('deberia regresar un status 400 al id de un local que no existe', async()=>{
        const response = await request(app).put('/api/likes/xxxxx/G4x4i3wSTNMoDV4xZHxGo72Ss7j2')
        expect(response.status).toBe(400)

    
    })

})

    describe('PUT /dislikes/:localId/:userId',()=>{
        test('deberia regresar un status 200', async()=>{
            const response = await request(app).put('/api/dislikes/6Yfskfe6ABn0y9lYyqge/G4x4i3wSTNMoDV4xZHxGo72Ss7j2')
            expect(response.status).toBe(200)
    
        
        })
    
        test('deberia regresar un status 400 al id de un local que no existe', async()=>{
            const response = await request(app).put('/api/dislikes/xxxxx/G4x4i3wSTNMoDV4xZHxGo72Ss7j2')
            expect(response.status).toBe(400)
    
        
        })
    
    })




