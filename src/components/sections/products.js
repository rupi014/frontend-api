import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './section_style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

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
    <div className="container">
        <div className="section">
        <h2>
          Productos 
          <button className="icon-button">
            <FontAwesomeIcon icon={faSquarePlus} />
          </button>
        </h2>
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
                    <button className='delete-button'>Eliminar</button>
                </span>
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
};

export default Products;