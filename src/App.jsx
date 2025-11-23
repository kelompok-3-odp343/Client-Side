import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { LoadingProvider } from "./context/LoadingProvider"; 

export default function App() {
  return (
    <LoadingProvider>
      <AppRoutes />
    </LoadingProvider>
  );
}