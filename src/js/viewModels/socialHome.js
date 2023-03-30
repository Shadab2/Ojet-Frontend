define([
  "knockout",
  "../context/userContext",
  "../services/postService",
  "ojs/ojknockout",
], function (ko, UserContext, PostService) {
  function SocialHomeViewModel(params) {
    var self = this;
    self.activeTab = params.activeTab;
    self.posts = ko.observableArray([]);
    self.likedPostsIds = ko.observable(new Set());
    self.user = UserContext.user;

    self.getUpvotedPosts = async function () {
      try {
        const res = await PostService.fetchAllUpvotedPosts();
        const newSet = new Set();
        res.data.forEach((ps) => newSet.add(ps.id));
        self.likedPostsIds(newSet);
      } catch (e) {}
    };

    self.getUpvotedPosts();
    self.getAllPublicPosts = async function () {
      try {
        const res = await PostService.fetchAllPublicPosts();
        let data = res.data.map((ps) => {
          return PostService.parsePostData(ps, self.likedPostsIds());
        });
        self.posts(data);
      } catch (e) {
        console.log(e);
      }
    };

    self.getAllPublicPosts();

    setInterval(() => {
      (async function () {
        await self.getUpvotedPosts();
        self.getAllPublicPosts();
      })();
    }, 60 * 1000);
  }
  return SocialHomeViewModel;
});
