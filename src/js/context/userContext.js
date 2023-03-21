define(["knockout"], function (ko) {
  var self = this;
  self.authToken = ko.observable("");

  self.user = ko.observable({
    email: "",
    firstName: "",
    lastName: "",
    mobileNo: "",
    profileImage: null,
    role: null,
    addressList: [],
  });

  self.authenticated = ko.computed(function () {
    return self.authToken() !== "";
  });

  self.admin = ko.computed(function () {
    return self.user().role === 0;
  });

  self.updateProfile = function (profile) {
    const updatedProfile = { ...self.user() };
    for (let keys of Object.keys(profile)) {
      updatedProfile[keys] = profile[keys];
    }

    if ("profileImage" in profile) {
      updatedProfile.profileImage = profile.profileImage
        ? "data:image/jpeg;base64," + profile.profileImage
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA7J_nWmuLQLoOtHyvwRXfkrkVvW621Bx9nQ&usqp=CAU";
    }
    self.user(updatedProfile);
  };

  self.updateToken = function (authTokenFromBackend) {
    self.authToken(authTokenFromBackend);
  };

  return self;
});
