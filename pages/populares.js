import React from "react";
import DetallesProducto from "../components/layout/DetallesProducto";
import Layout from "../components/layout/Layout";
import useProductos from "../hooks/useProductos";

const Populares = () => {
    const {productos} = useProductos('votos');
    return (
        <Layout>
        <h1>Populares</h1>
        <div className="listado-productos">
            <div className="contenedor">
            <ul className="bg-white">
                {productos.map((producto) => (
                <DetallesProducto key={producto.id} producto={producto} />
                ))}
            </ul>
            </div>
        </div>
        </Layout>
    );
};

export default Populares;
