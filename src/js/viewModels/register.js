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
  "ojs/ojknockout",
], function (ko, UserService, ToastService) {
  function RegisterViewModel(context) {
    var self = this;
    const authenticated = context.routerState.detail.authenticated();
    const router = context.parentRouter;
    if (authenticated) {
      router.go({ path: "home" }).then(function () {
        this.navigated = true;
      });
    }

    self.firstName = ko.observable("");
    self.lastName = ko.observable("");
    self.email = ko.observable("");
    self.password = ko.observable("");
    self.contactNumber = ko.observable("");
    self.captcha = ko.observable("");
    self.captchaValue = ko.observable(null);
    self.captchaId = ko.observable(null);
    self.invalidCaptcha = ko.observable(null);

    self.messages = ko.observableArray(null);

    self.getCaptcha = async function () {
      try {
        const res = await UserService.fetchCaptcha();
        const data = res.data;
        self.captchaValue(data.captcha);
        self.captchaId(data.captchaId);
        self.invalidCaptcha(null);
      } catch (e) {
        console.log(e);
      }
    };
    self.getCaptcha();

    self.handleRegister = async () => {
      const profile = {
        firstName: self.firstName(),
        lastName: self.lastName(),
        email: self.email(),
        password: self.password(),
        mobileNo: self.contactNumber(),
        captcha: self.captcha(),
      };
      try {
        await UserService.registerUser(profile, self.captchaId());
        self.messages([ToastService.success("User Saved successfully")]);
        setTimeout(() => {
          router.go({ path: "login" }).then(function () {
            this.navigated = true;
          });
        }, 2000);
      } catch (e) {
        if (e.response?.data?.message.toLowerCase() === "invalid captcha!") {
          self.invalidCaptcha("Invalid Captcha");
        } else alert("Something went wrong");
      }
    };
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return RegisterViewModel;
});
