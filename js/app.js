let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente( ) {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Revisar si hay campos vacios
    const camposVacios = [ mesa, hora ].some( campo => campo === '');
        
    if(camposVacios) {
        // Verificar si ya hay una alerta
        const existeAlerta = document.querySelector('.invalid-feedback');

            if(!existeAlerta) {
                const alerta = document.querySelector('div');
                alerta.classList.add('invalid-feedback', 'd-block', 'text-center') 
                alerta.textContent = 'Todos los campos son obligatorios';
                document.querySelector('.modal-body form').appendChild(alerta);

                setTimeout(() => {
                    alerta.remove( );
                }, 3000);
            }
        return;
    }

    // Asignar datos del formulario a cliente
    cliente = { ...cliente, mesa, hora };

    // Ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide( ); 

    // Mostrar las secciones
    mostrarSecciones( );

    // Obtener platillos de la API de JSON-Server
    obtenerMenu( );
}

// Mostrando las secciones de Menu y resumen
function mostrarSecciones( ) {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach( seccion => seccion.classList.remove('d-none'));
}

function obtenerMenu( ) {
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then( respuesta => respuesta.json( ))
        .then( resultado => mostrarMenu(resultado))
        .catch( error => console.log(error))
}

function mostrarMenu(menu) {
    const contenido = document.querySelector('#menu .contenido')

    menu.forEach( platos => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platos.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platos.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platos.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number'
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platos.id}`;
        inputCantidad.classList.add('form-control');

        // Funci??n que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function ( ) {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlato({...platos, cantidad});
        } 

        const agregarInput = document.createElement('div');
        agregarInput.classList.add('col-md-2');
        agregarInput.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregarInput);

        contenido.appendChild(row);
    })
}

function agregarPlato(producto) {
    // Extraer el pedido actual
    let { pedido } = cliente;

    // Revisar que la cantidad sea mayor a 0
    if(producto.cantidad > 0) {

        // Comprueba si el elemento ya existe en el array
        if(pedido.some( articulo => articulo.id === producto.id)) {
            // El articulo ya existe, Actualizar la cantidad
            const pedidoActualizado = pedido.map( articulo => {
                if( articulo.id === producto.id ) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            } );
            // Se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else {
            // El articulo no existe, lo agregamos al array de pedido
            cliente.pedido = [...pedido, producto];
        }
        
    } else {
        // Eliminar pedido cuando la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id );
        cliente.pedido = [...resultado];
    }
    // Limpiar el codigo HTML previo
    limpiarHTML( );

    if(cliente.pedido.length) {
        // Mostrar el resumen
        mostrarResumen( );
    } else {
        mensajePedidoVacio( );
    }
}

function mostrarResumen( ) {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'shadow', 'py-3', 'mb-3');

    // Informacion de la mesa
    const mesa = document.createElement('p');
    mesa.classList.add('fw-bold');
    mesa.textContent = 'Mesa: ';

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    // Informacion de la hora
    const hora = document.createElement('p');
    hora.classList.add('fw-bold');
    hora.textContent = 'Hora: ';

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    // Titulo de la seccion 
    const heading = document.createElement('h3');
    heading.textContent = 'Platos Consumidos';
    heading.classList.add('my-4', 'text-center');

    // Iterar sobre el array de pedidos
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');
    
    const { pedido } = cliente;
    pedido.forEach( articulo => {
        const { nombre, precio, cantidad, id } = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        // Cantidad del articulo
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        // Precio de articulo
        const precioEl = document.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        // Subtotal del articulo
        const subtotalEl = document.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        // Boton para eliminar desde el resumen
        const botonEliminar = document.createElement('button');
        botonEliminar.classList.add('btn', 'btn-danger');
        botonEliminar.textContent = 'Eliminar el pedido';

        // Funcion para eliminar el pedidod
        botonEliminar.onclick = function ( ) {
            eliminarPedido(id);
        }

        // Agregar valores a su contenedor
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);

        // Agregar elementos al li
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(botonEliminar);

        // Agregar lista al grupo principal
        grupo.appendChild(lista);
    });

    // Agregar a los elementos padres
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    // Agregar al contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    // Mostrar Formulario de propinas
    formularioPropinas( );
}

function limpiarHTML( ) {
    const contenido = document.querySelector('#resumen .contenido')
    while( contenido.firstChild ){
        contenido.removeChild(contenido.firstChild)
    }
}

function calcularSubtotal(precio, cantidad) {
    return ` $${precio * cantidad} `;
}

function eliminarPedido(id) {

    const { pedido } = cliente; 

    const resultado = pedido.filter( articulo => articulo.id !== id );
    cliente.pedido = [...resultado];

    // Limpiar el codigo HTML previo
    limpiarHTML( );

    if(cliente.pedido.length) {
        // Mostrar el resumen
        mostrarResumen( );
    } else {
        mensajePedidoVacio( );
    }
    // El Producto se elimino por lo tanto regresamos la cantidad a 0 en el input (formateo)
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio( ) {
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'A??ade los elementos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas( ) {
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card', 'py-2', 'py-3', 'px-2', 'shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Elige una Propina';

    // Radio Button 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    // name para poder seleccionar una sola opcion
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = "10%";
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    // Agregando radio
    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    // Radio 15%
    const radio15 = document.createElement('input');
    radio15.type = 'radio';
    radio15.name = 'propina';
    radio15.value = "15";
    radio15.classList.add('form-check-input');
    radio15.onclick = calcularPropina;

    const radio15Label = document.createElement('label');
    radio15Label.textContent = "15%";
    radio15Label.classList.add('form-check-label');

    const radio15Div = document.createElement('div');
    radio15Div.classList.add('form-check');

    // Agregando radios 
    radio15Div.appendChild(radio15);
    radio15Div.appendChild(radio15Label);

    // Radio de 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = "25%";
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    // Agregando radios 
    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    // Agregar al div principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio15Div);
    divFormulario.appendChild(radio25Div);
    
    // Agregar al formulario
    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);
}

function calcularPropina( ) {
    const { pedido } = cliente;
    let subtotal = 0;

    // Calcular el subtotal a pagar
    pedido.forEach( articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });

    // Seleccionar el radio con la propina del cliente
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;
   
    // Calcular la propina
    const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100 );
 
    // Calcular el Total a pagar
    const total = subtotal + propina;

   mostrarTotalHTML( subtotal, total, propina );
} 

function mostrarTotalHTML( subtotal, total, propina ) {

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar', 'my-5');

    // Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    subtotalParrafo.textContent = 'Subtotal de Consumo: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    // Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    // Total a pagar
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'Total a pagar: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    totalParrafo.appendChild(totalSpan);

    // Eliminar el ultimo resultado
    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv) {
        totalPagarDiv.remove( );
    }

    divTotales.appendChild(subtotalParrafo)
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}