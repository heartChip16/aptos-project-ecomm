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
import React from 'react';


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
    </>
  )
);

function App() {
  const [count, setCount] = useState(0);



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
