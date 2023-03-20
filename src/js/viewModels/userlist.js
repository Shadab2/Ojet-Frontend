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
  "ojs/ojarraydataprovider",
  "ojs/ojknockout",
  "ojs/ojlistview",
  "ojs/ojavatar",
  "ojs/ojinputsearch",
], function (ko, UserContext, UserService, ArrayListDataProvider) {
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
    self.userListDataOriginal = ko.observableArray([]);
    self.searchValue = ko.observable();
    self.searchRawValue = ko.observable();
    self.searchTerm = ko.observable();

    self.getUserList = async function () {
      self.refreshing(true);
      try {
        const res = await UserService.fetchUserList();
        const fileteredUsers = res.data.filter(
          (usr) => usr.email !== profile.email
        );
        self.userListDataOriginal(fileteredUsers);
        self.userListData(self.userListDataOriginal());
        self.refreshing(false);
      } catch (e) {
        self.refreshing(false);
      }
    };
    self.getUserList();
    setInterval(() => self.getUserList(), 30 * 1000);

    self.dataProvider = new ArrayListDataProvider(self.userListData, {
      keyAttributes: "id",
    });

    self.handleValueAction = function (event) {
      const value = event.detail.value;
      if (value === "") {
        self.userListData(self.userListDataOriginal());
      }
      self.userListData(
        self
          .userListDataOriginal()
          .filter(
            (usr) =>
              usr.firstName.toLowerCase().includes(value.toLowerCase()) ||
              usr.lastName.toLowerCase().includes(value.toLowerCase())
          )
      );
    };
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return UserlistViewModel;
});
