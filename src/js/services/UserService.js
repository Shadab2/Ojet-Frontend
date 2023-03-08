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
      return fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        crossorigin: true,
        mode: "no-cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });
    }
  }
  return new UserService();
});
