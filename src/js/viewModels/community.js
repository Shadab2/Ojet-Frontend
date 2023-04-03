define([
  "knockout",
  "webstomp",
  "sockjs",
  "../services/postService",
  "ojs/ojarraydataprovider",
  "ojs/ojinputtext",
  "ojs/ojknockout",
], function (ko, stomp, SockJs) {
  function CommunityViewModel() {
    var self = this;
    var stompClient = null;

    self.sendMsgValue = ko.observable("");

    self.connect = function () {
      let socket = new SockJs("http://localhost:8080/ws");
      stompClient = stomp.over(socket);

      stompClient.connect({}, function (frame) {
        console.log("connected " + frame);
        stompClient.subscribe(
          "http://localhost:8080/topic/chat",
          function (response) {
            console.log(response);
          }
        );
      });
    };

    self.sendMessage = function () {
      stompClient.send(
        "http://localhost:8080/app/message",
        JSON.stringify(self.sendMsgValue()),
        {}
      );
      self.sendMsgValue("");
    };
    self.connect();
  }
  return CommunityViewModel;
});
