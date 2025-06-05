import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
function ProtectedRoute({ children }) {
    const { user } = useAuth();
    if (!user) {
        return _jsx(Navigate, { to: "/login" });
    }
    else {
        return _jsx(_Fragment, { children: children });
    }
}
const router = createBrowserRouter(createRoutesFromElements(_jsxs(_Fragment, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsxs(Route, { path: "/", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(Home, {}) }), _jsx(Route, { path: "/cart", element: _jsx(Cart, {}) }), _jsx(Route, { path: "/checkout", element: _jsx(ProtectedRoute, { children: _jsx(Checkout, {}) }) })] })] })));
function App() {
    const [count, setCount] = useState(0);
    return (_jsx("div", { className: "App", children: _jsx(AuthProvider, { children: _jsx(Provider, { store: store, children: _jsx(RouterProvider, { router: router }) }) }) }));
}
export default App;
