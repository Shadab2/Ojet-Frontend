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
  "../services/userService",
  "ojs/ojarraydataprovider",
  "ojs/ojknockout",
  "ojs/ojtable",
], function (ko, UserService, ArrayDataProvider) {
  function ServicesViewModel(context) {
    const authenticated = context.routerState.detail.authenticated();
    const router = context.parentRouter;
    var self = this;
    if (!authenticated) {
      router.go({ path: "login" }).then(function () {
        this.navigated = true;
      });
    }

    self.countriesData = ko.observableArray([]);
    self.restUserData = ko.observableArray([]);
    self.countryIsoCode = ko.observable("");
    self.countryInfo = ko.observable(null);

    self.getAllCountries = async () => {
      try {
        const res = await UserService.fetchAllCountries();
        self.countriesData(res.data.tcountryCodeAndName);
      } catch (e) {
        console.log(e);
      }
    };

    self.getCountryByIso = async () => {
      if (self.countryIsoCode() === "") return;
      try {
        const res = await UserService.fetchCountryByIso(self.countryIsoCode());
        self.countryInfo(res.data);
      } catch (e) {
        console.log(e);
      }
    };

    self.getRestUser = async () => {
      try {
        const res = await UserService.fetchRestUserData();
        self.restUserData(res.data);
      } catch (e) {
        console.log(e);
      }
    };

    self.dataprovider = new ArrayDataProvider(self.restUserData, {
      keyAttributes: "id",
      implicitSort: [{ attribute: "id", direction: "ascending" }],
    });

    self.downloadExcelUser = async (event, current, bindingContext) => {
      try {
        const res = await UserService.downloadExcelUserData(current.data.id);
        const outputFilename = "userInfo.xlsx";
        var mediaType =
          "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
        const link = document.createElement("a");
        link.href = mediaType + res.data;
        link.setAttribute("download", outputFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (e) {
        console.log(e);
      }
    };

    self.getAllCountries();
    self.getRestUser();
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return ServicesViewModel;
});
