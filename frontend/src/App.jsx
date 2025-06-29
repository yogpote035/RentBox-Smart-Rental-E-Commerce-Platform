import Login from "./components/Authentication/Login";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./components/Authentication/Signup";
import CreateProduct from "./components/Product/CreateProduct";
import UserState from "./context/Authentication/UserState";
import ProductState from "./context/Product/ProductState";
import GetAllProduct from "./components/Product/GetAllProduct";
import GetOneProduct from "./components/Product/GetOneProduct";
import UpdateProduct from "./components/Product/UpdateProduct";
import Navbar from "./components/Navbar";
import MyProducts from "./components/Product/MyProducts";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
    <ProductState>
      <UserState>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/" element={<GetAllProduct />} />
            <Route exact path="/product/:id" element={<GetOneProduct />} />
            {/* Protected Rote With token */}
            <Route
              exact
              path="/create-product"
              element={
                <ProtectedRoutes>
                  <CreateProduct />
                </ProtectedRoutes>
              }
            />
            <Route
              exact
              path="/update-product/:id"
              element={
                <ProtectedRoutes>
                  <UpdateProduct />
                </ProtectedRoutes>
              }
            />
            <Route
              exact
              path="/my-products"
              element={
                <ProtectedRoutes>
                  <MyProducts />
                </ProtectedRoutes>
              }
            />
          </Routes>
          <ToastContainer position="bottom-left" autoClose={3000} />
        </Router>
      </UserState>
    </ProductState>
  );
}

export default App;
