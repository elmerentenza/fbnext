import React, { useEffect, useState } from 'react';

const useValidacion = (stateInicial, fnValidacion, fnSubmit) => {

    const [valores, guardarValores] = useState(stateInicial);
    const [errores, guardarErrores] = useState({});
    const [submitForm, guardarSumitForm] = useState(false);

    useEffect(() => {
        if (submitForm){
            
            let noErrores;
            if (errores){
                noErrores = Object.keys(errores).length === 0;
            }
            
            if (noErrores){
                // Fn = Funcion que se ejecuta en el componente
                // en caso de que todo este bien en la validacion
                // de lo contrario, la proxima linea se pone submit en false
                // y se obliga a volver a hacer clic en el boton submit...
                fnSubmit(); 
            }
            guardarSumitForm(false);
        }
    }, [submitForm]);

    
    // Funcion que se ejecuta conforme el usuario escribe algo.
    const handleChange = e => {
        guardarValores({
            ...valores,
            [e.target.name] : e.target.value,
        });

        guardarErrores(fnValidacion(valores));

    }

    // Funcion que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault();
        /* 
        "Validar" es la funcion que le pasaremos al hook para que valide
        los campos del formulario
        */
        const erorresValidacion = fnValidacion(valores);
        
        /* esto para que en caso de que hallan errores se queden guardados */
        guardarErrores(erorresValidacion);
        
        guardarSumitForm(true);
    }

    // Funcion para manejar el evento onBlur
    const handleOnBlur = () => {
        guardarErrores(fnValidacion(valores));
    }

    return {
        valores,
        errores,
        handleSubmit,
        handleChange,
        handleOnBlur
    };
};

export default useValidacion;