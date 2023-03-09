define(["../context/userContext"], function (userContext) {
  class UserService {
    constructor() {}

    fetchCaptcha() {
      return fetch("http://localhost:8080/api/auth", {
        method: "GET",
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

    updateUserContext(profile, authToken) {
      userContext.updateProfileAndToken(profile, authToken);
    }

    handleSignOut() {
      this.updateUserContext(
        {
          email: "",
          firstName: "",
          lastName: "",
          mobileNo: "",
          profileImage: "",
        },
        ""
      );
    }
  }
  return new UserService();
});
