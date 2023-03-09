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
  "ojs/ojcorerouter",
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojinputnumber",
  "ojs/ojbutton",
], function (ko, UserService, CoreRouter) {
  function LoginViewModel() {
    var self = this;

    self.email = ko.observable(null);
    self.password = ko.observable(null);

    self.handleLogin = async function () {
      try {
        const credentials = {
          email: self.email(),
          password: self.password(),
        };
        const res = await UserService.loginWithCredentials(credentials);
        const jsonData = await res.json();
        alert("Login Successfull");
        CoreRouter.go({ path: "home" }).then(function () {
          this.navigated = true;
        });
      } catch (e) {
        alert("Something went wrong");
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
