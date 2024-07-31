// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { SocketProvider } from './contexts/socketContext'; 
import App from './App';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { UsersProvider } from './contexts/usersContext';
import { FriendshipsProvider } from './contexts/friendshipsContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Auth />,
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider>
      <UsersProvider>
        <FriendshipsProvider>
          <RouterProvider router={router} />
        </FriendshipsProvider>
      </UsersProvider>
    </SocketProvider>
  </React.StrictMode>
)
