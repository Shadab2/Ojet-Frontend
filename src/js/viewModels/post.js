define(["knockout", "timeago", "ojs/ojknockout", "ojs/ojaccordion"], function (
  ko,
  timeago
) {
  function PostViewModel(params) {
    var self = this;
    self.user = params.user;
    self.post = params.post;
    self.username = self.user.firstName + " " + self.user.lastName;
    self.postimages = ko.observableArray(self.post.images);
    self.resourceLinks = ko.observableArray(self.post.resourceLinks);
    self.index = ko.observable(0);
    self.image = ko.observable(
      self.postimages().length > 0 ? self.postimages()[0] : ""
    );
    self.date = ko.observable(timeago.format(self.post.dateModified));
    self.postFeedback = ko.observable(
      self.post.postFeedBack
        ? self.post.postFeedBack
        : {
            upvotesCount: 0,
            commentsCount: 0,
          }
    );

    const hexColors = ["#d30a43", "#8f098f", "#F80102", "#1ea70c"];

    self.handleImageChange = function () {
      if (self.image() === "") return;
      const len = self.postimages().length;
      self.index((self.index() + 1) % len);
      self.image(self.postimages()[self.index()]);
    };
  }
  return PostViewModel;
});
