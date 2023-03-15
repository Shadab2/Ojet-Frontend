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
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojinputnumber",
  "ojs/ojbutton",
  "ojs/ojmessages",
  "ojs/ojknockout",
], function (ko, UserContext, UserService, ToastService) {
  function ProfileViewModel(context) {
    var self = this;
    const authenticated = context.routerState.detail.authenticated();
    const router = context.parentRouter;
    if (!authenticated) {
      router.go({ path: "login" }).then(function () {
        this.navigated = true;
      });
    }
    self.profile = UserContext.user;
    self.fileToUpload = ko.observable(null);

    self.editableFirstName = ko.observable(self.profile().firstName);
    self.editableLastName = ko.observable(self.profile().lastName);
    self.editableMobileNo = ko.observable(self.profile().mobileNo);

    self.messages = ko.observableArray(null);

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
      } catch (e) {
        self.messages([ToastService.error("Something went wrong!")]);
      }
    };

    self.handleFileChange = function (e) {
      self.fileToUpload(e.target.files[0]);
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
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return ProfileViewModel;
});
1;
