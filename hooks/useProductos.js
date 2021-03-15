import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../firebase';

export default function useProductos(criterio) {
    const [productos, guardarProductos] = useState([]);
    const { firebase } = useContext(FirebaseContext);
  
    useEffect(() => {
      const obtenerProductos = async () => {
        try {
          await firebase.db.collection("productos")
                              .orderBy(criterio, 'desc')
                              .onSnapshot(manejarSnapshot);
        } catch (error) {
          console.log(error);
        }
      }
      obtenerProductos();
  
    }, []);
  
    function manejarSnapshot(snapshot) {
      const products = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      });
      
      guardarProductos(products);
    }
    
    return { productos }
}