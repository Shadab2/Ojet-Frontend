define(["../context/userContext", "axios"], function (UserContext, axios) {
  class UserService {
    constructor() {
      this.baseUrl = "http://localhost:8080/api";
    }

    fetchCaptcha() {
      return axios.get(this.baseUrl + "/auth");
    }

    loginWithCredentials(userCredentials) {
      return axios.post(this.baseUrl + "/auth/login", userCredentials);
    }

    updateUserContext(profile, authToken, dualMode) {
      if (dualMode) UserContext.updateToken(authToken);
      UserContext.updateProfile(profile);
    }

    registerUser(userProfile, captchaId) {
      return axios.post(this.baseUrl + "/auth", {
        ...userProfile,
        captchaId,
      });
    }

    handleSignOut() {
      this.updateUserContext(
        {
          email: "",
          firstName: "",
          lastName: "",
          mobileNo: "",
          profileImage: "",
          role: null,
        },
        "",
        true
      );
    }

    updateProfile(profile) {
      const authToken = UserContext.authToken();
      return axios.put(
        this.baseUrl + "/user",
        { ...profile, email: UserContext.user().email },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
    }
    updateProfilePhoto(fileToUpload) {
      const authToken = UserContext.authToken();
      const formData = new FormData();
      formData.append("file", fileToUpload);
      return axios({
        method: "post",
        url: this.baseUrl + "/user/upload-profile",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
    }

    fetchUserList() {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl + "/user/all", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }

    fetchAllCountries() {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl + "/service/country", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }

    fetchCountryByIso(countryIsoCode) {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl + `/service/country/${countryIsoCode}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }

    fetchRestUserData() {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl + "/service/users", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }

    downloadExcelUserData(userId) {
      const authToken = UserContext.authToken();
      return axios.get(
        this.baseUrl + "/service/users/" + userId + "/download",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "blob",
          },
        }
      );
    }
  }
  return new UserService();
});
