document.addEventListener("DOMContentLoaded", function () {
  // Simulamos la llamada para obtener el JSON
  const menuJson = {
    menu: [
      {
        id: 1,
        descripcion: "Pizza Margherita - Clásica con mozzarella y albahaca",
        imagen: "../resources/pizza-margarita.jpg",
        precio: 8.99,
      },
      {
        id: 2,
        descripcion: "Pizza Pepperoni - Con mucho pepperoni y queso",
        imagen: "../resources/pizza-pepperoni.jpg",
        precio: 10.99,
      },
      {
        id: 3,
        descripcion: "Pizza Hawaiana - Jamón, piña y mozzarella",
        imagen: "../resources/pizza-hawaiana.jpg",
        precio: 9.99,
      },
    ],
  };

  const menuContainer = document.getElementById("menuContainer");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  let cart = []; // Array para almacenar los productos del carrito
  let totalAmount = 0; // Variable para el total del carrito

  // Función para generar el HTML de cada producto del menú
  function displayMenu(menu) {
    menu.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.classList.add("menu-item");

      menuItem.innerHTML = `
                <img src="${item.imagen}" alt="${item.descripcion}" data-id="${
        item.id
      }" data-price="${item.precio}">
                <h3>Producto #${item.id}</h3>
                <p>${item.descripcion}</p>
                <p class="price">$${item.precio.toFixed(2)}</p>
            `;

      // Añadir el evento click para agregar al carrito
      menuItem.querySelector("img").addEventListener("click", function () {
        addToCart(item);
      });

      menuContainer.appendChild(menuItem);
    });
  }

  // Función para agregar un producto al carrito
  function addToCart(product) {
    // Verificamos si el producto ya está en el carrito
    const cartItem = cart.find((item) => item.id === product.id);
    if (cartItem) {
      cartItem.quantity++; // Si existe, incrementamos la cantidad
    } else {
      // Si no está en el carrito, lo agregamos con una cantidad inicial de 1
      cart.push({ ...product, quantity: 1 });
    }
    totalAmount += product.precio; // Sumamos el precio del producto al total
    updateCartUI(); // Actualizamos la interfaz del carrito
  }

  // Función para actualizar el contenido del carrito en la UI
  function updateCartUI() {
    cartItems.innerHTML = ""; // Limpiamos la lista del carrito

    // Mostramos cada producto del carrito
    cart.forEach((item) => {
      const cartItemElement = document.createElement("li");
      cartItemElement.innerHTML = `
                ${item.descripcion} (x${item.quantity}) - $${(
        item.precio * item.quantity
      ).toFixed(2)}
            `;
      cartItems.appendChild(cartItemElement);
    });

    // Actualizamos el total en la UI
    cartTotal.textContent = `Total: $${totalAmount.toFixed(2)}`;
  }

  // Mostrar el menú en la página
  displayMenu(menuJson.menu);
});
