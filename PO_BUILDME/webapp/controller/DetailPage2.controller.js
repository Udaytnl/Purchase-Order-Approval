// Updating file again for Branch 1.
var tab1;
var oModel;
var arr7 = [];
var arr8 = [],
	t1;
var oModel_json;
var ponum1,Ccode1,Porg1,Vno1,Pgrp1,DocDate1,sPath,oCont,sText;
sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/odata/ODataModel",
	"sap/m/Button",
		"sap/m/Dialog",
		"sap/m/Label",
		"sap/m/MessageToast",
		"sap/m/TextArea"
], function (BaseController, MessageBox, Utilities, History, ODataModel, Button,Dialog,Label,MessageToast,TextArea) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.poMd.controller.DetailPage2", {
		handleRouteMatched: function (oEvent) {

			var oArgs;
			oArgs = oEvent.getParameter("arguments");
			//	alert(oArgs);
			ponum1 = oArgs["Ponum"];
			Ccode1 = oArgs["Code"];
			Porg1 = oArgs["Porg"];
			Vno1 = oArgs["Vno"];
			Pgrp1 = oArgs["Pgrp"];
			DocDate1 = oArgs["DocDate"];

			this.getView().byId("link1").setText("PO Number - " + ponum1);
			this.getView().byId("ccode").setText(Ccode1);
			this.getView().byId("porg").setText(Porg1);
			this.getView().byId("pgrp").setText(Pgrp1);
			this.getView().byId("vno").setText(Vno1);
				var oModel1 = new ODataModel("/sap/opu/odata/sap/ZHCP_PO_APPROVAL_SRV/", true);
				var sPath1 = "/POListSet(ApproverID='',Ponumber='" + ponum1 + "')";
				oModel1.read(sPath1, {
					success: function (oData, oResponse) {
						console.log("odata123", oData);
						var mydate = new Date(oData.Docdate);
						var formathours = ("0" + mydate.getHours()).slice(-2);
						var formatmin = ("0" + mydate.getMinutes()).slice(-2);
						var formatsec = ("0" + mydate.getSeconds()).slice(-2);
						var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][mydate.getMonth()];
						var Docdate = month + ' ' + mydate.getDate() + ', ' + mydate.getFullYear() + ' - ' + formathours + ':' + formatmin + ':' +
							formatsec;
						oCont.getView().byId("doctdt").setText(Docdate);
					}
				});

			//alert("google")
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oModel = new ODataModel('/sap/opu/odata/sap/ZHCP_PO_APPROVAL_SRV/', true);
			 sPath = "/POItemSet?$filter=Ponumber eq '" + ponum1 + "'";
			 oCont = this;
			oModel.read(sPath, {
				success: function (oData, oResponse) {
					//	console.log("oData", oData);
				//	oCont.getView().byId("doctdt").setText(oData.Docdate);
					var oDatalength = oData.results.length;
					console.log("oDatalength :", oDatalength);
					oCont.getView().byId("count").setText("ITEMS (" + oDatalength+ ")");
					for (var i = 0; i < oDatalength; i++) {
						var Poitemnumber = oData.results[i].Poitemnumber;
						var Materialnumber = oData.results[i].Materialnumber;
						var Materialgroupdesc = oData.results[i].Materialgroupdesc;
						var Vendorname = oData.results[i].Vendorname;
						var Poquantity = oData.results[i].Poquantity;
						var Netprice = oData.results[i].Netprice;
						var Currency = oData.results[i].Currency;
						var Materialgroup = oData.results[i].Materialgroup;
						var Sloc = oData.results[i].Sloc;
						var PRItem = oData.results[i].PRItem;
						var obj2 = {
							Poitemnumber: Poitemnumber,
							Materialnumber:Materialnumber,
							Materialgroupdesc: Materialgroupdesc,
							Poquantity: Poquantity,
							Netprice: Netprice,
							Currency: Currency,
							Materialgroup: Materialgroup,
							Sloc: Sloc,
							PRItem: PRItem,
							Vendorname:Vendorname
						};
						arr7.push(obj2);
					}
					arr8 = {
						"arr8": arr7
					};

					oModel_json = new sap.ui.model.json.JSONModel(arr8);
					t1 = oCont.getView().byId("itemTable");
					t1.setModel(oModel_json);
					var titems1 = new sap.m.ColumnListItem({
						type: sap.m.ListType.Navigation,
						cells: [
							new sap.m.Text({
								text: "{Poitemnumber}"
							}),
							new sap.m.Text({
								text: "{Materialnumber}"
							}),
							new sap.m.Text({
								text: "{Materialgroupdesc}"
							}),
							new sap.m.Text({
								text: "{Poquantity}"
							}),
							new sap.m.Text({
								text: "{Netprice}"
							}),
								new sap.m.Text({
								text: "{Currency}"
							}),
								new sap.m.Text({
								text: "{Materialgroup}"
							}),
								new sap.m.Text({
								text: "{Sloc}"
							}),
								new sap.m.Text({
								text: "{PRItem}"
							})
						]
					});
					t1.bindItems("/arr8", titems1);
					//arr7.length = 0;
					arr7=[];
				}
			});
			var oParams = {};
			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		
		NewApprove: function()
		{
		alert("function is called");	
		},
		
		onSubmitDialog: function () {
			//	var oCont = this;
				var dialog = new Dialog({
					title: 'Confirm',
					type: 'Message',
					content: [
						new Label({
							text: 'Are you sure you want to approve the purchase order?',
							labelFor: 'submitDialogTextarea'
						}),
						new TextArea('submitDialogTextarea', {

							liveChange: function (oEvent) {
								 sText = oEvent.getParameter('value');
								var parent = oEvent.getSource().getParent();

								parent.getBeginButton().setEnabled(sText.length > 0);
							},
							width: '100%',
							placeholder: 'Add note'
						})
					],
					beginButton: new Button({
						text: 'Submit',
						enabled: false,
						press: function () {
							sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
							// MessageToast.show('PO Number: ' + ponum1  +  sText);

							oCont.approve();
							dialog.close();
						}
					}),
					endButton: new Button({
						text: 'Cancel',
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});

				dialog.open();
			},
			
			approve: function () {

				var that = this;
				var pno123 = ponum1;
				var oModel3 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHCP_PO_APPROVAL_SRV/", true);
				var postdata = {
					PoNumber: pno123,
					PoRelCode: "10",
					NoCommitWork: "",
					Reject: "",
					TextHead: sText,
					UserName: "",
					RelStatusNew: "X",
					RelIndicatorNew: "B",
					RetCode: "0",
					Type: "",
					Message: ""
					// Subrc:'0'
				};
		
				oModel3.create("/POApprovalSet", postdata, {
					success: function (oData, oResponse) {
						var msg1 = oData.Message;
						var msg2 = "Po Rejected"
						var typ = oData.Type;
						if (typ == "S") {

							sap.m.MessageBox.confirm(msg1 + " " + ponum1, {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "Success",
								actions: [sap.m.MessageBox.Action.OK],

								onClose: function (oAction) {
									if (oAction === "OK") {
								//	window.Location.reload(true);
								window.location.reload();
									}
								}.bind(this)

							});
						} else {

							sap.m.MessageBox.confirm(msg2 + " " + ponum1, {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error",
								actions: [sap.m.MessageBox.Action.OK],

								onClose: function (oAction) {
									if (oAction === "OK") {
									//	window.Location.reload(true);
										window.location.reload();
									}
								}.bind(this)

							});
						}

					}

				});
			},
			
			Reject:function(){
				var that = this;
				var pno1234 = ponum1;
				sap.m.MessageBox.information("Do you want to reject the purchase order?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirmation message",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],

					onClose: function (oAction) {
						if (oAction == "YES") {

							var oModel3 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHCP_PO_APPROVAL_SRV/", true);
							var postdata = {
								PoNumber: pno1234,
								PoRelCode: "10",
								NoCommitWork: "",
								Reject: "",
								TextHead: "",
								UserName: "",
								RelStatusNew: "",
								RelIndicatorNew: "",
								RetCode: "",
								Message: ""
							};
							console.log(postdata);
							var SPath = "/POApprovalSet";

							oModel3.create("/POApprovalSet", postdata, {

								success: function (oData, oResponse) {
									var msg2 = "PO Rejected"
									var rej = oData.Reject;

									if (rej == "X") {

										sap.m.MessageBox.confirm(msg2 + " " + ponum1, {
											icon: sap.m.MessageBox.Icon.WARNING,
											title: "Error",
											actions: [sap.m.MessageBox.Action.OK],

											onClose: function (oAction) {
												if (oAction === "OK") {
													that.closefun();
													window.Location.reload();
												}
											}.bind(this)

										});

									} else {
										sap.m.MessageBox.confirm(msg2 + " " + ponum1, {
											icon: sap.m.MessageBox.Icon.Warning,
											title: "Warning",
											actions: [sap.m.MessageBox.Action.OK],

											onClose: function (oAction) {
												if (oAction === "OK") {
													that.closefun();
													window.Location.reload();
												}
											}.bind(this)

										});
									}

								}

							});

						}
					}
				});

			},
		
		Search: function (oEvent) {
			/*var SamTbl = oEvent.getParameter("listItem");*/
			var SamTbl = oEvent.getSource().getValue();
			var filters = [];
			var oFilter = new sap.ui.model.Filter("Poitemnumber", sap.ui.model.FilterOperator.Contains, SamTbl);
			filters.push(oFilter);
			this.byId("itemTable").getBinding("items").filter(filters);

		},
		
		onPress: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("listItem");
			
			var ItemNumber = oSelectedItem.getBindingContext().getProperty("Poitemnumber");
			oModel.read(sPath, {
				success: function (oData, oResponse) {
					//console.log("oData", oData);
					var oDatalength = oData.results.length;
						for (var i = 0; i < oDatalength; i++)
						{
							if(oData.results[i].Poitemnumber == ItemNumber)
				{
					oCont.getView().byId("Mtno").setText(oData.results[i].Materialnumber);
					oCont.getView().byId("Mt").setText(oData.results[i].Materialgroupdesc);
					oCont.getView().byId("Mtgr").setText(oData.results[i].Materialgroup);
					oCont.getView().byId("Vrno").setText(oData.results[i].Vendor);
					oCont.getView().byId("Ic").setText(oData.results[i].ItemCategory);
					oCont.getView().byId("Pq").setText(oData.results[i].Poquantity);
					oCont.getView().byId("Ddate").setText(oData.results[i].Delvrydate);
				}
				
				else{
					
				}
						}
				}
			});
					
			
		/*	var MaterialNumber = oSelectedItem.getBindingContext().getProperty("Materialnumber");
			this.getView().byId("Mtno").setText(ItemNumber);
			var MaterialNumber = oSelectedItem.getBindingContext().getProperty("Materialnumber");
			this.getView().byId("Mtno").setText(MaterialNumber);
			var MaterialName = oSelectedItem.getBindingContext().getProperty("Materialgroupdesc");
			this.getView().byId("Mt").setText(MaterialName);
			var Materialgroup = oSelectedItem.getBindingContext().getProperty("Materialgroup");
			this.getView().byId("Mtgr").setText(Materialgroup);*/
		//	alert(matgr);
			//var Materialnum = tab.getRows()[oIndex].getCells()[1].getText();
			},
		
	/*	var oCont = this;
var oIndex = oEvent.mParameters.rowIndex;
var tab = this.getView().byId("table1");
var rowLen14 = tab.getSelectedIndices();
var Materialnum = tab.getRows()[oIndex].getCells()[1].getText();
// oCont.getView().byId("matname").setText();
var Materialdes = tab.getRows()[oIndex].getCells()[2].getText();
oCont.getView().byId("matname").setText(Materialnum + " / " + Materialdes);
oCont.getView().byId("vendmat").setText(Materialnum + " / " + Materialdes);
var Materialnam11 = tab.getRows()[oIndex].getCells()[2].getText();
var POqty = tab.getRows()[oIndex].getCells()[3].getText();
var Uom = tab.getRows()[oIndex].getCells()[4].getText();
oCont.getView().byId("poqty").setText(POqty + " " + Uom);
		*/


