import React from 'react';
import Login from './pages/login/login';
import Register from './pages/register/Register';
import ForgotPassword from './pages/forgotpassword/ForgotPassword';
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import VerifyEmail from './pages/verifyEmail/verifyEmail';
import PasswordReset from './pages/passwordreset/PasswordReset';
const App = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login/>,
    },
    {
      path: "/register",
      element: <Register/>,
    },
    {
      path: "/forget",
      element: <ForgotPassword/>,
    },
    {
      path: "/:id/verify/:token",
      element: <VerifyEmail/>,
    },
    {
      path: "/:id/:token",
      element: <PasswordReset/>,
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
