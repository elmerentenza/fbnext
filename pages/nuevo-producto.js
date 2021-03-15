import React, { useContext, useState } from "react";
import {css} from '@emotion/react';
import Layout from "../components/layout/Layout";
import Router, { useRouter } from "next/router";
import FileUploader from 'react-firebase-file-uploader';
import {Formulario, Campo, InputSubmit, Error, Subido} from '../components/ui/Formulario';

import { FirebaseContext, UPLOAD_FOLDER } from "../firebase/index";


// validacion
import useValidacion from "../hooks/useValidacion";
import validarNuevoProducto from "../validacion/validarNuevoProducto";
import Error404 from "../components/layout/Error404";



const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    imagen: '',
    url: '',
    descripcion: ''
}

const NuevoProducto = () => {

    // state para las imagenes
    const [nombreimagen, guardarNombreImagen] = useState('');
    const [subiendo, guardarSubiendo] = useState(false);
    const [progreso, guardarProgreso] = useState(0);
    const [urlimagen, guardarUrlImagen] = useState(''); 

    const [error, guardarError] = useState('');

    const { 
        valores,
        errores,
        handleSubmit,
        handleChange,
        handleOnBlur
    } = useValidacion(STATE_INICIAL, validarNuevoProducto, fnCrearNuevoProducto);

    const {nombre, empresa, imagen, url, descripcion } = valores;
    
    // hooks de router para redireccionar
    const router = useRouter();

    // context con las operaciones CRUD de firebase
    const {usuario, firebase} = useContext(FirebaseContext);

    async function fnCrearNuevoProducto(){

        if (!usuario){
            return router.push('/login')
        }

        // crear objeto del nuevo producto.. 
        const producto = {
            nombre,
            empresa,
            url,
            urlimagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: { 
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado: []
        }

        try {
            //insertar un producto en la base de datos...
            const resultado = await firebase.db.collection('productos').add(producto);
            
            // redireccionando a la pagina de inicio
            router.push('/');

        } catch (error) {
            console.log('Hubo un error al insertar el producto', error.message, error);
            guardarError(error.message);
        }
        
    }

    // funciones complementarias para la subida de archivos.
    const handleUploadStart = () => {
        console.log('upload start ---- ');
        guardarProgreso(0);
        guardarSubiendo(true);
    }

    const handleProgress = progreso => {
        console.log('progreso ---- ',progreso);
        guardarProgreso({ progreso });

    };

    const handleUploadError = (error) => {
        console.log('upload error ---- ',error);
        guardarSubiendo(error);
        console.error(error);
    };

    const handleUploadSuccess = async filename => {
        console.log('upload success ---- ',filename);
        guardarProgreso(100);
        guardarSubiendo(false);
        guardarNombreImagen(filename);
        const downloadUrl =
        await firebase
            .storage
            .ref(UPLOAD_FOLDER)
            .child(filename)
            .getDownloadURL()
            .then(url => {
                console.log(url);
                guardarUrlImagen(url);
            })
            ;
        console.log('downloadURL --- ', downloadUrl);

    };


    return (
        <Layout>
            
            {!usuario ? <Error404 /> : (
                <>
                <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                >Nuevo Producto</h1> 
                <Formulario
                        onSubmit={handleSubmit}
                        noValidate
                >
                    <fieldset>
                            <legend>Información general</legend>
                            
                    
                            {/* Nombre */}
                            <Campo>
                                <label htmlFor="nombre">Nombre</label>
                                <input 
                                        type="text" 
                                        id="nombre"
                                        placeholder="Nombre del producto"
                                        name="nombre"
                                        value={nombre}
                                        onChange={handleChange}
                                        onBlur={handleOnBlur}
                                    />
                            </Campo>
                            {errores.nombre && <Error>{errores.nombre}</Error>}
                            
                            {/* Empresa */}
                            <Campo>
                                <label htmlFor="nombre">Empresa</label>
                                <input 
                                        type="text" 
                                        id="empresa"
                                        placeholder="Nombre Empresa o Compañía"
                                        name="empresa"
                                        value={empresa}
                                        onChange={handleChange}
                                        onBlur={handleOnBlur}
                                    />
                                
                            </Campo>
                            {errores.empresa && <Error>{errores.empresa}</Error>}
                            
                            {/* Url */}
                            <Campo>
                                <label htmlFor="nombre">Url</label>
                                <input 
                                        type="text" 
                                        id="url"
                                        placeholder="Url de producto"
                                        name="url"
                                        value={url}
                                        onChange={handleChange}
                                        onBlur={handleOnBlur}
                                    />
                            </Campo>
                            {errores.url && <Error>{errores.url}</Error>}

                            {/* Imagen */}
                            <Campo>
                                <label htmlFor="nombre">Imagen</label>
                                <FileUploader 
                                        accept="image/*"
                                        id="imagen"
                                        name="imagen"
                                        randomizeFilename
                                        storageRef={firebase.storage.ref(UPLOAD_FOLDER)}
                                        onUploadStart={handleUploadStart}
                                        onUploadError={handleUploadError}
                                        onUploadSuccess={handleUploadSuccess}
                                        onProgress={handleProgress}                                
                                    />
                            </Campo>
                            {/* progreso === 100 */}
                            {progreso === 100 && (
                                <Subido>
                                    <p>Subido ok!!!</p>
                                    {/* <img src="/static/img/ok.jpg" alt="" /> */}
                                </Subido>
                            )}
                    </fieldset>


                    <fieldset>
                        <legend>Sobre tu producto</legend>
                        {/* Descripcion */}
                        <Campo>
                                <label htmlFor="nombre">Descripcion</label>
                                <textarea 
                                        
                                        id="descripcion"
                                        placeholder="Descripcion"
                                        name="descripcion"
                                        value={descripcion}
                                        onChange={handleChange}
                                        onBlur={handleOnBlur}
                                    />
                            </Campo>
                            {errores.descripcion && <Error>{errores.descripcion}</Error>}
                    </fieldset> 

                    <InputSubmit 
                            type="submit"
                            value="Crear Producto"
                    />
        
                {error && <Error>{error}</Error>}

                </Formulario>
                </>                
            )}
           


        </Layout>
    );
};

export default NuevoProducto;