import { Outlet } from "react-router-dom";
import { Navbar } from "./landing/navbar/Navbar";
import { Footer } from "./landing/footer/Footer";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};