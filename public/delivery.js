document.getElementById("delivery-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;

  const payload = {
    contact: {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
    },
    address: {
      country: form.country.value,
      city: form.city.value,
      street: form.street.value,
      house: form.house.value,
      apartment: form.apartment.value,
    },
    paymentMethod: form.payment.value,
  };

  const res = await fetch("/api/delivery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (data.success) {
    window.location.href = "/delivery/success";
  } else {
    alert("Ошибка: " + data.error);
  }
});
