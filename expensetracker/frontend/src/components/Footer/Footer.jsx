import React from "react";
import "./style.css";
const Footer = () => {
  return (
    <footer className="main-footer">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} ExpensoMeter. All rights reserved.
      </p>
      <p className="text-xs">
        Made with <span className="text-red-500">❤ </span> by &nbsp;
        <a
          href="https://github.com/sapnamaurya/Minor-Project"
          className="text-blue-400 hover:underline ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          SSS Team
        </a>
      </p>
    </footer>
  );
};

export default Footer;
