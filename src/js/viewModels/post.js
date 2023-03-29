define(["knockout", "ojs/ojknockout", "ojs/ojaccordion"], function (ko) {
  function PostViewModel(params) {
    var self = this;
    self.user = params.user;
    self.post = params.post();
    self.username = user().firstName + " " + user().lastName;
    self.postimages = ko.observableArray(self.post.images);
    self.resourceLinks = ko.observableArray(self.post.resourceLinks);
    self.index = ko.observable(0);
    self.image = ko.observable(
      self.postimages().length > 0 ? self.postimages()[0] : ""
    );

    self.handleImageChange = function () {
      if (self.image() === "") return;
      const len = self.postimages().length;
      self.index((self.index() + 1) % len);
      self.image(self.postimages()[self.index()]);
    };
  }
  return PostViewModel;
});
