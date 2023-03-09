define(["knockout"], function (ko) {
  const user = {
    profile: {
      email: "",
      firstName: "",
      lastName: "",
      mobileNo: "",
      profileImage: "",
    },
    authToken: "",
    updateProfileAndToken: function (profileData, authTokenFromBackend) {
      this.profile = profileData;
      this.authToken = authTokenFromBackend;
    },
  };
  return user;
});
