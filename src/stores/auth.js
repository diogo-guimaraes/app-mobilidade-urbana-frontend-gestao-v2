import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "boot/axios";

export const useAuthStore = defineStore("auth", () => {
  // --- STATE ---
  const user = ref(null);
  const token = ref(localStorage.getItem("token") || null);

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!token.value);
  const getUser = computed(() => user.value);

  // --- ACTIONS ---

  // Função para buscar dados do usuário logado
  async function fetchUser() {
    try {
      const response = await api.get("/usuario-logado");
      console.log(response.data, 'response');
      user.value = response.data;
      console.log('user', user);
      return response;
    } catch (error) {
      logout();
      throw error;
    }
  }

  // Função de login
  async function login(credentials) {
    const response = await api.post("auth/login", credentials);
    const newToken = response.data.token;

    // Guarda o token
    setToken(newToken);

    // Busca dados do usuário
    await fetchUser();

    return response;
  }

  // Logout
  function logout() {
    user.value = null;
    setToken(null);
  }

  // Define ou remove o token
  function setToken(newToken) {
    token.value = newToken;

    if (newToken) {
      localStorage.setItem("token", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    getUser,
    login,
    logout,
    fetchUser,
  };
});
