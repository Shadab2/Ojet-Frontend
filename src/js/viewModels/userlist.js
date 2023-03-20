/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your about ViewModel code goes here
 */
define([
  "knockout",
  "../context/userContext",
  "../services/userService",
  "ojs/ojknockout",
], function (ko, UserContext, UserService) {
  function UserlistViewModel(context) {
    var self = this;
    const authenticated = context.routerState.detail.authenticated();
    const router = context.parentRouter;
    if (!authenticated) {
      router.go({ path: "login" }).then(function () {
        this.navigated = true;
      });
    }
    const profile = UserContext.user();
    self.refreshing = ko.observable(true);
    self.profileImage = profile.profileImage;
    self.userListData = ko.observableArray([]);

    self.getUserList = async function () {
      self.refreshing(true);
      try {
        const res = await UserService.fetchUserList();
        const fileteredUsers = res.data.filter(
          (usr) => usr.email !== profile.email
        );
        self.userListData(fileteredUsers);
        self.refreshing(false);
      } catch (e) {
        self.refreshing(false);
      }
    };
    self.getUserList();
    setInterval(() => self.getUserList(), 30 * 1000);
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return UserlistViewModel;
});
