import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from "./Homepage"
import Login from "./Login";
import Register from "./Register";
import Admin from "./Admin/Admin";
import Retail from "./Retail/Retail";
import RetailLogin from "./Retail/RetailLogin";
import RetailRegister from "./Retail/RetailRegister";
import RetailEdit from "./Retail/RetailEdit";
import AdminLogin from "./Admin/AdminLogin";
import AddRetail from "./Admin/Addretail";
import RetailAdmin from "./Admin/AdminRetail";
import Order from "./Order";
import UserOrder from "./UserOrder";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order/:slug" element={<UserOrder />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/addretail' element={<AddRetail />} />
          <Route path='/admin/retail/:id' element={<RetailAdmin />} />
          <Route path='/retail/login' element={<RetailLogin />} />
          <Route path='/retail/register' element={<RetailRegister />} />
          <Route path='/retail/dashboard' element={<Retail />} />
          <Route path='/retail/edit' element={<RetailEdit />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
