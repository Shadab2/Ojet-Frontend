/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your incidents ViewModel code goes here
 */
define([
  "knockout",
  "../services/UserService",
  "../services/ToastService",
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojinputnumber",
  "ojs/ojbutton",
  "ojs/ojmessages",
], function (ko, UserService, ToastService) {
  function LoginViewModel(context) {
    var self = this;
    const router = context.parentRouter;
    const authenticated = context.routerState.detail.authenticated();
    this.loaded = ko.observable(false);
    if (authenticated) {
      router.go({ path: "home" }).then(function () {
        this.navigated = true;
      });
    }
    self.userLogin = context.routerState.detail.userLogin;

    self.email = ko.observable(null);
    self.password = ko.observable(null);
    self.messages = ko.observableArray(null);

    self.handleLogin = async function () {
      try {
        const credentials = {
          email: self.email(),
          password: self.password(),
        };
        const res = await UserService.loginWithCredentials(credentials);
        const jsonData = res.data;

        UserService.updateUserContext(
          {
            firstName: jsonData.firstName,
            lastName: jsonData.lastName,
            email: jsonData.email,
            mobileNo: jsonData.mobileNo,
            profileImage: jsonData.profileImage,
            role: jsonData.role,
          },
          jsonData.token
        );
        self.userLogin(jsonData.email);
        router.go({ path: "home" }).then(function () {
          this.navigated = true;
        });
      } catch (e) {
        self.messages([ToastService.error("Invalid Username and password!")]);
        console.log(e);
      }
    };
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return LoginViewModel;
});
