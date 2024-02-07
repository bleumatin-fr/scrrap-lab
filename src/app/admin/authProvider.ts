import { AuthProvider } from "react-admin";

const AUTH_API_URL = "/api/authentication";

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const request = new Request(`${AUTH_API_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ email: username, password }),
      credentials: "include",
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    const response = await fetch(request);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.statusText);
    }
    const auth = await response.json();
    localStorage.setItem("auth", JSON.stringify(auth));
  },
  logout: () => {
    localStorage.removeItem("auth");
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem("auth") ? Promise.resolve() : Promise.reject(),
  checkError: (error) => {
    if (error?.status === 401) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getIdentity: async () => {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (!auth) {
      return Promise.reject();
    }
    return Promise.resolve({ id: auth.id, fullName: auth.fullName });
  },
  getPermissions: () => {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (!auth) {
      return Promise.reject();
    }
    return Promise.resolve(auth.permissions);
  },
};

export default authProvider;
