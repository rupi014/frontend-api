import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm.js';
import Home from './components/Home';
import Status from './components/Status';
import Staff from './components/sections/staff';
import Players from './components/sections/players';
import Products from './components/sections/products';
import Orders from './components/sections/orders';
import Blogs from './components/sections/blogs';
import Users from './components/sections/users';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/status" element={<Status />} />
        <Route path="/sections/staff" element={<Staff />} />
        <Route path="/sections/players" element={<Players />} />
        <Route path="/sections/products" element={<Products />} />
        <Route path="/sections/orders" element={<Orders />} />
        <Route path="/sections/blogs" element={<Blogs />} />
        <Route path="/sections/users" element={<Users />} />
      </Routes>
    </Router>
  );
};

export default App;