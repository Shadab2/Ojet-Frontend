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
define(["knockout", "../accUtils"], function (ko, accUtils) {
  function HomeViewModel() {
    var self = this;
    this.loaded = ko.observable(false);
    this.connected = () => {
      accUtils.announce("Home page loaded.", "assertive");
      document.title = "Home";
      setTimeout(() => {
        this.loaded(true);
      }, 50);
      // Implement further logic if needed
    };
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return HomeViewModel;
});
