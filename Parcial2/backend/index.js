import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const API_FAKE_STORE = 'https://fakestoreapi.com/products';
let productos = [];
let listaCompras = []; // Lista de compras

// GET: obtener productos desde Fake Store API
app.get('/api/productos', async (req, res) => {
  try {
    if (productos.length === 0) {
      const response = await axios.get(API_FAKE_STORE);
      productos = response.data;
    }
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos desde Fake Store API:', error);
    res.status(500).send('Error al obtener productos');
  }
});

// GET: obtener la lista de compras
app.get('/api/items', (req, res) => {
  res.json(listaCompras);
});

// POST: agregar producto a la lista de compras
// POST: agregar producto a la lista de compras
app.post('/api/items', (req, res) => {
  const { id, title, price, image } = req.body;

  if (!id || !title || !price || !image) {
    return res.status(400).send('Todos los campos son obligatorios (id, title, price, image)');
  }

  const item = { id, title, price, image, purchased: false };
  listaCompras.push(item);
  res.status(201).json(item);
});


// PUT: marcar producto como comprado en la lista de compras
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = listaCompras.find(i => i.id === id);
  if (item) {
    item.purchased = true;
    res.json(item);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// DELETE: eliminar un producto de la lista de compras
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  listaCompras = listaCompras.filter(i => i.id !== id);
  res.status(204).send();
});

// DELETE: eliminar toda la lista de compras
app.delete('/api/items', (req, res) => {
  listaCompras = [];
  res.status(204).send();
});

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
