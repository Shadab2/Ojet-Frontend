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
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojinputnumber",
  "ojs/ojbutton",
  "ojs/ojknockout",
], function (ko, UserContext, UserService) {
  function ProfileViewModel(context) {
    var self = this;
    const authenticated = context.routerState.detail.authenticated();
    const router = context.parentRouter;
    if (!authenticated) {
      router.go({ path: "login" }).then(function () {
        this.navigated = true;
      });
    }
    const profile = UserContext.profile;
    self.firstName = ko.observable(profile.firstName);
    self.lastName = ko.observable(profile.lastName);
    self.email = ko.observable(profile.email);
    self.mobileNo = ko.observable(profile.mobileNo);
    self.profileImage = ko.observable(
      profile.profileImage
        ? "data:image/jpeg;base64," + profile.profileImage
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA7J_nWmuLQLoOtHyvwRXfkrkVvW621Bx9nQ&usqp=CAU"
    );
    self.fileToUpload = ko.observable(null);

    self.editableFirstName = ko.observable(profile.firstName);
    self.editableLastName = ko.observable(profile.lastName);
    self.editableMobileNo = ko.observable(profile.mobileNo);

    self.handleProfileImageUpdate = async function () {
      if (!self.fileToUpload()) return;
      try {
        const res = await UserService.updateProfilePhoto(self.fileToUpload());
        const data = await res.data;
        self.profileImage("data:image/jpeg;base64," + data.image);
        alert("Profile page updated");
        const updatedProfile = {
          firstName: profile.firstName,
          lastName: profile.lastName,
          mobileNo: profile.mobileNo,
          email: profile.email,
          role: profile.role,
          profileImage: data.image,
        };
        UserContext.updateProfile(updatedProfile);
      } catch (e) {
        alert("Something went wrong");
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
        alert("No empty fields allowed");
        return;
      }
      const editableProfile = {
        firstName: self.editableFirstName(),
        lastName: self.editableLastName(),
        mobileNo: self.editableMobileNo(),
        email: self.email(),
      };
      try {
        const res = await UserService.updateProfile(editableProfile);
        self.firstName(self.editableFirstName());
        self.lastName(self.editableLastName());
        self.mobileNo(self.editableMobileNo());
        alert("Profile Updated Successfully!");
        const updatedProfile = {
          firstName: self.firstName(),
          lastName: self.lastName(),
          mobileNo: self.mobileNo(),
          email: self.email(),
          role: profile.role,
          profileImage: profile.profileImage,
        };
        UserContext.updateProfile(updatedProfile);
      } catch (e) {
        alert("Something went wrong");
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
