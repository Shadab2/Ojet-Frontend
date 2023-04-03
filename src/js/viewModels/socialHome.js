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
    self.user = UserContext.user;

    self.getAllPublicPosts = async function () {
      try {
        const res = await PostService.fetchAllPublicPosts();
        const mappings = await PostService.fetchUserMappings();
        let data = res.data.map((ps) => {
          return PostService.parsePostData(
            ps,
            mappings.data.liked,
            mappings.data.saved
          );
        });
        self.posts(data);
      } catch (e) {
        console.log(e);
      }
    };

    self.getAllPublicPosts();

    setInterval(() => {
      self.getAllPublicPosts();
    }, 2 * 60 * 1000);
  }
  return SocialHomeViewModel;
});
