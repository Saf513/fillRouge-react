import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "@/api/axios";

export default function PaymentSuccess() {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Extraire l'ID de session Stripe de l'URL
        const params = new URLSearchParams(location.search);
        const sessionId = params.get("session_id");
        
        if (sessionId) {
          // Récupérer les détails de la commande à partir de l'API
          const response = await axios.get(`/api/payment/verify?session_id=${sessionId}`);
          setOrderDetails(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la commande:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [location]);
  
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-green-50 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Paiement réussi !</CardTitle>
          <p className="text-green-700 mt-2">
            Votre commande a été traitée avec succès
          </p>
        </CardHeader>
        
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Merci pour votre achat !</h3>
                <p className="text-gray-600">
                  Vous recevrez un email de confirmation contenant tous les détails de votre commande.
                </p>
              </div>
              
              {orderDetails && (
                <div className="border-t border-b py-4">
                  <p className="text-gray-800 mb-1">
                    <span className="font-medium">N° de commande:</span> {orderDetails.order_number}
                  </p>
                  <p className="text-gray-800 mb-1">
                    <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Total:</span> {orderDetails.amount} €
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button 
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Retour à l'accueil
                </Button>
                <Button 
                  onClick={() => navigate("/courses")}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
                >
                  Accéder à mes cours
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 