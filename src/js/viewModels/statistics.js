define([
  "knockout",
  "../context/userContext",
  "../services/userService",
  "ojs/ojarraydataprovider",
  "ojs/ojknockout",
  "ojs/ojavatar",
  "ojs/ojtable",
  "ojs/ojchart",
  "ojs/ojswitch",
], function (ko, UserContext, UserService, ArrayDataProvider) {
  function StasticsViewModel(params) {
    var self = this;
    self.salesRawData = ko.observable("");
    self.salesData = ko.observableArray([]);
    self.threeDValue = ko.observable("off");
    self.isChecked = ko.observable(false);

    const getSalesData = async function () {
      try {
        const res = await UserService.fetchSalesData();
        self.salesRawData(res.data);
        self.salesData(
          res.data.products.map((product) => ({
            id: product.id,
            group: "product",
            series: product.name,
            value: product.total_revenue,
            total_sales: product.total_sales,
          }))
        );
      } catch (e) {}
    };
    getSalesData();

    self.dataProvider = new ArrayDataProvider(self.salesData, {
      keyAttributes: "id",
    });
  }
  return StasticsViewModel;
});
