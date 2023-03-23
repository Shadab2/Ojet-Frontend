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
  "./services/UserService",
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
  UserContext,
  UserService,
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

    var current = this;
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

    current.user = UserContext.user;
    current.admin = UserContext.admin;
    current.authenticated = UserContext.authenticated;

    current.userLogin = ko.computed(function () {
      return current.user().email;
    });

    let navData = [
      { path: "", redirect: "login" },
      {
        path: "home",
        detail: {
          label: "Home",
          iconClass: "oj-ux-ico-home",
          authenticated: current.authenticated,
        },
      },
      {
        path: "profile",
        detail: {
          label: "Profile",
          iconClass: " oj-ux-ico-profile-card",
          authenticated: current.authenticated,
        },
      },
      {
        path: "services",
        detail: {
          label: "Services",
          iconClass: "oj-ux-ico-webhook",
          authenticated: current.authenticated,
        },
      },
      {
        path: "dashboard",
        detail: {
          label: "Dashboard",
          iconClass: "oj-ux-ico-bar-chart",
          authenticated: current.authenticated,
        },
      },
      {
        path: "register",
        detail: {
          label: "Register",
          iconClass: "oj-ux-ico-batch-edit",
          authenticated: current.authenticated,
        },
      },
      {
        path: "login",
        detail: {
          label: "Login",
          iconClass: "oj-ux-ico-user-data",
          authenticated: current.authenticated,
        },
      },
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
    this.navDataProvider = ko.computed(function () {
      if (current.authenticated()) {
        return new ArrayDataProvider(
          current.admin() ? navData.slice(1, 5) : navData.slice(1, 4),
          {
            keyAttributes: "path",
          }
        );
      } else
        return new ArrayDataProvider(navData.slice(5), {
          keyAttributes: "path",
        });
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
      if (event.detail.selectedValue === "out") {
        UserService.handleSignOut();
        router.go({ path: "login" }).then(function () {
          this.navigated = true;
        });
        return;
      }
      router.go({ path: event.detail.selectedValue }).then(function () {
        this.navigated = true;
      });
    };
  }
  // release the application bootstrap busy state
  Context.getPageContext().getBusyContext().applicationBootstrapComplete();

  return new ControllerViewModel();
});
