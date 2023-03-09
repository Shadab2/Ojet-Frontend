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
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojinputnumber",
  "ojs/ojbutton",
], function (ko) {
  function RegisterViewModel() {
    var self = this;

    self.firstName = ko.observable("");
    self.lastName = ko.observable("");
    self.email = ko.observable("");
    self.password = ko.observable("");
    self.contactNumber = ko.observable(null);
    self.captcha = ko.observable("");
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return RegisterViewModel;
});
