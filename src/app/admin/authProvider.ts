import { AuthProvider } from "react-admin";

export const PREFIX = "scrapp-lab";

const authProviderFactory: (endpoint: string | undefined) => AuthProvider = (
  endpoint: string | undefined
) => {
  const AUTH_API_URL = `${endpoint || "/api"}/authentication`;
  return {
    login: async ({ username, password }) => {
      const request = new Request(`${AUTH_API_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ email: username, password }),
        credentials: "include",
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      const response = await fetch(request);
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Utilisateur ou mot de passe incorrect");
      }
      const auth = await response.json();
      localStorage.setItem(`${PREFIX}-auth`, JSON.stringify(auth));
    },
    logout: () => {
      localStorage.removeItem(`${PREFIX}-auth`);
      return Promise.resolve();
    },
    checkAuth: () => {
      return localStorage.getItem(`${PREFIX}-auth`)
        ? Promise.resolve()
        : Promise.reject();
    },
    checkError: (error) => {
      if (error?.status === 401) {
        localStorage.removeItem(`${PREFIX}-auth`);
        return Promise.reject();
      }
      return Promise.resolve();
    },
    getIdentity: async () => {
      const auth = JSON.parse(localStorage.getItem(`${PREFIX}-auth`) || "null");
      if (!auth) {
        return Promise.reject({
          status: 401,
        });
      }
      return Promise.resolve({
        ...auth,
        fullName: `${auth.firstName} ${auth.lastName}`,
      });
    },
    getPermissions: () => {
      const auth = JSON.parse(localStorage.getItem(`${PREFIX}-auth`) || "null");
      if (!auth) {
        return Promise.resolve([]);
      }
      return Promise.resolve(auth.permissions);
    },
  };
};
export default authProviderFactory;
