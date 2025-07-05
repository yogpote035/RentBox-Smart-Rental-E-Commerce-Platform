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
import MyCart from "./components/Cart/MyCart";
import CartState from "./context/cart/CartState";
import MyOrder from "./components/Cart/MyOrder";
import OrderState from "./context/orders/OrderState";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SearchProduct from "./components/Product/SearchProduct";
import AboutPage from "./pages/AboutPage";
import Footer from "./pages/Footer";
import ChatRoom from "./components/chat/ChatRoom";
function App() {
  return (
    <OrderState>
      <CartState>
        <ProductState>
          <UserState>
            <Router>
              <div className="min-h-screen flex flex-col">
                <Navbar />

                {/* Main Content */}
                <div className="flex-grow">
                  <Routes>
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/signup" element={<Signup />} />
                    <Route exact path="/" element={<GetAllProduct />} />
                    <Route
                      exact
                      path="/product/:id"
                      element={
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <ProtectedRoutes>
                            <GetOneProduct />
                          </ProtectedRoutes>
                        </LocalizationProvider>
                      }
                    />
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
                    <Route
                      exact
                      path="/my-favorite"
                      element={
                        <ProtectedRoutes>
                          <MyCart />
                        </ProtectedRoutes>
                      }
                    />
                    <Route
                      path="/my-rentals"
                      element={
                        <ProtectedRoutes>
                          <MyOrder />
                        </ProtectedRoutes>
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoutes>
                          <ChatRoom />
                        </ProtectedRoutes>
                      }
                    />
                    <Route path="/search" element={<SearchProduct />} />
                    <Route path="/about-dev" element={<AboutPage />} />
                  </Routes>
                </div>

                <Footer />
                <ToastContainer position="bottom-left" autoClose={3000} />
              </div>
            </Router>
          </UserState>
        </ProductState>
      </CartState>
    </OrderState>
  );
}

export default App;
