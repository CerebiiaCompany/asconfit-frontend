const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get("content-type");
      const responseText = await response.text();

      // Check if response is HTML instead of JSON (routing/backend issue)
      if (contentType && !contentType.includes("application/json")) {
        if (endpoint === "/login") {
          throw new Error(
            "Credenciales incorrectas. Por favor verifica tu correo y contraseña."
          );
        }
        throw new Error(
          "Error de servidor. Por favor contacta al administrador."
        );
      }

      if (!response.ok) {
        let errorMessage = "";

        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || "";

          // Laravel validation errors come in errors object
          if (errorData.errors) {
            const firstErrorKey = Object.keys(errorData.errors)[0];
            errorMessage = errorData.errors[firstErrorKey][0];
          }
        } catch {
          // If JSON parsing fails, use default messages based on status
          if (response.status === 401) {
            errorMessage =
              "Credenciales incorrectas. Por favor verifica tu correo y contraseña.";
          } else if (response.status === 422) {
            errorMessage =
              "Datos inválidos. Por favor verifica la información ingresada.";
          } else if (response.status === 500) {
            errorMessage = "Error en el servidor. Por favor intenta más tarde.";
          } else {
            errorMessage =
              "Error al procesar la solicitud. Por favor intenta nuevamente.";
          }
        }

        throw new Error(errorMessage);
      }

      // Try to parse successful response as JSON
      try {
        return JSON.parse(responseText);
      } catch {
        throw new Error(
          "El servidor devolvió una respuesta inválida. Por favor contacta al administrador."
        );
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      if (error.message && !error.message.includes("Unexpected token")) {
        throw error;
      }
      throw new Error(
        "Error de conexión. Por favor verifica tu conexión a internet."
      );
    }
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};
