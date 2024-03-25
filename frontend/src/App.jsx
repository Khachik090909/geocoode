import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LoginPage from "./components/user/LoginPage/LoginPage";
import Map from "./components/map/map";
import Logout from "./pages/Logout";
import AdminLayout from "./pages/admin/AdminLayout";
import Profile, { fetchCarUser } from "./components/profile/Profile";
const App = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* routs for user  */}
      <Route
        element={
          <>
            <Navbar /> <Outlet />
          </>
        }
        path="/"
        id="rootlayout"
      >
        <Route element={<Map />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<Logout />} path="/logout" />
        <Route element={<Profile />} path="/profile" loader={fetchCarUser} />
      </Route>
      {/* routes for admin */}
      <Route element={<AdminLayout />} path="/admin"></Route>
    </Route>
  )
);

export default App;
