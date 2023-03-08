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
define(["../services/UserService"], function (UserService) {
  function LoginViewModel() {
    //   UserService.loginWithCredentials({
    //     email: "Shadab2.danish2@gmail.com",
    //     password: "123456",
    //   })
    //     .then((res) => res.json())
    //     .then((data) => console.log(data));
    UserService.fetchCaptcha()
      .then((res) => res.json())
      .then((json) => console.log(json));
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return LoginViewModel;
});
