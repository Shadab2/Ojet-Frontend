define([
  "knockout",
  "../context/userContext",
  "../services/postService",
  "ojs/ojknockout",
], function (ko, UserContext, PostService) {
  function UpvotedPostViewModel(params) {
    var self = this;
    self.activeTab = params.activeTab;
    self.upvotedPosts = ko.observableArray([]);

    self.getUpvotedPosts = async function () {
      try {
        const res = await PostService.fetchAllUpvotedPosts();
        const newSet = new Set();
        res.data.forEach((ps) => newSet.add(ps.id));
        let data = res.data.map((ps) => {
          return PostService.parsePostData(ps, newSet);
        });
        self.upvotedPosts(data);
      } catch (e) {}
    };

    self.getUpvotedPosts();
  }
  return UpvotedPostViewModel;
});
