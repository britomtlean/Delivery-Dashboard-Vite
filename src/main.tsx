import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

//ROUTER
import { createBrowserRouter, RouterProvider } from 'react-router';
//CSS
import './index.css';
//CONTEXT
import { ContextProvider } from './context/ContextProvider';

//COMPONENTS
import Login from './components/All/Login.tsx';
import Home from './components/Delivery/Home.tsx';
import EditarProoduto from './components/Delivery/EditarProduto.tsx';

registerSW({
    immediate: true,
});

let router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/auth/',
        element: <Login />,
    },
    {
        path: '/produto/:id',
        element: <EditarProoduto />,
    },
]);

createRoot(document.getElementById('root')!).render(
    //<StrictMode>
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    //</StrictMode>
);
