import React, { useEffect, useState } from "react";
import DetallesProducto from "../components/layout/DetallesProducto";
import Layout from "../components/layout/Layout";
import useProductos from "../hooks/useProductos";
import { useRouter } from "next/router";

const Buscar = () => {
  const router = useRouter();
  const { query: { q } } = router;
  
  // Todos los productos
  const { productos } = useProductos('creado');
  const [resultado, guardarResultado] = useState([]);

  useEffect(() => {
      const busqueda = q.toLowerCase();
      const filtro = productos.filter(producto => {
          return (
              producto.nombre.toLowerCase().includes(busqueda) ||
              producto.descripcion.toLowerCase().includes(busqueda)
          )
      })
      guardarResultado(filtro);

  }, [q, productos]);

  return (
    <Layout>
      <h1>Buscar</h1>
      <div className="listado-productos">
        <div className="contenedor">
          <ul className="bg-white">
            {resultado.map((producto) => (
              <DetallesProducto key={producto.id} producto={producto} />
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Buscar;
