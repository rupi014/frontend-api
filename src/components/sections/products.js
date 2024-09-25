import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Products = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <div className="section">
      <h2>Products</h2>
      <ul>
        <li className="header">
          <span>Imagen</span>
          <span>Nombre</span>
          <span>Descripción</span>
          <span>Precio</span>
          <span>Categoría</span>
          <span>Stock</span>
        </li>
        {products.map((product) => (
          <li key={product.id}>
            <span>{product.image}</span>
            <span>{product.name}</span>
            <span>{product.description}</span>
            <span>{product.price}</span>
            <span>{product.category}</span>
            <span>{product.stock}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;