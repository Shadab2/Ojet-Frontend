define(["../context/userContext", "axios"], function (UserContext, axios) {
  class PostService {
    constructor() {
      this.baseUrl = "http://localhost:8080/api/post";
    }

    parsePostData(ps, likedPostsIds = [], savedPostIds = []) {
      const likedSet = new Set([...likedPostsIds]);
      const savedSet = new Set([...savedPostIds]);
      return {
        id: ps.id,
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
          upvoted: likedSet.has(ps.id),
          saved: savedSet.has(ps.id),
        },
        user: {
          firstName: ps.user.firstName,
          lastName: ps.user.lastName,
          profileImage: ps.user.profileImage
            ? "data:image/jpeg;base64," + ps.user.profileImage
            : UserContext.avatar,
        },
      };
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

    fetchOwnerPost() {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }

    fetchTrendingPosts() {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl + "/trending", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }
    fetchAllPublicPosts() {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl + "/all", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }

    fetchAllUpvotedPosts() {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl + "/all/upvoted", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }
    upvotePost(postId) {
      const authToken = UserContext.authToken();
      return axios.post(
        this.baseUrl + "/" + postId + "/upvote",
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
    }
    addComment(postId, message) {
      const authToken = UserContext.authToken();
      return axios.post(
        this.baseUrl + "/" + postId + "/comment",
        { message },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
    }

    savePostForUser(postId) {
      const authToken = UserContext.authToken();
      return axios.post(
        this.baseUrl + "/" + postId + "/save",
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
    }

    searchPosts(searchFilter) {
      const authToken = UserContext.authToken();
      return axios.post(this.baseUrl + "/search", searchFilter, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }

    fetchImages() {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl + "/all/images", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }

    fetchUserSavedPost() {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl + "/all/saved", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }

    fetchUserMappings() {
      const authToken = UserContext.authToken();
      return axios.get(this.baseUrl + "/user-mappings", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }
  }
  return new PostService();
});
