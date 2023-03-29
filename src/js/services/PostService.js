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

      formData.append("resourcePost", blob);
      return axios({
        method: "post",
        url: this.baseUrl,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
    }

    fetchAllPublicPosts() {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl + "/all", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }
  }
  return new PostService();
});
