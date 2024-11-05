document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://s7bwiiqmlv5lwjnjj6u4ykkddi0xsopo.lambda-url.eu-west-3.on.aws/",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      loadMenuItems(data);
      console.log(data);
    })
    .catch((error) => {
      // Manejar errores
      document.getElementById("response").innerText =
        "Hubo un error al cargar el menú";
      console.error("Error:", error);
    });
});

const userId = localStorage.getItem("id_usuario");

viewOrdersButton.addEventListener("click", function () {
  fetchOrders(userId);
  ordersModal.style.display = "block";
});

// Función para cerrar el modal
closeModal.addEventListener("click", function () {
  ordersModal.style.display = "none";
});

// Cerrar el modal si se hace clic fuera de él
window.addEventListener("click", function (event) {
  if (event.target === ordersModal) {
    ordersModal.style.display = "none";
  }
});

// Función para llamar a la función Lambda y obtener pedidos
// Llamar a la función Lambda y obtener pedidos
function fetchOrders(id_usuario) {
  fetch(
    "https://6m6jzxnkupspyxnu3jln7cadwi0kjvqh.lambda-url.eu-west-3.on.aws/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation: "fetch",
        id_usuario: id_usuario,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      ordersList.innerHTML = ""; // Limpiar lista de pedidos anteriores

      // Llenar la lista con los IDs de pedidos recibidos
      data.orders.forEach((order) => {
        const orderItem = document.createElement("li");
        orderItem.textContent = `Pedido ID: ${order.id_pedido}`;
        ordersList.appendChild(orderItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      ordersList.innerHTML = "<li>Error al cargar los pedidos</li>";
    });
}

// Modificar la función finalizePurchase para incluir "operation": "create"
function finalizePurchase() {
  const id_usuario = localStorage.getItem("id_usuario");

  if (!id_usuario) {
    alert("Por favor, inicia sesión para finalizar la compra.");
    return;
  }

  const purchaseData = {
    operation: "create",
    id_usuario: id_usuario,
    cartItems: cartItems,
  };
  console.log(purchaseData);

  fetch(
    "https://6m6jzxnkupspyxnu3jln7cadwi0kjvqh.lambda-url.eu-west-3.on.aws/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Compra finalizada:", data);
      alert("Compra realizada con éxito.");
      cartItems.length = 0;
      updateCart();
    })
    .catch((error) => {
      console.error("Error al finalizar la compra:", error);
      alert("Hubo un error al finalizar la compra.");
    });
}

const menuContainer = document.getElementById("menuContainer");

// Función para cargar los elementos del menú
function loadMenuItems(menuData) {
  menuData.menu.forEach((item) => {
    // Crear un contenedor para cada producto
    const productDiv = document.createElement("div");
    productDiv.classList.add("menu-item");

    // Añadir nombre del producto
    const nameElement = document.createElement("h3");
    nameElement.textContent = item.nombre;
    productDiv.appendChild(nameElement);

    const imageElement = document.createElement("img");
    imageElement.src = `../resources/pizza-pepperoni.jpg`; // Cambiar el nombre de imagen según corresponda
    imageElement.alt = item.nombre;
    imageElement.classList.add("item-image");
    productDiv.appendChild(imageElement);

    // Añadir tipo del producto
    const typeElement = document.createElement("p");
    typeElement.classList.add("item-type");
    typeElement.textContent = item.tipo;
    productDiv.appendChild(typeElement);

    // Añadir precio del producto
    const priceElement = document.createElement("p");
    priceElement.classList.add("item-price");
    priceElement.textContent = `$${item.precio.toFixed(2)}`;
    productDiv.appendChild(priceElement);

    // Botón para añadir al carrito
    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "Agregar al carrito";
    addToCartButton.classList.add("add-to-cart-button");
    addToCartButton.addEventListener("click", () => addToCart(item));
    productDiv.appendChild(addToCartButton);

    // Añadir el producto al contenedor del menú
    menuContainer.appendChild(productDiv);
  });
}

// Función para añadir productos al carrito
const cartItems = [];
function addToCart(item) {
  cartItems.push(item);
  updateCart();
}

// Función para actualizar la vista del carrito
function updateCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");

  // Limpiar contenido previo del carrito
  cartItemsContainer.innerHTML = "";

  // Calcular y mostrar los elementos del carrito
  let total = 0;
  cartItems.forEach((item) => {
    total += item.precio;

    const cartItemElement = document.createElement("li");
    cartItemElement.textContent = `${item.nombre} - $${item.precio.toFixed(2)}`;
    cartItemsContainer.appendChild(cartItemElement);
  });

  // Actualizar el total en el carrito
  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Escuchar clic en el botón "Finalizar Compra"
document
  .getElementById("checkoutButton")
  .addEventListener("click", finalizePurchase);