onSort: function (oEvent) {
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("Poitemnumber",this.bDescending));
			this.byId("itemTable").getBinding("items").sort(aSorters);
			this.bDescending = !this.bDescending;
			
		},
		
			/*fnApplyFiltersAndOrdering: function (oEvent){
			var aFilters = [],
				aSorters = [];

			if (this.bGrouped) {
				aSorters.push(new Sorter("SupplierName", this.bDescending, this._fnGroup));
			} else {
				aSorters.push(new Sorter("Name", this.bDescending));
			}

			if (this.sSearchQuery) {
				var oFilter = new Filter("Name", sap.ui.model.FilterOperator.Contains, this.sSearchQuery);
				aFilters.push(oFilter);
			}

			this.byId("idProductsTable").getBinding("items").filter(aFilters).sort(aSorters);
		},*/
	_onButtonPress: function(oEvent) {
				tab1.open();
			//	tab1.setFilterSearchCallback(this.caseSensitiveStringContains).open();

		},
		
			ok: function(oEvent) {
				tab1.close();

		},
		
			cancel: function(oEvent) {
				tab1.close();

		},

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//	this.oRouter.getTarget("DetailPage2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			this.oRouter.attachRouteMatched(this.handleRouteMatched, this);
			var oView = this.getView();
			
			tab1 = sap.ui.xmlfragment("firstfrag", "com.sap.build.standard.poMd.fragments.Dialog1", this);
			this.getView().addDependent(tab1);

			oView.addEventDelegate({
				onBeforeShow: function () {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function () {
								this.oRouter.navTo("", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

		}
	});
}, /* bExport= */ true);