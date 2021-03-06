import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { FirebaseContext } from '../../firebase';

import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/Error404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import { Boton } from '../../components/ui/Boton';


const ContenerProducto = styled.div`
    @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.div`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {

    // state del componente
    const [producto, guardarProducto] = useState({});
    const [error, guardarError] = useState(false); 
    const [comentario, guardarComentario] = useState({});

    const [constularBD, guardarConsultarBD] = useState(true);

    // Routing para obtener el id actual
    const router = useRouter();
    const { query: { id }} = router;

    // context de firebase, y de paso el usuario autenticado tambien....
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if (id && constularBD){
            
            const obtenerProducto = async () => {
                
                const productQuery = await firebase.db.collection('productos').doc(id);
                const product = await productQuery.get();
                if (product.exists){
                    guardarProducto( product.data() );
                    guardarConsultarBD(false);     
                }else{
                    guardarError(true);
                }
            }
            obtenerProducto();

        }
    }, [id, producto]);

    
    if (Object.keys(producto).length === 0 && !error)
        return <p>Cargando...</p>;


    const {
        comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;

    // Administrar y validar los votos...
    const votarProducto = async () => {
        if (!usuario) {
            return router.push('/login');
        }

        // obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        // Verificar si el usuario actual ha votado
        if (haVotado.includes(usuario.uid)) return;

        // Guardar el ID del usuario que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid];

        // Actualizar la base de datos
        try {
            await firebase.db.collection('productos').doc(id).update({ 
                    votos: nuevoTotal,
                    haVotado: nuevoHaVotado
                });
            
        } catch (error) {
            console.log(error);
        }


        // Actualizar el State
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        });

        // hay un VOTO por tanto consultar a la BD
        guardarConsultarBD(true); 
    }

    // Funciones para crear comentarios....
    const comentarioChange = (e) => {
        guardarComentario({
            ...comentario,
            [e.target.name]: e.target.value,
        });
        //console.log(comentario);
    }

    // Identifica si el comentario es del creador del producto
    const esCreador = (id) => {
        return (creador.id === id);
    }

    // funcion del submit para agregar comentarios
    const agregarComentario = async (e) => {
        e.preventDefault();

        if (!usuario) {
            return router.push('/login');
        }
        
        // informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;
        
        // Tomar copia de comentarios y agregarlos al arreglo.
        const nuevosComentarios = [...comentarios, comentario];

        try {
            // Actualizar la BD
            firebase.db.collection('productos').doc(id).update({
                comentarios: nuevosComentarios
            });

            // Actualizar el State
            guardarProducto({
                ...producto,
                comentarios: nuevosComentarios
            });

            // hay un COMENTARIO por tanto consultar a la BD
            guardarConsultarBD(true); 

            // Limpiar los comentarios
            document.getElementById('mensaje').value = '';
        } catch (error) {
            console.log(error);
        }
        
    }

    /**
     * Funcion que revisa que el creador del producto sea el mismo
     * que esta autenticado, para que lo puda borrar...
     */
    const puedeBorrar = () => {
        if (!usuario) return false;

        return (creador.id === usuario.uid);
    }

    const eliminarProducto = async () => {
        if (!usuario || creador.id !== usuario.uid) {
            return router.push('/login');
        }

        try {
        
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
            
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Layout>
            <>
               { error ? <Error404 /> : (
                    <div className="contenedor">
                        <h1 css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}>{nombre}</h1>

                        <ContenerProducto>
                            <div>
                                <p>Publicado hace: { 
                                formatDistanceToNow( new Date(creado), { locale: es} ) }</p>
                                <p>Por: {creador.nombre} de {empresa}</p>
                                <img src={urlimagen} alt=""/>
                                <p>{descripcion}</p>
                                
                                {usuario && (
                                    <>
                                        <h2>Agrega tu comentario</h2>
                                        <form 
                                            onSubmit={agregarComentario}
                                        >
                                        <Campo>
                                            <input 
                                                type="text"
                                                id="mensaje"
                                                name="mensaje"
                                                onChange={comentarioChange}
                                                
                                            />
                                        </Campo>
                                        <InputSubmit
                                            type="submit"
                                            value="Agregar Comentario"
                                        ></InputSubmit>
                                        </form>
                                    </>
                                )}

                                <h2
                                    css={css`
                                        margin: 2rem 0;
                                    `}
                                >Comentarios</h2>
                                {comentarios.length === 0 ? "Aun no hay comentarios" : (
                                    <ul>
                                    {comentarios.map((comentario, i) => (
                                        <li
                                            key={`${comentario.usuarioId}-${i}`}
                                            css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                            `}
                                        >
                                            <p>{comentario.mensaje}</p>
                                            <p>Escrito por: 
                                                <span 
                                                    css={css`
                                                        font-weight: bold;
                                                    `}
                                                >{' '}{comentario.usuarioNombre}</span>
                                            </p>

                                            { esCreador( comentario.usuarioId ) && 
                                            <CreadorProducto>Es creador</CreadorProducto> }
                                        </li>
                                    ))}
                                    </ul>
                                )}
                                
                            </div>

                            <aside>
                                <Boton
                                    target="_blank"
                                    bgColor="true"
                                    href={url}
                                >Visitar URL</Boton>

                                

                                <div css={css`
                                    margin-top: 5rem;
                                `}>
                                </div>
                                <p css={css`
                                    text-align: center;
                                `} >{votos} Votos</p>
                                {usuario && (
                                    <Boton
                                        onClick={votarProducto}
                                    >Votar</Boton>
                                )}
                                
                            </aside>
                        </ContenerProducto>
                        
                        { puedeBorrar() && 
                            <Boton
                                onClick={eliminarProducto}
                            >Eliminar Producto</Boton>
                        }

                    </div>

               )} 

               
            </>
        </Layout>
    );
};

export default Producto;