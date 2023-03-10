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
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojinputnumber",
  "ojs/ojbutton",
  "ojs/ojknockout",
], function (ko, UserService) {
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
    self.contactNumber = ko.observable(null);
    self.captcha = ko.observable(null);
    self.captchaValue = ko.observable(null);
    self.captchaId = ko.observable(null);

    self.getCaptcha = async function () {
      try {
        const res = await UserService.fetchCaptcha();
        const data = res.data;
        self.captchaValue(data.captcha);
        self.captchaId(data.captchaId);
      } catch (e) {
        console.log(e);
      }
    };
    self.getCaptcha();
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return RegisterViewModel;
});
