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
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojinputsearch",
  "ojs/ojavatar",
], function (ko, UserContext, UserService, ArrayDataProvider) {
  function SocialViewModel(context) {
    const authenticated = context.routerState.detail.authenticated();
    const router = context.parentRouter;
    if (!authenticated) {
      router.go({ path: "login" }).then(function () {
        this.navigated = true;
      });
    }
    var self = this;
    const navigationData = [
      { name: "Home", id: "home", icons: "oj-ux-ico-home" },
      { name: "Create", id: "create", icons: "oj-ux-ico-library-add" },
      { name: "Upvoted", id: "upvoted", icons: "oj-ux-ico-content-item-list" },
      {
        name: "Message",
        id: "message",
        icons: "oj-ux-ico-oracle-chat-outline",
      },
      {
        name: "Groups",
        id: "groups",
        icons: "oj-ux-ico-contact-group",
      },
      {
        name: "Videos",
        id: "videos",
        icons: "oj-ux-ico-video-create",
      },
      {
        name: "Bookmarks",
        id: "bookmarsk",
        icons: "oj-ux-ico-bookmark-selected",
      },
      {
        name: "Events",
        id: "Events",
        icons: "oj-ux-ico-event-available",
      },
      {
        name: "Courses",
        id: "courses",
        icons: "oj-ux-ico-self-study",
      },
    ];

    self.user = UserContext.user;
    self.activeTab = ko.observable("home");
    self.navDataProvider = new ArrayDataProvider(navigationData, {
      keyAttributes: "id",
    });

    self.searchValue = ko.observable();
    self.searchRawValue = ko.observable();
    self.searchTerm = ko.observable();

    self.handleValueAction = function () {};
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return SocialViewModel;
});
