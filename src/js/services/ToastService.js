define([], function () {
  class ToastService {
    constructor() {
      this.timeOut = 2000;
    }
    error(message, messageDesc) {
      return {
        severity: "error",
        summary: message,
        detail: messageDesc,
        timestamp: new Date().toISOString(),
        autoTimeout: this.timeOut,
      };
    }
    success(message, messageDesc) {
      return {
        severity: "confirmation",
        summary: message,
        detail: messageDesc,
        timestamp: new Date().toISOString(),
        autoTimeout: this.timeOut,
      };
    }
    warning(message, messageDesc) {
      return {
        severity: "info",
        summary: message,
        detail: messageDesc,
        timestamp: new Date().toISOString(),
        autoTimeout: this.timeOut,
      };
    }
    toast(message, messageDesc) {
      return {
        summary: message,
        detail: messageDesc,
        timestamp: new Date().toISOString(),
        autoTimeout: this.timeOut,
      };
    }
  }
  return new ToastService();
});
