import { loadStripe } from '@stripe/stripe-js';

export async function pagarConStripe(items) {
    try {
      const response = await fetch("http://localhost/carrito-backend/pago_stripe.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items })
      });
  
      const data = await response.json();
  
      if (data.id) {
        const stripe = await loadStripe("pk_test_51RM4t2FTCH3K5sJL0gXoepmU1btdRxdKA8asy30oe1LrTVWtO4WnDagt3yEr0YvgtPeeEtzwromcMsg9MGJdWCiy00TDKKfl6e");
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        console.error("No se recibió ID de sesión:", data);
      }
    } catch (error) {
      console.error("Error al iniciar el pago:", error);
    }
  }
  