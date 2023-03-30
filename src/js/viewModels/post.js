define([
  "knockout",
  "timeago",
  "../services/postService",
  "ojs/ojknockout",
  "ojs/ojaccordion",
  "ojs/ojdialog",
  "ojs/ojinputtext",
], function (ko, timeago, PostService) {
  function PostViewModel(params) {
    var self = this;
    self.user = params.user;
    self.post = params.post;
    self.username = self.user.firstName + " " + self.user.lastName;
    self.postimages = ko.observableArray(self.post.images);
    self.resourceLinks = ko.observableArray(self.post.resourceLinks);
    self.index = ko.observable(0);
    self.commentVal = ko.observable("");
    self.commentButtonDisable = ko.observable(false);
    self.commentVisible = ko.observable(false);
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

    const hexColors = ["#d30a43", "#8f098f", "#F80102", "#1ea70c"];

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

    self.handleCommentVisibility = function () {
      self.commentVisible(!self.commentVisible());
    };

    self.modalOpen = function () {
      document.getElementById("modalDialog1").open();
    };

    self.closeModal = function () {
      document.getElementById("modalDialog1").close();
    };

    self.submitComment = async function () {
      if (self.commentVal().length == 0) return;
      self.commentButtonDisable(true);
      try {
        const res = await PostService.addComment(
          self.post.id,
          self.commentVal()
        );
        self.commentVal("");
        self.commentButtonDisable(false);
        self.closeModal();
      } catch (e) {}
    };
  }
  return PostViewModel;
});
