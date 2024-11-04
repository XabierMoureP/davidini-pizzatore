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
      console.log(data)
    })
    .catch((error) => {
      // Manejar errores
      document.getElementById("response").innerText =
        "Hubo un error al registrar el usuario";
      console.error("Error:", error);
    });
});

const menuContainer = document.getElementById("menuContainer");

// Función para cargar los elementos del menú
function loadMenuItems(menuData) {
    menuData.menu.forEach(item => {
        // Crear un contenedor para cada producto
        const productDiv = document.createElement("div");
        productDiv.classList.add("menu-item");

        // Añadir nombre del producto
        const nameElement = document.createElement("h3");
        nameElement.textContent = item.nombre;
        productDiv.appendChild(nameElement);

        const imageElement = document.createElement("img");
        imageElement.src = `../resources/pizza-pepperoni.jpg`;  // Asume que la imagen está en la carpeta 'images' y usa el id_producto como nombre de archivo
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
    cartItems.forEach(item => {
        total += item.precio;

        const cartItemElement = document.createElement("li");
        cartItemElement.textContent = `${item.nombre} - $${item.precio.toFixed(2)}`;
        cartItemsContainer.appendChild(cartItemElement);
    });

    // Actualizar el total en el carrito
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}
