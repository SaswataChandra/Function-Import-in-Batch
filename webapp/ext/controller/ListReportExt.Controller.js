sap.ui.controller("com.deere.digisignature.ext.controller.ListReportExt", {

	onClickActionDigitalSignApprove: function (oEvent) {
		var oMessageToast = sap.m.MessageToast;
		var oModelDigiSign = this.getView().getModel();
		var aSelectedItems = oEvent.getSource().getParent().getParent().getSelectedItems();
		this.oApproveButtonEvent = oEvent.getSource();
		//getSelectedItems()[0].getBindingContext().getObject().InvoiceNum

		this.aResponse = [];
		oModelDigiSign.setUseBatch(true);
		oModelDigiSign.attachBatchRequestCompleted(function (oBatchCompleted) {

			// request completed
			// check oEvent.getParameters("success") ...
			// ... whether the request was successful and the data was loaded
			// 			var aMessages = [];
			/*for (var i = 0; i < oBatchCompleted.getParameter("requests").length; i++) {
				var jsonParsed = JSON.parse(oBatchCompleted.getParameter("requests")[i].response.responseText);
				aMessages.push(jsonParsed.error.message.value);
			}
			this.refresh();*/
			//oMessageToast.show("Batch Request Completed");

		});

		oModelDigiSign.setDeferredGroups(["Changes"]);
		var mParameters = {
			groupId: "Changes",
			success: function (oData, response) {
				oMessageToast.show("Submit Batch Success");

				var oJSONModel = new sap.ui.model.json.JSONModel();
				var that = this;
				var oMessageTemplate = new sap.m.MessageItem({
					type: '{type}',
					title: '{title}'
						//description: '{description}'
				});

				var aMockMessages = [];
				for (var i = 0; i < oData.__batchResponses.length; i++) {
					var jsonParsed = JSON.parse(oData.__batchResponses[i].response.body);
					var oMsg = {};
					oMsg.type = 'Error';
					oMsg.title = jsonParsed.error.message.value;
					aMockMessages.push(oMsg);
				}

				/*	var aMockMessages = [{
					type: 'Error',
					title: 'Error message'
				}, {
					type: 'Warning',
					title: 'Warning without description'
				}, {
					type: 'Information',
					title: 'Information without description'
				}, {
					type: 'Success',
					title: 'Warning without description'
				}];
*/
				oJSONModel.setData(aMockMessages);

				this.oMessageView = new sap.m.MessageView({
					showDetailsPageHeader: false,
					itemSelect: function () {
						oBackButton.setVisible(true);
					},
					items: {
						path: "/",
						template: oMessageTemplate
					}
				});

				var oBackButton = new sap.m.Button({
					icon: sap.ui.core.IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						that.oMessageView.navigateBack();
						this.setVisible(false);
					}
				});

				this.oMessageView.setModel(oJSONModel);

				this.oDialog = new sap.m.Dialog({
					resizable: true,
					content: this.oMessageView,
					state: 'Error',
					beginButton: new sap.m.Button({
						press: function () {
							this.getParent().close();
						},
						text: "Close"
					}),
					customHeader: new sap.m.Bar({
						contentMiddle: [
							new sap.m.Text({
								text: "Error"
							})
						],
						contentLeft: [oBackButton]
					}),
					contentHeight: "300px",
					contentWidth: "500px",
					verticalScrolling: false
				});

				this.oDialog.open();

			},
			error: function (oError) {
				oMessageToast.show("Submit Batch Error");
			}
		};

		for (var i = 0; i < aSelectedItems.length; i++) {
			var oItem = aSelectedItems[i].getBindingContext().getObject();
			oModelDigiSign.callFunction("/DigitalSignApprove", {
				method: "POST",
				groupId: "Changes",
				changeSetId: i,
				urlParameters: {
					InvoiceNum: oItem.InvoiceNum,
					OutputType: oItem.OutputType
				}
				/*	success: function (oData, response) {
						var jsonModel = new sap.ui.model.json.JSONModel();
						jsonModel.setData(oData);
						oMessageToast.show("Loop Call Success");
					}.bind(this),
					error: function (oError) {
						var oResponse = JSON.parse(oError.responseText);
						oMessageToast.show("Loop Call Error");
					}.bind(this)*/
			});
		}
		//this.oDialog.open();
		//this._oPopover.openBy(oEvent.getSource());
		//Submitting the function import batch call
		oModelDigiSign.submitChanges(mParameters);

	},
	onClickActionDigitalSignReject: function (oEvent) {

	}

});
