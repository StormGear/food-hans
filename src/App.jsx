// @ts-nocheck
"use client";

import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "./contextproviders/Authcontext"
import { CartProvider } from "./contextproviders/Cartcontext"
import { router } from "./index"
import { ErrorBoundary } from "react-error-boundary";
import Fallback from "./components/ErrorBoundary";
import { MenuProvider } from "./contextproviders/Menucontext";


export default function App() {
  return (
    <ErrorBoundary
    FallbackComponent={Fallback}
    onReset={(details) => {
      // Reset the state of your app so the error doesn't happen again
    }} 
    >
    <AuthProvider>
      <MenuProvider >
      <CartProvider>
        <RouterProvider router={router}/>
      </CartProvider>
      </MenuProvider>
    </AuthProvider>
  </ErrorBoundary>
  )
}