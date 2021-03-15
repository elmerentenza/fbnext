export default function validarNuevoProducto(valores) {
    let errores = {};
    
    // Validar el nombre
    if (!valores.nombre){
        errores.nombre = "El Email es Obligatorio";
    }

    // Validar el nombre de la empresa
    if (!valores.empresa){
        errores.empresa = "El nombre de la empresa es obligatorio";
    }

    // validar url
    if (!valores.url) {
        errores.url = "El url del producto es obligatorio";
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "Url mal formateada o no valido";
    }

    // validar descripcion
    if (!valores.descripcion){
        errores.descripcion = "Agrega la descripcion de tu producto";
    }

    return errores;
}