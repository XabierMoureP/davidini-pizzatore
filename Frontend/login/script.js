document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Crea el objeto para enviar a la función Lambda
    const requestBody = {
      operation: "login",
      email: email,
      contrasena: password,
    };

    try {
      const response = await fetch(
        "https://jtousjiobp4duf34gvwc36oky40skqph.lambda-url.eu-west-3.on.aws/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      // Muestra el mensaje de respuesta
      const responseMessage = document.getElementById("responseMessage");
      if (response.ok) {
        window.location.href = "../home/home.html"; // Redirige a la página de inicio
        localStorage.setItem("usuario", email); // Guarda el email en el localStorage
      } else {
        responseMessage.style.color = "red";
        responseMessage.textContent = data.message; // Mensaje de error
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("responseMessage").textContent =
        "Error al comunicarse con el servidor.";
    }
  });
