/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define([
  "knockout",
  "./context/userContext",
  "ojs/ojcontext",
  "ojs/ojmodule-element-utils",
  "ojs/ojknockouttemplateutils",
  "ojs/ojcorerouter",
  "ojs/ojmodulerouter-adapter",
  "ojs/ojknockoutrouteradapter",
  "ojs/ojurlparamadapter",
  "ojs/ojresponsiveutils",
  "ojs/ojresponsiveknockoututils",
  "ojs/ojarraydataprovider",
  "ojs/ojdrawerpopup",
  "ojs/ojmodule-element",
  "ojs/ojknockout",
], function (
  ko,
  userContext,
  Context,
  moduleUtils,
  KnockoutTemplateUtils,
  CoreRouter,
  ModuleRouterAdapter,
  KnockoutRouterAdapter,
  UrlParamAdapter,
  ResponsiveUtils,
  ResponsiveKnockoutUtils,
  ArrayDataProvider
) {
  function ControllerViewModel() {
    this.KnockoutTemplateUtils = KnockoutTemplateUtils;

    // Handle announcements sent when pages change, for Accessibility.
    this.manner = ko.observable("polite");
    this.message = ko.observable();
    announcementHandler = (event) => {
      this.message(event.detail.message);
      this.manner(event.detail.manner);
    };

    document
      .getElementById("globalBody")
      .addEventListener("announce", announcementHandler, false);

    // Media queries for repsonsive layouts
    const smQuery = ResponsiveUtils.getFrameworkQuery(
      ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
    );
    this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
    const mdQuery = ResponsiveUtils.getFrameworkQuery(
      ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP
    );
    this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

    // Header
    // Application Name used in Branding Area
    this.appName = ko.observable("Trainings");
    // User Info used in Global Navigation area

    this.authenticated = ko.computed(function () {
      return userContext.authToken !== "";
    });
    this.userLogin = ko.observable(userContext.profile.email);

    let routes = ko.computed(function () {
      if (this.authenticated)
        return [
          {
            path: "profile",
            detail: { label: "Profile", iconClass: " oj-ux-ico-profile-card" },
          },
          {
            path: "services",
            detail: { label: "Services", iconClass: "oj-ux-ico-webhook" },
          },
          {
            path: "about",
            detail: { label: "About", iconClass: "oj-ux-ico-information-s" },
          },
        ];
      return [
        {
          path: "register",
          detail: { label: "Register", iconClass: "oj-ux-ico-batch-edit" },
        },
        {
          path: "login",
          detail: { label: "Login", iconClass: "oj-ux-ico-user-data" },
        },
      ];
    });

    let navData = [
      { path: "", redirect: "home" },
      {
        path: "home",
        detail: { label: "Home", iconClass: "oj-ux-ico-home" },
      },
      ...routes(),
    ];

    // Router setup
    let router = new CoreRouter(navData, {
      urlAdapter: new UrlParamAdapter(),
    });
    router.sync();

    this.moduleAdapter = new ModuleRouterAdapter(router);

    this.selection = new KnockoutRouterAdapter(router);

    // Setup the navDataProvider with the routes, excluding the first redirected
    // route.
    this.navDataProvider = new ArrayDataProvider(navData.slice(1), {
      keyAttributes: "path",
    });

    // Drawer
    self.sideDrawerOn = ko.observable(false);

    // Close drawer on medium and larger screens
    this.mdScreen.subscribe(() => {
      self.sideDrawerOn(false);
    });

    // Called by navigation drawer toggle button and after selection of nav drawer item
    this.toggleDrawer = () => {
      self.sideDrawerOn(!self.sideDrawerOn());
    };

    this.menuItemAction = (event) => {
      router.go({ path: event.detail.selectedValue }).then(function () {
        this.navigated = true;
      });
    };
  }
  // release the application bootstrap busy state
  Context.getPageContext().getBusyContext().applicationBootstrapComplete();

  return new ControllerViewModel();
});
