// src/App.jsx
import { useLocation, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context Providers
import OrderState from "./context/orders/OrderState";
import CartState from "./context/cart/CartState";
import ProductState from "./context/Product/ProductState";
import UserState from "./context/Authentication/UserState";

// Pages and Components
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import CreateProduct from "./components/Product/CreateProduct";
import GetAllProduct from "./components/Product/GetAllProduct";
import GetOneProduct from "./components/Product/GetOneProduct";
import UpdateProduct from "./components/Product/UpdateProduct";
import MyProducts from "./components/Product/MyProducts";
import MyCart from "./components/Cart/MyCart";
import MyOrder from "./components/Cart/MyOrder";
import SearchProduct from "./components/Product/SearchProduct";
import AboutPage from "./pages/AboutPage";
import Footer from "./pages/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ChatRoom from "./components/chat/ChatRoom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function App() {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  return (
    <OrderState>
      <CartState>
        <ProductState>
          <UserState>
            <div className="min-h-screen flex flex-col">
              {!isChatPage && <Navbar />}

              <div className="flex-grow">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/" element={<GetAllProduct />} />
                  <Route
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
                    path="/create-product"
                    element={
                      <ProtectedRoutes>
                        <CreateProduct />
                      </ProtectedRoutes>
                    }
                  />
                  <Route
                    path="/update-product/:id"
                    element={
                      <ProtectedRoutes>
                        <UpdateProduct />
                      </ProtectedRoutes>
                    }
                  />
                  <Route
                    path="/my-products"
                    element={
                      <ProtectedRoutes>
                        <MyProducts />
                      </ProtectedRoutes>
                    }
                  />
                  <Route
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
                  <Route path="/search" element={<SearchProduct />} />
                  <Route path="/about-dev" element={<AboutPage />} />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoutes>
                        <ChatRoom />
                      </ProtectedRoutes>
                    }
                  />
                </Routes>
              </div>

              {!isChatPage && <Footer />}
              <ToastContainer position="bottom-left" autoClose={3000} />
            </div>
          </UserState>
        </ProductState>
      </CartState>
    </OrderState>
  );
}

export default App;
