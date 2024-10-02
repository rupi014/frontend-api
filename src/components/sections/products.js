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
    image: '',
    product_size: '' // Cambiar el nombre del campo a product_size
  });
  const [productToEdit, setProductToEdit] = useState(null);
  const [imageFile, setImageFile] = useState(null);

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
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'ml_default'); // Asegúrate de que 'ml_default' sea correcto
        const response = await axios.post('https://api.cloudinary.com/v1_1/doo3lslbw/image/upload', formData);
        imageUrl = response.data.secure_url;
      }
      const addedProduct = await addProduct({ ...newProduct, image: imageUrl });
      setProducts([...products, addedProduct]);
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '', image: '', product_size: '' });
      setImageFile(null);
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
      let imageUrl = newProduct.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'ml_default'); // Asegúrate de que 'ml_default' sea correcto
        const response = await axios.post('https://api.cloudinary.com/v1_1/doo3lslbw/image/upload', formData);
        imageUrl = response.data.secure_url;
      }
      const updatedProduct = await updateProduct(productToEdit.id, { ...newProduct, image: imageUrl });
      setProducts(products.map(product => (product.id === productToEdit.id ? updatedProduct : product)));
      setProductToEdit(null);
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '', image: '', product_size: '' });
      setImageFile(null);
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

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
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
            <span>ID</span>
            <span>Nombre</span>
            <span>Descripción</span>
            <span>Precio</span>
            <span>Categoría</span>
            <span>Stock</span>
            <span>Talla</span>
            <span>Acciones</span>
          </li>
          {products.map((product) => (
            <li key={product.id}>
              <span>
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                ) : (
                  'No Image'
                )}
              </span>
              <span>{product.id}</span>
              <span>{product.name}</span>
              <span>{truncateDescription(product.description)}</span>
              <span>{product.price}</span>
              <span>{product.category}</span>
              <span>{product.stock}</span>
              <span>{product.product_size}</span> {/* Cambiar el nombre del campo a product_size */}
              <span>
                <button className={`edit-button ${productToEdit && productToEdit.id === product.id ? 'hover' : ''}`}
                onClick={() => handleEditProduct(product)}>Editar</button>
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
          <label>Talla:</label>
          <input type="text" name="product_size" value={newProduct.product_size} onChange={handleChange} /> {/* Cambiar el nombre del campo a product_size */}
          <label>Imagen:</label>
          <input type="file" name="image" onChange={handleImageChange} />
          <button type="button" onClick={productToEdit ? handleUpdateProduct : handleAddProduct}>
            {productToEdit ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Products;