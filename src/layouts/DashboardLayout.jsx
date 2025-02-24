import { Outlet } from "react-router";
import Navbar from "../components/navbar/Navbar";
import { Toolbar } from "@mui/material";

const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Toolbar />
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;
