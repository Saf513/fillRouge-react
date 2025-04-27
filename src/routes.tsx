import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/home";
// Autres imports existants...

// Import des pages de paiement
import PaymentSuccess from "./pages/payment/success";
import PaymentCancel from "./pages/payment/cancel";

// Autres imports...

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      // Routes existantes...
      
      // Routes de paiement
      {
        path: "payment/success",
        element: <PaymentSuccess />
      },
      {
        path: "payment/cancel",
        element: <PaymentCancel />
      }
      // Autres routes existantes...
    ]
  }
]); 