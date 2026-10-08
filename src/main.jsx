import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";

import "./index.css";
import { CartProvider } from "@/context/CartContext";
import { LojaProvider } from "@/context/LojaContext";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* reducedMotion="user": respeita o "reduzir movimento" do sistema
        automaticamente em todas as animações do Framer Motion do site. */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        {/* O carrinho vive "por cima" de todas as telas */}
        <CartProvider>
          <LojaProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/painel" element={<Admin />} />
            </Routes>
          </LojaProvider>

          {/* Sonner: avisos suaves ("Item adicionado ao carrinho") */}
          <Toaster
            position="top-center"
            richColors
            toastOptions={{ style: { borderRadius: "0.9rem" } }}
          />
        </CartProvider>
      </BrowserRouter>
    </MotionConfig>
  </React.StrictMode>
);
