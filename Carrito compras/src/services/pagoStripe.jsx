import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RM4t2FTCH3K5sJL0gXoepmU1btdRxdKA8asy30oe1LrTVWtO4WnDagt3yEr0YvgtPeeEtzwromcMsg9MGJdWCiy00TDKKfl6e');

export const pagarConStripe = async ({ items, total }) => {
  if (!stripePromise) {
    console.error("Stripe no se ha cargado correctamente.");
    return;
  }

  const stripe = await stripePromise;

  try {
    const response = await fetch("http://localhost/carrito-backend/Models/pago_stripe.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map(item => ({
          articulo_id: item.articulo_id || item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
        })),
        total: Math.round(total * 100), // total en centavos
      }),
    });

    const session = await response.json();

    if (session?.id) {
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      if (result.error) {
        console.error(result.error.message);
        alert(`¡Error al iniciar el pago: ${result.error.message}!`);
      }
    } else {
      console.error("Error al crear la sesión de pago:", session.error);
      alert("¡Hubo un error al procesar el pago!");
    }
  } catch (error) {
    console.error("Error al comunicarse con el servidor:", error);
    alert("¡Hubo un error al comunicarse con el servidor!");
  }
};

