define([
  "knockout",
  "../context/userContext",
  "../services/postService",
  "ojs/ojknockout",
], function (ko, UserContext, PostService) {
  function PostListViewModel(params) {
    var self = this;
    self.activeTab = params.activeTab;
    self.headerValue = params.headerValue;
    self.listEmptyValue = params.listEmptyValue;
    self.fetchFunction = params.fetchFunction;

    self.postsData = ko.observableArray([]);
    self.loading = ko.observable(true);

    self.onCompleteFetch = function (data, loading) {
      self.postsData(data);
      self.loading(loading);
    };
    self.fetchFunction(self.onCompleteFetch);
  }
  return PostListViewModel;
});
