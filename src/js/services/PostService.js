define(["../context/userContext", "axios"], function (UserContext, axios) {
  class PostService {
    constructor() {
      this.baseUrl = "http://localhost:8080/api/post";
    }
    savePost(post) {
      const authToken = UserContext.authToken();
      const formData = new FormData();

      const json = JSON.stringify(post);
      const blob = new Blob([json], {
        type: "application/json",
      });

      for (let file of post.files) {
        formData.append("files", file);
      }

      const url = post.files.length > 0 ? this.baseUrl : this.baseUrl + "/add";
      formData.append("resourcePost", blob);
      return axios({
        method: "post",
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
    }
  }
  return new PostService();
});
