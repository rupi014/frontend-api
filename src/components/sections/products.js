import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './section_style.scss';
import { deleteProduct } from '../functions/delete_functions';
import { addProduct } from '../functions/create_functions';
import { updateProduct } from '../functions/edit_functions';


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
  const [productToEdit, setProductToEdit] = useState(null);

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
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const addedProduct = await addProduct(newProduct);
      setProducts([...products, addedProduct]);
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '', image: '' });
    } catch (error) {
      console.error('Error adding product', error);
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setNewProduct(product);
  };

  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = await updateProduct(productToEdit.id, newProduct);
      setProducts(products.map(product => (product.id === productToEdit.id ? updatedProduct : product)));
      setProductToEdit(null);
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '', image: '' });
      // Refrescar la lista de productos después de actualizar
      const response = await axios.get('https://vikingsdb.up.railway.app/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error updating product', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const truncateDescription = (description) => {
    const words = description.split(' ');
    return words.length > 4 ? words.slice(0, 5).join(' ') + '...' : description;
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
                <span>{truncateDescription(product.description)}</span>
                <span>{product.price}</span>
                <span>{product.category}</span>
                <span>{product.stock}</span>
                <span>
                    <button className='edit-button' onClick={() => handleEditProduct(product)}>Editar</button>
                    <button className='delete-button' onClick={() => handleDelete(product.id)}>Eliminar</button>
                </span>
            </li>
            ))}
        </ul>
        </div>
        <div className="section">
          <h2>{productToEdit ? 'Editar Producto' : 'Añadir Producto'}</h2>
          <form className="create-form">
            <label>Nombre:</label>
            <input type="text" name="name" value={newProduct.name} onChange={handleChange} />
            <label>Descripción:</label>
            <textarea className='textarea' name="description" value={newProduct.description} onChange={handleChange} rows="4" />
            <label>Precio:</label>
            <input type="number" name="price" value={newProduct.price} onChange={handleChange} />
            <label>Categoría:</label>
            <input type="text" name="category" value={newProduct.category} onChange={handleChange} />
            <label>Stock:</label>
            <input type="number" name="stock" value={newProduct.stock} onChange={handleChange} />
            <label>Imagen:</label>
            <input type="text" name="image" value={newProduct.image} onChange={handleChange} />
            <button type="button" onClick={productToEdit ? handleUpdateProduct : handleAddProduct}>
              {productToEdit ? 'Actualizar' : 'Crear'}
            </button>
          </form>
        </div>
    </div>
  );
};

export default Products;