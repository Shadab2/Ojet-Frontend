define([
  "knockout",
  "jquery",
  "sockjs",
  "../context/UserContext",
  "../services/PostService",
  "timeago",
  "ojs/ojarraydataprovider",
  "stompjs",
  "ojs/ojinputtext",
  "ojs/ojavatar",
  "ojs/ojknockout",
], function (ko, $, SockJs, UserContext, PostService, timeago) {
  function CommunityViewModel(params) {
    var self = this;
    var stompClient = null;
    self.senderEmail = UserContext.user().email;
    self.sendMsgValue = ko.observable("");
    self.messageList = ko.observableArray([]);
    self.offset = ko.observable(0);
    self.loading = ko.observable(false);
    self.notificationList = params.notificationList;

    self.getPreviousMessage = function () {
      self.loading(true);
      PostService.fetchPreviousMsg(self.offset(), (error, data) => {
        if (error) {
          console.log(error);
          self.loading(false);
          return;
        }
        if (data && data.empty) {
          self.loading(false);
          return;
        }
        const savedMessageList = data.content
          .map((msg) => self.parseMessage(msg))
          .reverse();
        self.messageList([...savedMessageList, ...self.messageList()]);
        self.offset(self.offset() + 1);
        self.loading(false);
      });
    };

    self.getPreviousMessage();

    self.parseMessage = function (msg) {
      return {
        content: msg.message,
        senderName: msg.senderName,
        senderEmail: msg.senderEmail,
        profileImage: msg.senderProfileImage
          ? `data:image/png;base64,${msg.senderProfileImage}`
          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA7J_nWmuLQLoOtHyvwRXfkrkVvW621Bx9nQ&usqp=CAU",
        timeStamp: timeago.format(msg.dateModified),
        dateModified: msg.dateModified,
      };
    };

    self.connect = function () {
      let socket = new SockJs("http://localhost:8080/ws");
      stompClient = Stomp.over(socket);
      stompClient.debug = function () {};

      stompClient.connect({}, function (frame) {
        console.log("connected " + frame);
        stompClient.subscribe("/global/chat", function (message) {
          const msg = JSON.parse(message.body);
          self.messageList.push(self.parseMessage(msg));
          var chatHistory = document.getElementById("messageBody");
          element = chatHistory;
          chatHistory.scrollTop = chatHistory.scrollHeight;
        });
        stompClient.subscribe(
          "/global/notification/" + self.senderEmail,
          function (notification) {
            const data = JSON.parse(notification.body);
            self.notificationList([...self.notificationList(), data]);
          }
        );
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
