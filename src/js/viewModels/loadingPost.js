define([], function () {
  function LoadingPostViewModel() {
    setTimeout(() => {
      const loadingContainer = document.getElementById("loading-container");
      const skeleton = document.getElementById("skeleton-container");
      for (let i = 0; i < 3; i++) {
        loadingContainer.append(skeleton.content.cloneNode(true));
      }
    }, 100);
  }
  return LoadingPostViewModel;
});
