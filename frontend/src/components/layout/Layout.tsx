import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 ">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
