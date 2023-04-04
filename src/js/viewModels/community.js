define([
  "knockout",
  "sockjs",
  "../context/UserContext",
  "timeago",
  "ojs/ojarraydataprovider",
  "stompjs",
  "ojs/ojinputtext",
  "ojs/ojavatar",
  "ojs/ojknockout",
], function (ko, SockJs, UserContext, timeago) {
  function CommunityViewModel() {
    var self = this;
    var stompClient = null;
    self.senderEmail = UserContext.user().email;
    self.sendMsgValue = ko.observable("");
    self.messageList = ko.observableArray([]);

    self.connect = function () {
      let socket = new SockJs("http://localhost:8080/ws");
      stompClient = Stomp.over(socket);
      stompClient.debug = function () {};

      stompClient.connect({}, function (frame) {
        console.log("connected " + frame);
        stompClient.subscribe("/global/chat", function (message) {
          const msg = JSON.parse(message.body);
          const savedMsg = {
            content: msg.message,
            senderName: msg.userPublicDto.firstName,
            senderEmail: msg.senderEmail,
            profileImage: msg.userPublicDto.profileImage
              ? `data:image/png;base64,${msg.userPublicDto.profileImage}`
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA7J_nWmuLQLoOtHyvwRXfkrkVvW621Bx9nQ&usqp=CAU",
            timeStamp: "just now",
            dateModified: msg.dateModified,
          };
          self.messageList.push(savedMsg);
          var chatHistory = document.getElementById("messageBody");
          chatHistory.scrollTop = chatHistory.scrollHeight;
        });
      });
    };

    self.sendMessage = function () {
      const msg = {
        senderEmail: self.senderEmail,
        message: self.sendMsgValue(),
      };
      stompClient.send("/app/message", {}, JSON.stringify(msg));
      self.sendMsgValue("");
    };
    self.connect();

    setInterval(() => {
      const msgList = self.messageList();
      self.messageList(
        msgList.map((msg) => ({
          ...msg,
          timeStamp: timeago.format(msg.dateModified),
        }))
      );
    }, 3000);
  }
  return CommunityViewModel;
});
