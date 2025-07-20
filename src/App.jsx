import React, { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import Works from "./Works";
import Inventory from "./Admin/Inventory";
import Checkout from "./Checkout";
import Profile from "./User/Profile";
import Privacy from "./Privacy";
import Terms from "./Terms";
import Subscription from "./Subscription";
import RetailProfile from "./Retail/RetailProfile";
import Error404 from "./Error404";
import Feedback from "./Feedback";
import AdminFeedback from "./Admin/AdminFeedback";
import Restaurant from "./Restaurant";
import ReviewForm from "./Review";
import AdminSettings from "./Admin/AdminSettings";
import DineIn from "./DineIn";
import RetailTable from "./Retail/RetailTable";

function App() {
  useEffect(() => {
    const isDark = localStorage.getItem("appearanceisDark") === "true";
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/howitworks" element={<Works />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<Order />} />
          <Route path="/dinein" element={<DineIn />} />
          <Route path="/order/:slug" element={<UserOrder />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/addretail' element={<AddRetail />} />
          <Route path='/admin/retail/:id' element={<RetailAdmin />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path='/retail/login' element={<RetailLogin />} />
          <Route path='/retail/register' element={<RetailRegister />} />
          <Route path='/retail' element={<Retail />} />
          <Route path='/retail/table' element={<RetailTable />} />
          <Route path='/retail/profile' element={<RetailProfile />} />
          <Route path='/retail/edit' element={<RetailEdit />} />
          <Route path='/review/:publicCode' element={<ReviewForm />} />
          <Route path="/checkout/:publicCode" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/plans" element={<Subscription />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
