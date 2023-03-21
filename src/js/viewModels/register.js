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
  "ojs/ojasyncvalidator-regexp",
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojinputnumber",
  "ojs/ojbutton",
  "ojs/ojmessages",
  "ojs/ojknockout",
], function (ko, UserService, ToastService, AsyncRegExpValidator) {
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

    self.emailValidator = ko.observableArray([
      new AsyncRegExpValidator({
        pattern:
          "[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*",
        hint: "Enter a valid email format",
        messageDetail: "Not a valid email format",
      }),
    ]);
    self.phoneNumberValidator = ko.observableArray([
      new AsyncRegExpValidator({
        pattern: "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$",
        hint: "enter a valid phone number",
        messageDetail: "Not a valid Phone format",
      }),
    ]);

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

    self.validate = function (profile) {
      for (let keys of Object.keys(profile)) {
        if (!profile[keys]) return false;
      }
      return true;
    };
    self.handleRegister = async () => {
      const profile = {
        firstName: self.firstName(),
        lastName: self.lastName(),
        email: self.email(),
        password: self.password(),
        mobileNo: self.contactNumber(),
        captcha: self.captcha(),
      };
      if (!self.validate(profile)) {
        self.messages([ToastService.error("Empty feilds are not allowed")]);
        return;
      }
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
