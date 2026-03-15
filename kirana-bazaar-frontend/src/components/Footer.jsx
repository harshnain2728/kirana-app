import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-200 p-4 text-center">
      &copy; {new Date().getFullYear()} Kirana Bazaar. All rights reserved.
    </footer>
  );
}