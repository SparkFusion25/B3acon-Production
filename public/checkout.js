// This is your test secret API key.
const stripe = Stripe("pk_test_51Rj8q34FURD71tBcTVDxWZBc9IXI8Nj3fD62GfTTsUmfaNxtN7BmxqQ4bFHbgCX5jJCkVDLvRgOX5gwbrDTg8TF700SMllF0B5");

initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}