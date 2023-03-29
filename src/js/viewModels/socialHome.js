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
        let data = res.data.map((ps) => {
          return {
            post: {
              id: ps.id,
              title: ps.title,
              description: ps.description,
              images: ps.postImages.map(
                (file) => "data:image/jpeg;base64," + file.base64Image
              ),
              techStacks: ps.techStacks,
              resourceLinks: ps.resourceLinks,
              dateModified: ps.dateModified,
              postFeedBack: ps.postFeedBack,
              type: "Completed",
            },
            user: {
              firstName: ps.user.firstName,
              lastName: ps.user.lastName,
              profileImage: ps.user.profileImage
                ? "data:image/jpeg;base64," + ps.user.profileImage
                : UserContext.avatar,
            },
          };
        });
        self.posts(data);
      } catch (e) {
        console.log(e);
      }
    };

    self.getAllPublicPosts();
  }
  return SocialHomeViewModel;
});
