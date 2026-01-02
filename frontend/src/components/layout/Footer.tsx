import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-indigo-600 shadow-inner text-gray-600 text-sm text-center py-4 md:py-6">
      <div className="container mx-auto">
        © <span className="font-bold text-indigo-600">{new Date().getFullYear()}</span> | My Note. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;