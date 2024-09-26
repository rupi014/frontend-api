import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './section_style.scss';
import { deleteProduct } from '../functions/delete_functions';
import { addProduct } from '../functions/create_functions';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://vikingsdb.up.railway.app/products/');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products data', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(product => product.id !== id)); // Actualiza el estado para eliminar el producto
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const addedProduct = await addProduct(newProduct);
      setProducts([...products, addedProduct]); // Actualiza el estado para añadir el nuevo producto
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '', image: '' }); // Limpia el formulario
    } catch (error) {
      console.error('Error adding product', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  return (
    <div className="container">
        <div className="section">
        <h2>Productos</h2>
        <ul>
            <li className="header">
            <span>Imagen</span>
            <span>Nombre</span>
            <span>Descripción</span>
            <span>Precio</span>
            <span>Categoría</span>
            <span>Stock</span>
            <span>Acciones</span>
            </li>
            {products.map((product) => (
            <li key={product.id}>
                <span>{product.image}</span>
                <span>{product.name}</span>
                <span>{product.description}</span>
                <span>{product.price}</span>
                <span>{product.category}</span>
                <span>{product.stock}</span>
                <span>
                    <button className='edit-button'>Editar</button>
                    <button className='delete-button' onClick={() => handleDelete(product.id)}>Eliminar</button>
                </span>
            </li>
            ))}
        </ul>
        </div>
        <div className="section">
          <h2>Añadir Producto</h2>
          <form className="create-form">
            <label>Nombre:</label>
            <input type="text" name="name" value={newProduct.name} onChange={handleChange} />
            <label>Descripción:</label>
            <input type="text" name="description" value={newProduct.description} onChange={handleChange} />
            <label>Precio:</label>
            <input type="number" name="price" value={newProduct.price} onChange={handleChange} />
            <label>Categoría:</label>
            <input type="text" name="category" value={newProduct.category} onChange={handleChange} />
            <label>Stock:</label>
            <input type="number" name="stock" value={newProduct.stock} onChange={handleChange} />
            <label>Imagen:</label>
            <input type="text" name="image" value={newProduct.image} onChange={handleChange} />
            <button type="button" onClick={handleAddProduct}>Crear</button>
          </form>
        </div>
    </div>
  );
};

export default Products;