var ponum, code, porg, vno, pgrp, doctDate;
var arr4 = [];
var Running = true;
sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/odata/ODataModel",
], function (BaseController, MessageBox, Utilities, History,ODataModel) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.poMd.controller.MasterPage1", {
		handleRouteMatched: function (oEvent) {
			
			this.Bindlist();
		},
		
			Bindlist: function () {
			var list = this.byId("list1");
			var oModel = new ODataModel('/sap/opu/odata/sap/ZHCP_PO_APPROVAL_SRV/');
			//var tFilters1 = [new sap.ui.model.Filter("ApproverID", sap.ui.model.FilterOperator.EQ, nameFinal2)];
			var sPath = "/POListSet";
			oModel.read(sPath, {
				//	filters: tFilters1,
				success: function (oData, oResponse) {
					var count = oData.results.length;
					// debugger;
					console.log("Count :", count);
					for (var i = 0; i < count; i++) {
						var Ponumber = oData.results[i].Ponumber;
						var data = oData.results[i].Docdate;
						var totalvalue = oData.results[i].Totalvalue;
						var currencyy = oData.results[i].Currency;
						var vd = oData.results[i].VendorDesc;
						var Organize = oData.results[i].Purchaseorg;
						var purorgtext = oData.results[i].PurOrgText;
						var orderqan = oData.results[i].Orderedqty;
						var Odp = oData.results[i].Orderedqty;
						var delq = oData.results[i].Deliveredqty;
						var reles = oData.results[i].ReleaseCode;
						var comcode = oData.results[i].Ccode;
						var ccodedesc = oData.results[i].CompDesc;
						var vendor = oData.results[i].VendorAccNumber;
						var vendes = oData.results[i].VendorDesc;
						console.log("Ponumber :", Ponumber);
						var obj1 = {
							npnumber: Ponumber,
							ndata1: data,
							ntotalvalue1: totalvalue,
							ncurrencyy1: currencyy,
							nvd1: vd,
							nOrganize1: Organize,
							nOrderqan: orderqan,
							nOdp1: Odp,
							ndelq1: delq,
							nreles1: reles,
							nComcode: comcode,
							nVendor: vendor,
							nVendes: vendes,
							nccdes1: ccodedesc,
							npodes1: purorgtext

						};
						arr4.push(obj1);
						//	arr5 = {
						//		"arr5": arr4
						//	};
					}

					var oModelccd = new sap.ui.model.json.JSONModel(); // created a JSON model        
					oModelccd.setData({ // Set the data to the model using the JSON object defined already  
						listdata: arr4

					});
					list.setModel(oModelccd);

				},
				error: function (oData, oResponse) {

				}
			});
			Running = false;

		},

		handleSOSearch: function (oEvent) {
			
			var SamTbl = oEvent.getParameter("newValue");
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("npnumber", sap.ui.model.FilterOperator.Contains, SamTbl),
				//	new sap.ui.model.Filter("Totalvalue", sap.ui.model.FilterOperator.Contains, SamTbl),
				//	new sap.ui.model.Filter("VendorAccNumber", sap.ui.model.FilterOperator.Contains, SamTbl),
				//	new sap.ui.model.Filter("Ccode", sap.ui.model.FilterOperator.Contains, SamTbl),
				//	new sap.ui.model.Filter("Orderedqty", sap.ui.model.FilterOperator.Contains, SamTbl)
				],
				false);
			filters = (oFilter);
			var listItem = this.getView().byId("list1");
			var binding = listItem.getBinding("items");
			binding.filter(filters);
			
			/*var SamTbl = oEvent.getParameter("listItem");*/
		/*	var SamTbl = oEvent.getSource().getValue();
			var filters = [];
			var oFilter = new sap.ui.model.Filter("Ponumber", sap.ui.model.FilterOperator.Contains, SamTbl);
			filters.push(oFilter);*/
		//	filters = (oFilter);
		/*	var listItem = this.getView().byId("list1");
			var binding = listItem.getBinding("items");
			binding.filter(filters);*/
			
			
			
		//	this.byId("list1").getBinding("items").filter(filters);
			//alert(this.byId("list1"));
			//alert(this.byId("list1").getBinding("items"));
			//alert(this.byId("list1").getBinding("items").filter(filters));

		},

		_onObjectListItemPress: function (oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
			ponum = oEvent.getParameter("listItem").getBindingContext().getProperty("npnumber");
			code = oEvent.getParameter("listItem").getBindingContext().getProperty("nComcode");
			porg = oEvent.getParameter("listItem").getBindingContext().getProperty("npodes1");
			vno = oEvent.getParameter("listItem").getBindingContext().getProperty("nVendor");
			pgrp = oEvent.getParameter("listItem").getBindingContext().getProperty("nVendes");
		//	doctDate = JSON.stringify(oEvent.getParameter("listItem").getBindingContext().getProperty("data"));

			this.oRouter.navTo("DetailPage2", {
				//layout:"TwoColumnsMidExpanded",
				Ponum: ponum,
				Code: code,
				Porg: porg,
				Vno: vno,
				Pgrp: pgrp
			//	DocDate: doctDate
					//	alert(ponum);
			});
		},

		_attachSelectListItemWithContextPath: function (sContextPath) {
			var oView = this.getView();
			var oContent = this.getView().getContent();
			if (oContent) {
				if (!sap.ui.Device.system.phone) {
					var oList = oContent[0].getContent() ? oContent[0].getContent()[0] : undefined;
					if (oList && sContextPath) {
						var sContentName = oList.getMetadata().getName();
						var oItemToSelect, oItem, oContext, aItems, i;
						if (sContentName.indexOf("List") > -1) {
							if (oList.getItems().length) {
								oItemToSelect = null;
								aItems = oList.getItems();
								for (i = 0; i < aItems.length; i++) {
									oItem = aItems[i];
									oContext = oItem.getBindingContext();
									if (oContext && oContext.getPath() === sContextPath) {
										oItemToSelect = oItem;
									}
								}
								if (oItemToSelect) {
									oList.setSelectedItem(oItemToSelect);
								}
							} else {
								oView.addEventDelegate({
									onBeforeShow: function () {
										oList.attachEventOnce("updateFinished", function () {
											oItemToSelect = null;
											aItems = oList.getItems();
											for (i = 0; i < aItems.length; i++) {
												oItem = aItems[i];
												oContext = oItem.getBindingContext();
												if (oContext && oContext.getPath() === sContextPath) {
													oItemToSelect = oItem;
												}
											}
											if (oItemToSelect) {
												oList.setSelectedItem(oItemToSelect);
											}
										});
									}
								});
							}
						}

					}
				}
			}

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("MasterPage1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		}
	});
}, /* bExport= */ true);