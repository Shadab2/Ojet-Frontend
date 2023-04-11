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
  "../context/userContext",
  "../services/userService",
  "../services/ToastService",
  "ojs/ojarraydataprovider",
  "ojs/ojlistview",
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojinputnumber",
  "ojs/ojbutton",
  "ojs/ojmessages",
  "ojs/ojfilepicker",
  "ojs/ojselectsingle",
  "ojs/ojknockout",
], function (ko, UserContext, UserService, ToastService, ArrayDataProvider) {
  function ProfileViewModel(context) {
    var self = this;
    self.authenticated = context.routerState.detail.authenticated;
    const router = context.parentRouter;
    if (!self.authenticated()) {
      router.go({ path: "login" }).then(function () {
        this.navigated = true;
      });
    }
    self.profile = UserContext.user;
    self.fileToUpload = ko.observable(null);
    self.editableFirstName = ko.observable(self.profile().firstName);
    self.editableLastName = ko.observable(self.profile().lastName);
    self.editableMobileNo = ko.observable(self.profile().mobileNo);

    self.updateButtonEnable = ko.computed(function () {
      return (
        self.profile().firstName !== self.editableFirstName() ||
        self.profile().lastName !== self.editableLastName() ||
        self.profile().mobileNo !== self.editableMobileNo()
      );
    });

    self.messages = ko.observableArray(null);
    self.address = ko.observable({
      country: "",
      state: "",
      city: "",
      street: "",
    });

    // observables about the data source for  address
    self.countriesData = ko.observableArray([]);
    self.statesData = ko.observableArray([]);
    self.citiesData = ko.observableArray([]);

    self.countriesDataProvider = new ArrayDataProvider(self.countriesData, {
      keyAttributes: "value",
    });
    self.statesDataProvider = new ArrayDataProvider(self.statesData, {
      keyAttributes: "value",
    });
    self.citiesDataProvider = new ArrayDataProvider(self.citiesData, {
      keyAttributes: "value",
    });

    self.getCountryList = async function () {
      try {
        const res = await UserService.fetchCountryAddressList();
        self.countriesData(
          res.data.map((countryData) => {
            return {
              value: countryData.country_name,
              label: countryData.country_name,
            };
          })
        );
      } catch (e) {
        console.log(e);
      }
    };
    self.getCountryList();

    self.getStateList = async function () {
      try {
        const res = await UserService.fetchStateAddressList(
          self.address().country
        );
        self.statesData(
          res.data.map((stateData) => {
            return {
              value: stateData.state_name,
              label: stateData.state_name,
            };
          })
        );
      } catch (e) {
        console.log(e);
      }
    };
    self.getCityList = async function () {
      try {
        const res = await UserService.fetchCityAddressList(
          self.address().state
        );
        self.citiesData(
          res.data.map((cityData) => {
            return {
              value: cityData.city_name,
              label: cityData.city_name,
            };
          })
        );
      } catch (e) {
        console.log(e);
      }
    };

    self.handleProfileImageUpdate = async function () {
      if (!self.fileToUpload()) {
        self.messages([ToastService.error("Please select a file first")]);
        return;
      }
      try {
        const res = await UserService.updateProfilePhoto(self.fileToUpload());
        const data = await res.data;
        const updatedProfile = {
          profileImage: data.image,
        };
        UserService.updateUserContext(updatedProfile);
        self.messages([
          ToastService.success("Profile Image Updated Successfully!"),
        ]);
        self.fileToUpload = ko.observable(null);
      } catch (e) {
        self.messages([ToastService.error("Something went wrong!")]);
      }
    };

    self.handleFileChange = function (e) {
      self.fileToUpload(e.detail.files[0]);
    };

    self.invalidListener = function () {
      self.messages([ToastService.error("Invalid File Type")]);
    };
    self.handleProfileUpdate = async function () {
      if (
        self.editableFirstName() === "" ||
        self.editableLastName === "" ||
        self.editableMobileNo === ""
      ) {
        self.messages([ToastService.error("Empty Feilds are not allowed!")]);
        return;
      }
      const editableProfile = {
        firstName: self.editableFirstName(),
        lastName: self.editableLastName(),
        mobileNo: self.editableMobileNo(),
      };
      try {
        const res = await UserService.updateProfile(editableProfile);
        UserService.updateUserContext(editableProfile);
        self.messages([ToastService.success("Profile Updated Successfully!")]);
      } catch (e) {
        self.messages([ToastService.error("Something went wrong!")]);
      }
    };

    self.onCountryValueChange = (event) => {
      self.address({
        state: "",
        city: "",
        street: self.address().street,
        country: event.detail.value,
      });
      self.getStateList();
    };

    self.onStateValueChange = (event) => {
      self.address({ ...self.address(), state: event.detail.value, city: "" });
      self.getCityList();
    };

    self.onCityValueChange = function (event) {
      self.address({ ...self.address(), city: event.detail.value });
    };

    self.handleAddressUpdate = async function () {
      if (self.address().street === "") {
        self.messages([ToastService.error("Invalid File Type")]);
        return;
      }
      try {
        const res = await UserService.updateUserAddress(self.address());
        UserService.updateUserContext({
          addressList: res.data,
        });
        self.messages([ToastService.success("Address added sucessfully")]);
        self.address({
          country: "",
          state: "",
          city: "",
          street: "",
        });
      } catch (e) {
        console.log(e);
        self.messages([ToastService.error("Something went wrong")]);
      }
    };
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return ProfileViewModel;
});
