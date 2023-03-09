define([], function () {
  class UserService {
    constructor() {}

    fetchCaptcha() {
      return fetch("http://localhost:8080/api/auth", {
        method: "GET",
        crossorigin: true,
        mode: "no-cors",
      });
    }

    loginWithCredentials(userCredentials) {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      };
      return fetch("http://localhost:8080/api/auth/login", config);
    }
  }
  return new UserService();
});
