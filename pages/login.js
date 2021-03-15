import React, { useState } from "react";
import {css} from '@emotion/react';
import Layout from "../components/layout/Layout";
import Router from "next/router";
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import firebase from "../firebase/index";

// validacion
import useValidacion from "../hooks/useValidacion";
import validarIniciarSesion from "../validacion/validarIniciarSesion";

const STATE_INICIAL = {
  email: '',
  password: ''
}

const Login = () => {

  const [error, guardarError] = useState('');

  const { 
      valores,
      errores,
      handleSubmit,
      handleChange,
      handleOnBlur
  } = useValidacion(STATE_INICIAL, validarIniciarSesion, fnIniciarSesion);

  const {email, password} = valores;
  

  async function fnIniciarSesion(){
      try {
          const usuario = await firebase.login(email, password);
          console.log(usuario);
          Router.push('/');
      } catch (error) {
          console.log('Hubo un error al autenticar el usuario', error.message, error);
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
         >Iniciar Sesion</h1> 
         <Formulario
              onSubmit={handleSubmit}
              noValidate
         >
             
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
                  value="Iniciar Sesión"
             />

         {error && <Error>{error}</Error>}

         </Formulario>


      </Layout>
  );
};

export default Login;
