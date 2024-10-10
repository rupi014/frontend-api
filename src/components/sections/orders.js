import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { deleteOrder } from '../functions/delete_functions';
import { addOrder} from '../functions/create_functions';
import { updateOrder } from '../functions/edit_functions';
import './section_style.scss';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    user_id: '',
    order_date: '',
    total_price: 0,
    status: '',
    products: []
  });
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ product_id: '', quantity: '', order_size: '' });
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [tempProducts, setTempProducts] = useState([]);
  const [hoveredOrderId, setHoveredOrderId] = useState(null);
  const [existingProducts, setExistingProducts] = useState([]);

  // Obtener los pedidos
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');  
        const response = await axios.get('https://vikingsdb.up.railway.app/orders/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders data', error);
      }
    };

    // Obtener los productos existentes
    const fetchExistingProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://vikingsdb.up.railway.app/products/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setExistingProducts(response.data);
      } catch (error) {
        console.error('Error fetching existing products', error);
      }
    };

    fetchOrders();
    fetchExistingProducts();
  }, []);

  // Obtener los detalles de un producto
  const fetchProductDetails = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://vikingsdb.up.railway.app/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product details', error);
      return null;
    }
  };

  // Obtener los productos de un pedido
  const fetchProducts = async (orderId) => {
    if (selectedOrderId === orderId) {
      // Si el pedido ya está seleccionado, cerrar la lista de productos
      setSelectedOrderId(null);
      setProducts([]);
      setHoveredOrderId(null);
    } else {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://vikingsdb.up.railway.app/products_order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const productsWithDetails = await Promise.all(response.data.map(async (product) => {
          const productDetails = await fetchProductDetails(product.product_id);
          return {
            ...product,
            ...productDetails
          };
        }));
        setProducts(productsWithDetails);
        setSelectedOrderId(orderId); // Actualizar el pedido seleccionado
        setHoveredOrderId(orderId);
      } catch (error) {
        console.error('Error fetching products data', error);
      }
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este pedido?");
    if (!confirmDelete) return;

    deleteOrderAsync(id);
  };

  const deleteOrderAsync = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error deleting order', error);
    }
  };

  const handleAddOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const addedOrder = await addOrder(newOrder);
      setOrders([...orders, addedOrder]);

      // Añadir productos temporales al nuevo pedido mediante el endpoint
      let newTotal = 0;
      await Promise.all(tempProducts.map(async (product) => {
        const price = product.price;
        const total = price * product.quantity;
        newTotal += total;

        await axios.post('https://vikingsdb.up.railway.app/products_order/', {
          order_id: addedOrder.id,
          product_id: product.product_id,
          quantity: product.quantity,
          order_size: product.order_size,
          price: price,
          total: total
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }));

      // Actualizar el total del pedido
      const updatedOrder = await updateOrder(addedOrder.id, {
        ...newOrder,
        total_price: newTotal,
        products: tempProducts
      });

      setOrders(orders.map(o => (o.id === addedOrder.id ? updatedOrder : o)));
      setOrderToEdit(updatedOrder);
      setNewOrder({ ...newOrder, total_price: newTotal });

      setNewOrder({ user_id: '', order_date: '', total_price: 0, status: '', products: [] });
      setTempProducts([]);
    } catch (error) {
      console.error('Error adding order', error);
    }
  };

  const handleEditOrder = (order) => {
    if (orderToEdit && orderToEdit.id === order.id) {
      // Si ya estamos editando este pedido, salir del modo edición
      setOrderToEdit(null);
      setNewOrder({ user_id: '', order_date: '', total_price: 0, status: '', products: [] });
    } else {
      // Entrar en modo edición para el pedido seleccionado
      setOrderToEdit(order);
      setNewOrder({
        ...order,
        order_date: order.order_date.split('T')[0],
        products: order.products || [],
        total_price: order.total_price || 0
      });

      // Obtener productos del pedido
      try {
        const token = localStorage.getItem('token');
        const response = axios.get(`https://vikingsdb.up.railway.app/products_order/${order.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const productsWithDetails = Promise.all(response.data.map(async (product) => {
          const productDetails = await fetchProductDetails(product.product_id);
          return {
            ...product,
            ...productDetails
          };
        }));
        setProducts(productsWithDetails);
        setSelectedOrderId(order.id);
      } catch (error) {
        console.error('Error fetching products data', error);
      }
    }
  };

  const handleUpdateOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      let newTotal = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);

      // Añadir productos temporales al pedido mediante el endpoint y calcular su total
      const addedProducts = await Promise.all(tempProducts.map(async (product) => {
        const price = product.price;
        const total = price * product.quantity;
        newTotal += total;

        await axios.post(`https://vikingsdb.up.railway.app/products_order/`, {
          order_id: orderToEdit.id,
          product_id: product.product_id,
          quantity: product.quantity,
          order_size: product.order_size,
          price: price,
          total: total
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        return {
          ...product,
          total: total
        };
      }));
  

      // Actualizar el pedido
      const updatedOrder = await updateOrder(orderToEdit.id, {
        ...newOrder,
        total_price: newTotal,
        products: [...products, ...addedProducts]
      });

      // Actualizar el estado local
      setOrders(orders.map(order => (order.id === orderToEdit.id ? updatedOrder : order)));
      setOrderToEdit(null);
      setNewOrder({ user_id: '', order_date: '', total_price: newTotal, status: '', products: [] });
      setTempProducts([]);

      // Actualizar la lista de productos del pedido
      setProducts([...products, ...addedProducts]);
      setSelectedOrderId(updatedOrder.id);
    } catch (error) {
      console.error('Error updating order', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };


  const handleAddProduct = async () => {
    try {
      const productDetails = await fetchProductDetails(newProduct.product_id);
      if (productDetails) {
        // Establecer "Talla Única" si order_size está vacío
        const productWithDetails = {
          ...newProduct,
          ...productDetails,
          order_size: newProduct.order_size.trim() === '' ? 'Talla Única' : newProduct.order_size
        };
        const updatedTempProducts = [...tempProducts, productWithDetails];
        setTempProducts(updatedTempProducts);
        setNewProduct({ product_id: '', quantity: '', order_size: '' });

        // Calcula el nuevo total del pedido incluyendo productos existentes y temporales
        const newTotal = [...products, ...updatedTempProducts].reduce((acc, product) => acc + (product.price * product.quantity), 0);
        setNewOrder({ ...newOrder, total_price: newTotal });

      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error adding product', error);
    }
  };

  const handleRemoveTempProduct = (index) => {
    const updatedTempProducts = tempProducts.filter((_, i) => i !== index);
    setTempProducts(updatedTempProducts);
  
  
    const newTotal = [...products, ...updatedTempProducts].reduce((acc, product) => acc + (product.price * product.quantity), 0);
    setNewOrder({ ...newOrder, total_price: newTotal });
  };

  const handleDeleteProduct = (order, productId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto del pedido?");
    if (!confirmDelete) return;

    deleteProductAsync(order, productId);
  };

  const deleteProductAsync = async (order, productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://vikingsdb.up.railway.app/products_order/${order.id}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Filtrar los productos actualizados
      const updatedProducts = products.filter(product => product.product_id !== productId);
      setProducts(updatedProducts);

      // Calcular el nuevo total del pedido
      const newTotal = updatedProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0);

      // Actualizar el pedido en el servidor
      const updatedOrder = await updateOrder(order.id, {
        user_id: order.user_id,
        order_date: order.order_date,
        total_price: newTotal,
        status: order.status,
        products: updatedProducts.map(product => ({
          product_id: product.product_id,
          quantity: product.quantity,
          order_size: product.order_size,
          price: product.price,
          total: product.price * product.quantity
        }))
      });

      // Actualizar el estado local
      setOrders(orders.map(o => (o.id === order.id ? updatedOrder : o)));
      setOrderToEdit(updatedOrder);
      setNewOrder({ ...newOrder, total_price: newTotal });

    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  return (
    <div className="container">
      <div className="section">
        <h2>Pedidos</h2>
        <ul>
          <li className="header">
            <span>ID</span>
            <span>Usuario</span>
            <span>Fecha</span>
            <span>Total</span>
            <span>Estado</span>
            <span>Acciones</span>
          </li>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <li>
                <span>{order.id}</span>
                <span>{order.user_id}</span>
                <span>{order.order_date.split('T')[0]}</span>
                <span>{order.total_price} €</span>
                <span>{order.status}</span>
                <span>
                  <button
                    className={`view-products-button ${hoveredOrderId === order.id ? 'hover' : ''}`}
                    onClick={() => fetchProducts(order.id)}
                  >
                    Ver Productos
                  </button>
                  <button
                    className={`edit-button ${orderToEdit && orderToEdit.id === order.id ? 'hover' : ''}`}
                    onClick={() => handleEditOrder(order)}
                  >
                    {orderToEdit && orderToEdit.id === order.id ? 'Cancelar' : 'Editar'}
                  </button>
                  <button className='delete-button' onClick={() => handleDelete(order.id)}>Eliminar</button>
                </span>
              </li>
              {selectedOrderId === order.id && (
                <li className="products-table">
                  <h3>Productos del Pedido</h3>
                  <ul>
                    {products.map((product, index) => (
                      <li key={`${product.product_id}-${index}`}>
                        <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                        <span>ID: {product.product_id}</span>
                        <span>Nombre: {product.name}</span>
                        <span>Cantidad: {product.quantity}</span>
                        <span>Talla: {product.order_size}</span>
                        <span>Precio: {product.price} €</span>
                        <button className='delete-button-products' onClick={() => handleDeleteProduct(order, product.product_id)}>Eliminar</button>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>{orderToEdit ? 'Editar Pedido' : 'Añadir Pedido'}</h2>
        <form className="create-form">
          <label>Usuario ID:</label>
          <input type="text" name="user_id" value={newOrder.user_id} onChange={handleChange} />
          <label>Fecha:</label>
          <input type="date" name="order_date" value={newOrder.order_date} onChange={handleChange} />
          <label>Estado:</label>
          <input type="text" name="status" value={newOrder.status} onChange={handleChange} />
          <div className='add-products-container'>
            <div className='add-products-form'>
              <h3>Añadir Productos</h3>
              <ul>
                {tempProducts.map((product, index) => (
                  <li key={`temp-${product.product_id}-${index}`}>
                    <span>ID: {product.product_id}</span>
                    <span>Nombre: {product.name}</span>
                    <span>Cantidad: {product.quantity}</span>
                    <span>Talla: {product.order_size}</span>
                    <span>Precio: {product.price}€</span>
                    <button className='delete-button-small' onClick={() => handleRemoveTempProduct(index)}>Eliminar</button>
                  </li>
                ))}
              </ul>
              <label>Producto ID:</label>
              <input type="text" name="product_id" value={newProduct.product_id} onChange={handleProductChange} />
              <label>Cantidad:</label>
              <input type="number" name="quantity" value={newProduct.quantity} onChange={handleProductChange} />
              <label>Tamaño:</label>
              <input type="text" name="order_size" value={newProduct.order_size} onChange={handleProductChange} />
              <button type="button" onClick={handleAddProduct}>Añadir Producto</button>
            </div>

            <div className='existing-products-container'>
            <h3>Productos Existentes</h3>
            <ul>
              {existingProducts.map((product) => (
                <li key={product.id}>
                  <span>ID: {product.id}</span>
                  <span>Nombre: {product.name}</span>
                  <span>{product.product_size}</span>
                </li>
              ))}
            </ul>
          </div>
          </div>
          
          <button type="button" onClick={orderToEdit ? handleUpdateOrder : handleAddOrder}>
            {orderToEdit ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Orders;