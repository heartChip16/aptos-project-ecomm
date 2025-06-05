import { Button } from '@mui/material';
import { useState, ReactNode } from 'react';
import { RouterProvider, Route, createRoutesFromElements, createBrowserRouter, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Login from './pages/Login';
import { Provider } from 'react-redux';
import { store } from './store';
import Checkout from './pages/Checkout';
import AuthProvider, { useAuth } from './firebase/Auth';
import Register from './pages/Register';
import Providers from "./components/providers";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return <>{children}</>;
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Providers>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={

              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>

            }
          />
        </Route>
      </Providers>

    </>
  )
);

function App() {
  const [count, setCount] = useState(0);

  // for Aptos Wallet Petra: 
  const { account, signAndSubmitTransaction } = useWallet();
  const [loading, setLoading] = useState(false);


  return (
    <div className="App">
      <AuthProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </AuthProvider>
    </div>
  );
}

export default App;
