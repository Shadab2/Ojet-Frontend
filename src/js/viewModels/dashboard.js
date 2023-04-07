/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define([
  "knockout",
  "../context/userContext",
  "../services/userService",
  "ojs/ojarraydataprovider",
  "ojs/ojknockout",
  "ojs/ojavatar",
], function (ko, UserContext, UserService, ArrayDataProvider) {
  function DashboardViewModel(context) {
    var self = this;
    self.authenticated = context.routerState.detail.authenticated;
    const router = context.parentRouter;
    if (!self.authenticated()) {
      router.go({ path: "login" }).then(function () {
        this.navigated = true;
      });
    }
    const navigationData = [
      { name: "Home", id: "home", icons: "oj-ux-ico-home" },
      { name: "Users", id: "user", icons: "oj-ux-ico-contact-group" },
      { name: "Statistics", id: "stats", icons: "oj-ux-ico-chart-bar" },
      {
        name: "Miscellaneous",
        id: "misc",
        icons: "oj-ux-ico-application-suite",
      },
    ];
    self.user = UserContext.user;
    self.activeTab = ko.observable("user");
    self.navDataProvider = new ArrayDataProvider(navigationData, {
      keyAttributes: "id",
    });
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return DashboardViewModel;
});
