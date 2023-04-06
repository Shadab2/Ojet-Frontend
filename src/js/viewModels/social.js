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
  "../services/toastService",
  "../services/postService",
  "ojs/ojarraydataprovider",
  "ojs/ojswitcher",
  "ojs/ojswitch",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojformlayout",
  "ojs/ojselectsingle",
  "ojs/ojdialog",
  "ojs/ojinputsearch",
  "ojs/ojlistview",
  "ojs/ojlistitemlayout",
  "ojs/ojknockout",
  "ojs/ojavatar",
], function (
  ko,
  UserContext,
  UserService,
  ToastService,
  PostService,
  ArrayDataProvider
) {
  function SocialViewModel(context) {
    const authenticated = context.routerState.detail.authenticated();
    const router = context.parentRouter;
    if (!authenticated) {
      router.go({ path: "login" }).then(function () {
        this.navigated = true;
      });
    }
    var self = this;
    this.connected = () => {};

    this.disconnected = () => {};

    const navigationData = [
      { name: "Home", id: "home", icons: "oj-ux-ico-home" },
      { name: "Create", id: "create", icons: "oj-ux-ico-library-add" },
      { name: "Upvoted", id: "upvoted", icons: "oj-ux-ico-thumbs-up" },
      { name: "Search", id: "search", icons: "oj-ux-ico-search-list" },
      {
        name: "Your Posts",
        id: "yourPost",
        icons: "oj-ux-ico-user-available",
      },
      {
        name: "Saved",
        id: "saved",
        icons: "oj-ux-ico-bookmark",
      },
      {
        name: "Trending",
        id: "trending",
        icons: "oj-ux-ico-trending-up",
      },
      {
        name: "Community",
        id: "message",
        icons: "oj-ux-ico-oracle-chat-outline",
      },
      {
        name: "Gallery",
        id: "gallery",
        icons: "oj-ux-ico-library-image",
      },
      {
        name: "Groups",
        id: "groups",
        icons: "oj-ux-ico-contact-group",
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
    self.userMappings = ko.observable({ liked: [], saved: [] });
    self.messages = ko.observableArray(null);
    self.postListMatch = ko.computed(function () {
      const activeTab = self.activeTab();
      const postListValues = new Set([
        "upvoted",
        "yourPost",
        "saved",
        "trending",
      ]);
      return postListValues.has(activeTab);
    });
    self.trendingPosts = ko.observableArray([]);
    self.trendinPostDataProvider = new ArrayDataProvider(self.trendingPosts, {
      keyAttributes: "id",
    });
    self.notificationList = ko.observableArray([]);
    self.notificationVisible = ko.observable(false);

    self.modalOpen = function () {
      document.getElementById("modalDialogNotification").open();
    };

    self.closeModal = function () {
      document.getElementById("modalDialogNotification").close();
    };

    self.getUserMappings = async function () {
      try {
        const res = await PostService.fetchUserMappings();
        self.userMappings({
          liked: res.data.liked,
          saved: res.data.saved,
        });
      } catch (e) {
        console.log(e);
      }
    };

    self.fetchTrendingPosts = async function () {
      try {
        const res = await PostService.fetchTrendingPosts();
        await self.getUserMappings();
        let data = res.data.map((ps) => {
          return PostService.parsePostData(
            ps,
            self.userMappings().liked,
            self.userMappings().saved
          );
        });
        self.trendingPosts(data);
      } catch (e) {
        console.log(e);
      }
    };

    self.fetchTrendingPosts();

    // navigationConfig
    self.config = {
      upvoted: {
        activeTab: self.activeTab,
        headerValue: "All Liked Posts in one place",
        listEmptyValue: "You dont have any upvoted post",
        fetchFunction: async function (cb) {
          try {
            const res = await PostService.fetchAllUpvotedPosts();
            await self.getUserMappings();
            let data = res.data.map((ps) => {
              return PostService.parsePostData(
                ps,
                self.userMappings().liked,
                self.userMappings().saved
              );
            });
            cb(data, false);
          } catch (e) {
            console.log(e);
            cb([], false);
          }
        },
      },
      yourPost: {
        activeTab: self.activeTab,
        headerValue: "All Your Posts in one place",
        listEmptyValue: "Oops! you didn't posted lately",
        fetchFunction: async function (cb) {
          try {
            const res = await PostService.fetchOwnerPost();
            await self.getUserMappings();
            let data = res.data.map((ps) => {
              return PostService.parsePostData(
                ps,
                self.userMappings().liked,
                self.userMappings().saved
              );
            });
            cb(data, false);
          } catch (e) {
            cb([], false);
          }
        },
      },
      trending: {
        activeTab: self.activeTab,
        headerValue: "Top 5 trends of the  week",
        listEmptyValue: "We are still fetching , hang on",
        fetchFunction: async function (cb) {
          try {
            const res = await PostService.fetchTrendingPosts();
            await self.getUserMappings();
            let data = res.data.map((ps) => {
              return PostService.parsePostData(
                ps,
                self.userMappings().liked,
                self.userMappings().saved
              );
            });
            cb(data, false);
          } catch (e) {
            cb([], false);
          }
        },
      },
      saved: {
        activeTab: self.activeTab,
        headerValue: "Your Saved posts in one place",
        listEmptyValue: "You don't have any saved posts!",
        fetchFunction: async function (cb) {
          try {
            const res = await PostService.fetchUserSavedPost();
            await self.getUserMappings();
            let data = res.data.map((ps) => {
              return PostService.parsePostData(
                ps,
                self.userMappings().liked,
                self.userMappings().saved
              );
            });
            cb(data, false);
          } catch (e) {
            cb([], false);
          }
        },
      },
    };

    self.searchValue = ko.observable("");
    self.searchRawValue = ko.observable();
    self.searchOptionsProvider = new ArrayDataProvider(
      [
        { label: "Tech Stack", value: "tech" },
        { label: "Title", value: "title" },
        { label: "Tech Stack or Title", value: "or" },
      ],
      {
        keyAttributes: "value",
      }
    );

    self.searchOptions = ko.observable("tech");
    self.searchLoading = ko.observable(false);
    self.searchRes = ko.observableArray([]);

    self.getSearchResults = async function () {
      const searchOptionsObj = {};
      const selectOption = self.searchOptions();
      const searchTerm = self.searchValue();
      if (!searchTerm || searchTerm.length <= 3) {
        self.messages([
          ToastService.error("Type at least 4 characters to search"),
        ]);
        return;
      }
      if (selectOption == "or") {
        searchOptionsObj["tech"] = searchOptionsObj["title"] = searchTerm;
      } else if (selectOption == "tech") {
        searchOptionsObj["tech"] = searchTerm;
      } else searchOptionsObj["title"] = searchTerm;
      self.searchLoading(true);
      try {
        const res = await PostService.searchPosts(searchOptionsObj);
        const upvotedPosts = await PostService.fetchAllUpvotedPosts();
        await self.getUserMappings();
        let data = res.data.map((ps) => {
          return PostService.parsePostData(
            ps,
            self.userMappings().liked,
            self.userMappings().saved
          );
        });
        self.searchRes(data);
        self.searchLoading(false);
      } catch (e) {
        self.searchLoading(false);
        console.log(e);
      }
    };

    self.handleValueAction = function (e) {
      self.searchValue(e.detail.value);
      if (self.activeTab() !== "search") self.activeTab("search");
      self.getSearchResults();
    };
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return SocialViewModel;
});
