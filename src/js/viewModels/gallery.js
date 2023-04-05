define([
  "knockout",
  "../services/postService",
  "ojs/ojarraydataprovider",
  "ojs/ojmasonrylayout",
  "ojs/ojknockout",
], function (ko, PostService, ArrayDataProvider) {
  function GalleryViewModel() {
    var self = this;
    self.imageList = ko.observableArray([]);
    self.imageDataProvider = new ArrayDataProvider(self.imageList, {
      keyAttributes: "id",
    });

    self.classList = [
      "oj-masonrylayout-tile-2x1",
      "oj-masonrylayout-tile-1x1",
      "oj-masonrylayout-tile-1x2",
      "oj-masonrylayout-tile-2x2",
    ];
    self.getImages = async function () {
      try {
        const res = await PostService.fetchImages();
        self.imageList(
          res.data.map((img) => ({
            image: "data:image/jpeg;base64," + img.base64Image,
            id: img.id,
            styleClass:
              self.classList[Math.floor(Math.random() * self.classList.length)],
          }))
        );
      } catch (e) {
        console.log(e);
      }
    };
    self.getImages();
  }
  return GalleryViewModel;
});
