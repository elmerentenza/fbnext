 import app from "firebase/app";
 import firebaseConfig from "./config";
 import "firebase/auth";
 import 'firebase/firestore';
 import 'firebase/storage';

 class Firebase {
     constructor() {
         if (!app.apps.length) {
            app.initializeApp(firebaseConfig);
         }

         this.auth = app.auth();
         this.db = app.firestore();
         this.storage = app.storage();

         
         // Enable Firestore Cache
         //firebase.firestore()
        //  this.db
        //     .enablePersistence()
        //     .catch((err) => {
        //         console.error(' ############### PERSITANCE ############## ', err);
        //     });

     }

     // Registrar un usuario en Firebase
     async registrar(nombre, email, pass) {
         const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email, pass);
         return await nuevoUsuario.user.updateProfile({
             displayName: nombre
         })
     }


     // Iniciar Sesion de Usuario
     async login(email, pass){
         return await this.auth.signInWithEmailAndPassword(email, pass);
     }

     // Cierra la session del usuario
     async cerrarSesion(){
         await this.auth.signOut();
     }
 }

 const firebase = new Firebase();
 export default firebase;