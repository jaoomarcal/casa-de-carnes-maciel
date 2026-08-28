import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import "./index.css";
import { CartProvider } from "@/context/CartContext";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* O carrinho vive "por cima" de todas as telas */}
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/painel" element={<Admin />} />
        </Routes>

        {/* Sonner: avisos suaves ("Item adicionado ao carrinho") */}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{ style: { borderRadius: "0.9rem" } }}
        />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
