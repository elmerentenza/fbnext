import React, { useState } from "react";
import {css} from '@emotion/react';
import Layout from "../components/layout/Layout";
import Router from "next/router";
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import firebase from "../firebase/index";

// validacion
import useValidacion from "../hooks/useValidacion";
import validarCrearCuenta from "../validacion/validarCrearCuenta";



const STATE_INICIAL = {
    nombre: '',
    email: '',
    password: ''
}

const CrearCuenta = () => {

    const [error, guardarError] = useState('');

    const { 
        valores,
        errores,
        handleSubmit,
        handleChange,
        handleOnBlur
    } = useValidacion(STATE_INICIAL, validarCrearCuenta, fnCrearCuenta);

    const {nombre, email, password} = valores;
    

    async function fnCrearCuenta(){
        try {
            await firebase.registrar(nombre, email, password);
            Router.push('/');
        } catch (error) {
            console.log('Hubo un error al crear el usuario', error.message, error);
            guardarError(error.message);
        }
    }


    return (
        <Layout>
           <h1
                css={css`
                    text-align: center;
                    margin-top: 5rem;
                `}
           >Crear Cuenta</h1> 
           <Formulario
                onSubmit={handleSubmit}
                noValidate
           >
               
               {/* Nombre */}
               <Campo>
                   <label htmlFor="nombre">Nombre</label>
                   <input 
                        type="text" 
                        id="nombre"
                        placeholder="Tu Nombre"
                        name="nombre"
                        value={nombre}
                        onChange={handleChange}
                        onBlur={handleOnBlur}
                    />
               </Campo>
               {errores.nombre && <Error>{errores.nombre}</Error>}
               
               {/* Email */}
               <Campo>
                   <label htmlFor="email">Email</label>
                   <input 
                        type="email" 
                        id="email"
                        placeholder="Tu Email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        onBlur={handleOnBlur}
                    />
               </Campo>
               {errores.email && <Error>{errores.email}</Error>}
               
               {/* Password */}
               <Campo>
                   <label htmlFor="password">Password</label>
                   <input 
                        type="password" 
                        id="password"
                        placeholder="Tu Password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        onBlur={handleOnBlur}
                    />
               </Campo>
               {errores.password && <Error>{errores.password}</Error>}

               <InputSubmit 
                    type="submit"
                    value="Crear Cuenta"
               />
 
           {error && <Error>{error}</Error>}

           </Formulario>


        </Layout>
    );
};

export default CrearCuenta;