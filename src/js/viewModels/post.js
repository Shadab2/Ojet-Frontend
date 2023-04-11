define([
  "knockout",
  "timeago",
  "../services/postService",
  "../context/userContext",
  "ojs/ojknockout",
  "ojs/ojaccordion",
  "ojs/ojdialog",
  "ojs/ojinputtext",
], function (ko, timeago, PostService, UserContext) {
  function PostViewModel(params) {
    var self = this;
    self.user = params.user;
    self.post = params.post;
    self.username = self.user.firstName + " " + self.user.lastName;
    self.postimages = ko.observableArray(self.post.images);
    self.resourceLinks = ko.observableArray(self.post.resourceLinks);
    self.youtubeLink = self.post.youtubeLink;
    self.index = ko.observable(0);
    self.commentVal = ko.observable("");
    self.commentButtonDisable = ko.observable(!self.post.id);
    self.commentVisible = ko.observable(false);
    self.saved = ko.observable(self.post.saved);
    self.image = ko.observable(
      self.postimages().length > 0 ? self.postimages()[0] : ""
    );
    self.upvoted = ko.observable(self.post.upvoted);

    self.date = ko.observable(timeago.format(self.post.dateModified));
    self.postFeedback = ko.observable(
      self.post.postFeedBack
        ? self.post.postFeedBack
        : {
            upvotesCount: 0,
            commentsCount: 0,
            commentsList: [],
          }
    );

    self.formatDate = function (dateString) {
      return timeago.format(dateString);
    };

    self.titleClass = ko.computed(function () {
      const hexColorsStyles = [
        "text-[#d30a43]",
        "text-[#8f098f]",
        "text-[#F80102]",
        "text-[#1ea70c]",
      ];

      return hexColorsStyles[
        Math.floor(Math.random() * hexColorsStyles.length)
      ];
    });
    self.handleImageChange = function () {
      if (self.image() === "") return;
      const len = self.postimages().length;
      self.index((self.index() + 1) % len);
      self.image(self.postimages()[self.index()]);
    };

    self.handleUpvote = async function () {
      try {
        const res = await PostService.upvotePost(self.post.id);
        self.upvoted(!self.upvoted());
        const count = self.postFeedback().upvotesCount;
        let upvotesCount = self.upvoted() ? count + 1 : count - 1;
        self.postFeedback({
          upvotesCount,
          commentsCount: self.postFeedback().commentsCount,
          commentsList: self.postFeedback().commentsList,
        });
      } catch (e) {
        console.log(e);
      }
    };

    self.handleSave = async function () {
      if (!self.post.id) return;
      try {
        const res = await PostService.savePostForUser(self.post.id);
        self.saved(!self.saved());
      } catch (e) {
        console.log(e);
      }
    };

    self.handleCommentVisibility = function () {
      self.commentVisible(!self.commentVisible());
    };

    self.modalOpen = function () {
      document.getElementById("modalDialog1" + " " + self.post.id).open();
    };

    self.closeModal = function () {
      document.getElementById("modalDialog1" + " " + self.post.id).close();
    };

    self.submitComment = async function () {
      if (self.commentVal().length == 0) return;
      self.commentButtonDisable(true);
      try {
        const res = await PostService.addComment(
          self.post.id,
          self.commentVal()
        );
        const feedback = self.postFeedback();
        const newFeedback = {
          ...feedback,
          commentsCount: self.postFeedback().commentsCount + 1,
          commentsList: [
            ...feedback.commentsList,
            {
              userName:
                UserContext.user().firstName +
                " " +
                UserContext.user().lastName,
              userProfileImage: UserContext.user().profileImage.substring(23),
              message: self.commentVal(),
            },
          ],
        };
        self.postFeedback(newFeedback);
        self.commentVal("");
        self.commentButtonDisable(false);
        self.closeModal();
      } catch (e) {
        console.log(e);
      }
    };
  }
  return PostViewModel;
});
