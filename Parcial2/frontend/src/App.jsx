import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [listaCompras, setListaCompras] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);

  useEffect(() => {
    // obtener productos de la API
    fetch('http://localhost:3001/api/productos')
      .then((res) => res.json())
      .then((json) => {
        setProductos(json);
        setCargandoProductos(false);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        setCargandoProductos(false);
      });

    // obtener la lista de compras
    fetch('http://localhost:3001/api/items')
      .then((res) => res.json())
      .then((json) => setListaCompras(json));
  }, []);

  // agregando producto a la lista de compras
  const agregarALista = (producto) => {
    fetch('http://localhost:3001/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    })
      .then((res) => res.json())
      .then((nuevoItem) => {
        setProductos(productos.filter((prod) => prod.id !== producto.id));
        setListaCompras([...listaCompras, nuevoItem]);
      });
  };

  const marcarComoComprado = (id) => {
    fetch(`http://localhost:3001/api/items/${id}`, {
      method: 'PUT',
    })
      .then((res) => res.json())
      .then((itemActualizado) => {
        setListaCompras(
          listaCompras.map((item) =>
            item.id === id ? itemActualizado : item
          )
        );
      });
  };

  // eliiminar un producto de la lista
  const eliminarDeLista = (id) => {
    fetch(`http://localhost:3001/api/items/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setListaCompras(listaCompras.filter((item) => item.id !== id));
    });
  };

  // eliminar toda la lista de compras
  const eliminarTodaLista = () => {
    fetch('http://localhost:3001/api/items', {
      method: 'DELETE',
    }).then(() => {
      setListaCompras([]);
    });
  };

  if (cargandoProductos) {
    return <div className="cargando">Cargando productos...</div>;
  }

  return (
    <div>
      <header>
        <h1>MegaBuy</h1>
      </header>

      <div className="contenedor">
        <div className="productos">
          <h2>Productos</h2>
          <ul>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <li key={producto.id}>
                  <img src={producto.image} alt={producto.title} width="100" />
                  <h3>{producto.title}</h3>
                  <p>Precio: ${producto.price}</p>
                  <button onClick={() => agregarALista(producto)}>
                    Agregar a la lista
                  </button>
                </li>
              ))
            ) : (
              <p>No hay más productos disponibles.</p>
            )}
          </ul>
        </div>

        <div className="lista-compras">
          <h2>Lista de Compras</h2>
          <ul>
            {listaCompras.length > 0 ? (
              listaCompras.map((item) => (
                <li key={item.id}>
                  <h3>{item.title}</h3>
                  <p>Precio: ${item.price}</p>
                  <img src={item.image} alt={item.title} width="100" />
                  <p>{item.purchased ? 'Comprado' : 'Pendiente'}</p>
                  {!item.purchased && (
                    <button onClick={() => marcarComoComprado(item.id)}>
                      Marcar como comprado
                    </button>
                  )}
                  <button onClick={() => eliminarDeLista(item.id)}>
                    Eliminar
                  </button>
                </li>
              ))
            ) : (
              <p>Tu lista de compras está vacía.</p>
            )}
          </ul>
          {listaCompras.length > 0 && (
            <button onClick={eliminarTodaLista}>Comprar todo</button>
          )}
        </div>
      </div>

      <footer>
        <p>© 2024 MegaBuy. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
