/*
 * LICENCE[[ Version: MPL 1.1/GPL 2.0/LGPL 2.1/CeCILL 2.O
 * 
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
 * the specific language governing rights and limitations under the License.
 * 
 * The Original Code is kelis.fr code.
 * 
 * The Initial Developer of the Original Code is thibaut.arribe@kelis.fr
 * 
 * Portions created by the Initial Developer are Copyright (C) 2011 the Initial
 * Developer. All Rights Reserved.
 * 
 * Contributor(s):
 * 
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"), or
 * the CeCILL Licence Version 2.0 (http://www.cecill.info/licences.en.html), in
 * which case the provisions of the GPL, the LGPL or the CeCILL are applicable
 * instead of those above. If you wish to allow use of your version of this file
 * only under the terms of either the GPL or the LGPL, and not to allow others
 * to use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under the
 * terms of any one of the MPL, the GPL, the LGPL or the CeCILL. ]]LICENCE
 */

/**
 * @namespace
 */
var scCommentMgr = {};

/**
 * CommentMgr constructor JS object wich handle comments. A CommentMgr should be
 * linked to an HTML Node behind the label mgr (myDOMHtmlNode.Mgr).
 * 
 * CommentMgr is made with 3 differents compound : (1) Model which handle
 * threads representation send by Scenari server (2) Controller which handle the
 * origin-path sent into the HTML page, theirs links with comment containers and
 * wich offer a control API to send message to Scenari Server (3) View which
 * handle graphical thread data set and drive controls and threads builders
 * 
 * @constructor
 * @param {string}
 *            pId id of the linked Htlm node (required).
 * @param {Array.string}
 *            pXPath list of xpath to exclude of the system by scServer
 *            (optionnal).
 * @param {Array.string}
 *            pNS list of namespace (optionnal).
 */
scCommentMgr.Mgr = function(pId, pXPath, pNS) {

	this.fStore = new scCommentMgr.Utils.LocalStore();

	// ID of the dom object which is linked to the current manager
	this.fContextNodeId = pId;
	// List of xPath to exclude from the comment service
	this.fExcludeXPathList = pXPath;
	// List of namespace linked to the previous xpaths
	this.fExcludeXPathNSList = pNS;

	this.Controller = new scCommentMgr.Controller(this);
	this.View = new scCommentMgr.View(this);
	this.Model = new scCommentMgr.Model(this);

	scServices.scCommentSvc.setScCommentMgr(scCommentMgr);
	
	// Init scOnLoads event
	scOnLoads[scOnLoads.length] = this;
}

// //////////////////////////////////////////////////////
// Getters //
// //////////////////////////////////////////////////////

/**
 * contextId getter
 * 
 * @return {string} id of the linked HTML node
 */
scCommentMgr.Mgr.prototype.contextNode = function() {
	return sc$(this.fContextNodeId);
}

/**
 * Build a String from XPath array to send by HTTP request
 * 
 * @return {String}
 */
scCommentMgr.Mgr.prototype.getXPaths = function() {
	var vXPaths = "";
	if (this.fExcludeXPathList != null) {

		for (var i = 0; i < this.fExcludeXPathList.length; i++) {
			if (i != 0) vXPaths += "\t"+this.fExcludeXPathList[i];
		}
	}
	return vXPaths;
}

/**
 * Build a String from XPathNS array to send by HTTP request
 * 
 * @return {String}
 */
scCommentMgr.Mgr.prototype.getXPathsNS = function() {
	var vXPathsNS = "";
	if (this.fExcludeXPathNSList != null) {
		for (var i = 0; i < this.fExcludeXPathNSList.length; i++) {
			if (i != 0)
				vXPathsNS += "\t" + this.fExcludeXPathNSList[i];
		}
	}
	return vXPathsNS;
}

scCommentMgr.Mgr.prototype.update = function(pSync, pThreads, pPerms,
		pTimeStamp) {
	if (pSync)
		this.Model.updateModel(pThreads);
	else
		this.Model.setModel(pThreads);
	this.Controller.updatePerms(pPerms);
	this.View.removeThreads();
	this.Controller.loadThreads(this.Model.fThreads);
	this.View.buildThreads();
	this.View.computeThreadPosition();
}
// //////////////////////////////////////////////////////
// Internal //
// //////////////////////////////////////////////////////

/**
 * Broadcast onLoad event in all controls and thread builders
 */
scCommentMgr.Mgr.prototype.onLoad = function() {
	scCommentMgr.scCommentWidgets.broadcastEvent("onLoad");
}

/**
 * scCommentMgr.Model constructor. Part of scCommentMgr object. Model JS object
 * handle thread scServer representation, update thread position according to
 * server responses.
 * 
 * @constructor
 * @param {scCommentMgr}
 *            pParent
 */
scCommentMgr.Model = function(pParent) {
	/**
	 * Model of threads
	 * 
	 * {deserialised JSON object sent by scServer}. Use a network package
	 * snippet to understand the structure (or any good js debugger). object
	 * structure exemple : [ {refUri, threads: [ {oriPath (=relative
	 * path),excludedThread (excludeByXPathParam), threadClosed (=Xul checkbox
	 * interface), comments: [ {user, creationTime, content}, ... ] }, ... ] },
	 * ... ]
	 */
	this.fThreads = null;

	this.fParent = pParent;

}
// //////////////////////////////////////////////////////
// Getters //
// //////////////////////////////////////////////////////

/**
 * get a thread relative path (ex : 1/4/2/6) from refuri and thread index
 * 
 * @param {int}
 *            pRefUriNumber
 * @param {int}
 *            pThreadNumber
 * @return {String} oripath
 */
scCommentMgr.Model.prototype.getThreadRelativePath = function(pRefUriNumber, pThreadNumber) {
	//scCoLib.util.log("function : scServices.scCommentSvc.getThreadRelativePath(" + pRefUriNumber + " " + pThreadNumber + ")");
	if (this.fThreads != null) {
		return this.fThreads[pRefUriNumber].threads[pThreadNumber].oriPath;
	}
	return null;
}
/**
 * get a refuri from first array index
 * 
 * @param {int}
 *            pRefUriNumber
 * @return {String} refuri
 */
scCommentMgr.Model.prototype.getThreadRefUri = function(pRefUriNumber) {
	//scCoLib.util.log("function : scServices.scCommentSvc.getThreadRefUri(" + pRefUriNumber + ")");
	if (this.fThreads != null) {
		return this.fThreads[pRefUriNumber].refUri;
	}
	return null;
}

scCommentMgr.Model.prototype.getTimeStampFromRefUri = function(pRefUri) {
	for (var i = 0; i < this.fThreads.length; i++) {
		if (this.fThreads[i].refUri == pRefUri) {
			return this.fThreads[i].syncTimeStamp;
		}
	}
	return null;
}

/**
 * get a first array index from refuri
 * 
 * @param {String}
 *            pRefUri
 * @return {int} index
 */
scCommentMgr.Model.prototype.getIndexFromUri = function(pRefUri) {
	for (var i = 0; i < this.fThreads.length; i++) {
		if (this.fThreads[i].refUri == pRefUri) {
			return i;
		}
	}
	return null;
}
/**
 * get a thread index (second array index) from refuri and relativePath
 * 
 * @param {String}
 *            pRefUri
 * @param {String}
 *            pRelativePath
 * @return {int}
 */
scCommentMgr.Model.prototype.getThreadIndex = function(pRefUri, pRelativePath) {
	var vIndex = this.getIndexFromUri(pRefUri);
	for (var i = 0; i < this.fThreads[vIndex].threads.length; i++) {
		if (this.fThreads[vIndex].threads[i].oriPath == pRelativePath) {
			return i;
		}
	}
	return null;
}

scCommentMgr.Model.prototype.setModel = function(pModel) {
	this.fThreads = this.unescapeModel(pModel);
}

// //////////////////////////////////////////////////////
// Methods //
// //////////////////////////////////////////////////////

/**
 * Update model with a threadChanges object (scServer send a full response only
 * once. Following responses are updates)
 * 
 * @param {Object}
 *            pThreadChanges, (json objec from server).
 * @return {Boolean} true if sync worked. false else
 */
scCommentMgr.Model.prototype.updateModel = function(pThreadChanges) {
	//scCoLib.util.log("function : scCommentMgr.Model.updateModel");
	var vSyncError = false;
	for (var i = 0; i < pThreadChanges.length; i++) {

		var vIndex = this.getIndexFromUri(pThreadChanges[i].refUri)

		if (vIndex == null) {
			vSyncError = true;
		} else {
			// Update timestamp of this refUri.
			//if not new syncTimeStamp, the request is a reverse request (internal...)
			if(pThreadChanges[i].syncTimeStamp)
				this.fThreads[vIndex].syncTimeStamp = pThreadChanges[i].syncTimeStamp;
			// Update comments path
			for (var j = 0; j < pThreadChanges[i].threads.length; j++) {
				var vThread = pThreadChanges[i].threads[j];
				switch (vThread.sync) {
					case '+' :
						vThread = this.unescapeThread(vThread);
						this.updateModelRelativePath(vThread.sync,
								pThreadChanges[i].refUri, vThread.oriPath);
						this.fParent.Controller.updateControlOripaths(
								vThread.sync, pThreadChanges[i].refUri,
								vThread.oriPath);
						this.fThreads[vIndex].threads.push(vThread);
						break;

					case '~' :
						vThread = this.unescapeThread(vThread);
						var vCommentIndex = this.getThreadIndex(
								pThreadChanges[i].refUri, vThread.oriPath);
						if (vCommentIndex == null) {
							vSyncError = true;
							return vSyncError;
						} else {
							this.fThreads[vIndex].threads[vCommentIndex] = vThread;

						}
						break;
					case '-' :
						var vCommentIndex = this.getThreadIndex(
								pThreadChanges[i].refUri, vThread.oriPath);
						if (vCommentIndex == null) {
							vSyncError = true;
							return vSyncError;
						} else {
							this.fThreads[vIndex].threads.splice(vCommentIndex,
									1);
							this.updateModelRelativePath(vThread.sync,
									pThreadChanges[i].refUri, vThread.oriPath);
							this.fParent.Controller.updateControlOripaths(
									vThread.sync, pThreadChanges[i].refUri,
									vThread.oriPath);

						}
						break;
					default :
						vSyncError = true;
						return vSyncError;
						break;
				}
			}

		}

	}
	return vSyncError;
}

/**
 * Remove specific comment "editing form" from the model
 */
scCommentMgr.Model.prototype.removeCommentEditingForm = function() {
	for (var i = 0; i < this.fThreads.length; i++)
		for (var j = 0; j < this.fThreads[i].threads.length; j++)
			for (var k = 0; k < this.fThreads[i].threads[j].comments.length; k++)
				if (this.fThreads[i].threads[j].comments[k].fEdit) {
					if (!this.fThreads[i].threads[j].comments[k].fDirectDelete)
						this.fThreads[i].threads[j].comments[k].fEdit = false;
					else
						this.fThreads[i].threads[j].comments.splice(k, 1)
				}
}

// //////////////////////////////////////////////////////
// Internal //
// //////////////////////////////////////////////////////

/**
 * Compute and update relatives paths
 * 
 * @param {char}
 *            pCode sync code (+, - or =)
 * @param {String}
 *            pRefUri sync refuri
 * @param {String}
 *            pRelativePath sync relative path
 * @return {Boolean} true in case of successful update
 */
scCommentMgr.Model.prototype.updateModelRelativePath = function(pCode, pRefUri,
		pRelativePath) {
	this.fParent.View.fThreadTable.resetFlags();

	var vIndex = this.getIndexFromUri(pRefUri);
	var vRelativePath = pRelativePath.split("/");

	if (vIndex != null) {
		for (var i = 0; i < this.fThreads[vIndex].threads.length; i++) {
			var vModelOripath = this.fThreads[vIndex].threads[i].oriPath
					.split("/");

			if (vRelativePath.length <= vModelOripath.length) {
				for (var j = 0; j < vRelativePath.length; j++) {
					if (j + 1 != vRelativePath.length
							&& vRelativePath[j] != vModelOripath[j])
						break;
					else if (j + 1 == vRelativePath.length) {
						if (pCode == '+'
								&& vModelOripath[j] >= vRelativePath[j])
							vModelOripath[j]++;

						if (pCode == '-' && this.fParent.Controller.fFullDelete
								&& vModelOripath[j] > vRelativePath[j]) {
							vModelOripath[j]--;
						}
					}
				}

				var vNewModelOripath = "";
				for (var k = 0; k < vModelOripath.length; k++) {
					if (k != 0)
						vNewModelOripath += "/";
					vNewModelOripath += vModelOripath[k];
				}
				if (this.fThreads[vIndex].threads[i].oriPath != vNewModelOripath) {
					this.fParent.View.fThreadTable.replaceEntry(pRefUri,
							this.fThreads[vIndex].threads[i].oriPath,
							vNewModelOripath);
					this.fThreads[vIndex].threads[i].oriPath = vNewModelOripath;
				}
			}

		}
	} else {
		return false;
	}
	return true;
}

scCommentMgr.Model.prototype.unescapeModel = function(pModel) {
	for (var i = 0; i < pModel.length; i++)
		pModel[i].threads = this.unescapeThreads(pModel[i].threads);
	return pModel;
}

scCommentMgr.Model.prototype.unescapeThreads = function(pThreads) {
	for (var i = 0; i < pThreads.length; i++)
		pThreads[i] = this.unescapeThread(pThreads[i]);
	return pThreads;
}

scCommentMgr.Model.prototype.unescapeThread = function(pThread) {
	for (var i = 0; i < pThread.comments.length; i++)
		pThread.comments[i].content = scCommentMgr.Utils
				.unescapeComment(pThread.comments[i].content);
	return pThread;
}

scCommentMgr.Model.prototype.getListRefUris = function() {
	var vReturn = new String();
	for (var i = 0; i < this.fThreads.length; i++) {
		vReturn += this.fThreads[i].refUri;
		if (i + 1 != this.fThreads.length)
			vReturn += "\t";
	}
	return vReturn;
}

scCommentMgr.Model.prototype.getListTimeStamps = function() {
	var vReturn = new String();
	for (var i = 0; i < this.fThreads.length; i++) {
		vReturn += this.fThreads[i].syncTimeStamp;
		if (i + 1 != this.fThreads.length)
			vReturn += "\t";
	}
	return vReturn;
}

/**
 * scCommentMgr.Controller constructor. Part of scCommentMgr object. Controller
 * JS object handle deep scenari link (oripath = refuri + relative path)
 * inserted during the HTML publication. Controller parse HTML page, compute the
 * best anchor for each thread, offer a control API.
 * 
 * @constructor
 * @param {scCommentMgr}
 *            pParentMgr
 */

scCommentMgr.Controller = function(pParentMgr) {
	this.fParent = pParentMgr;
	/**
	 * parsed oripath list from view
	 * 
	 * @type scCommentMgr.Utils.OriPathList
	 */
	this.fControlOriPathList = null;

	/**
	 * true if the manager is activate. False else.
	 * 
	 * @type Boolean
	 */
	this.fCommentMode = false;

	/**
	 * (internal) used for mark difference between comment removal and thread
	 * removal
	 * 
	 * @type Boolean
	 */
	this.fFullDelete = false;

	this.fPerms = null

}

// //////////////////////////////////////////////////////
// CONTROLS API //
// //////////////////////////////////////////////////////

/**
 * active / unactive commentmgr
 */
scCommentMgr.Controller.prototype.onOffCommentMode = function() {
	//scCoLib.util.log("function : scCommentMgr.Controller.onOffCommentMode - " + !this.fCommentMode);

	if (!this.fCommentMode) {
		//scCoLib.util.log("scCommentMgr.Controller.onOffCommentMode : comment ON");
		this.fCommentMode = true;
		sc$("onOffButton_" + this.fParent.fContextNodeId).setAttribute("class",
				"unActiveCommentButton");
		sc$("onOffButton_" + this.fParent.fContextNodeId).setAttribute("value",
				scCommentMgr.fStrings[0]);
		sc$("onOffButton_" + this.fParent.fContextNodeId).setAttribute("title",
				scCommentMgr.fStrings[0]);

		//this.fParent.View.buildCommentControls();
		scServices.scCommentSvc.fCurrentMgr = this.fParent;

		// Case Sync => get refuris from model.threads. With timestamp
		if (this.fParent.Model.fThreads)
			scServices.scCommentSvc.sendRequest("List", this.fParent.Model
							.getListRefUris(), this.fParent.Model
							.getListTimeStamps(), this.fParent.getXPaths(),
					this.fParent.getXPathsNS());
		// Case List => get refuris from html. No Timestamp
		else
			scServices.scCommentSvc.sendRequest("List", this
							.getControlOriPathList().getListRefUri(), null,
					this.fParent.getXPaths(), this.fParent.getXPathsNS());

		scCommentMgr.Utils.changeHtmlClass(scPaLib.findNode("des:body",
						document), "scCommentOFF", "scCommentON");
	} else {
		//scCoLib.util.log("scCommentMgr.Controller.onOffCommentMode : comment OFF");
		this.fCommentMode = false;
		sc$("onOffButton_" + this.fParent.fContextNodeId).setAttribute("class",
				"activeCommentButton");
		sc$("onOffButton_" + this.fParent.fContextNodeId).setAttribute("value",
				scCommentMgr.fStrings[1]);
		sc$("onOffButton_" + this.fParent.fContextNodeId).setAttribute("title",
				scCommentMgr.fStrings[1]);

		this.fParent.View.removeCommentControls();
		this.fParent.View.removeThreads();
		scCommentMgr.Utils.changeHtmlClass(scPaLib.findNode("des:body",
						document), "scCommentON", "scCommentOFF");

	}
	this.fParent.fStore.set("scCommentMode", this.fCommentMode);
	if("scSiLib" in window) scSiLib.fireResizedNode(this.fParent.contextNode());
}

/**
 * init a comment response. Prepare request, load form.
 * 
 * @param {int}
 *            pRefUriNumber index from Model.fThreads of the thread refuri to
 *            respond
 * @param {int}
 *            pThreadNumber index from Model.fThreads[refUriNum].threads of the
 *            thread number to respond
 * 
 * @param {int}
 *            pCommentNumber index of comment to respond in the thread
 *            (Model.fThreads[refUriNum].threads[pThreadNumber].comments)
 */
scCommentMgr.Controller.prototype.respondThread = function(pRefUriNumber,
		pThreadNumber, pCommentNumber) {

	//scCoLib.util.log("function : scCommentMgr.Controller.respondThread(" + pRefUriNumber + " " + pThreadNumber + " " + pCommentNumber + ")");
	scCommentMgr.scCommentWidgets.broadcastEvent("Respond");

	if (this.fReverseRequest) {
		this.fParent.Model.updateModel(this.fReverseRequest);
		this.loadThreads(this.fParent.Model.fThreads);
	}

	this.fParent.Model.removeCommentEditingForm();
	this.fReverseRequest = null;
	var vOldText = this.fParent.fStore.get("scCommentContent");
	var vFinalText;
	if(vOldText && vOldText != "none"){
		vFinalText = vOldText;
		this.fParent.fStore.set("scCommentContent", "none");
	}
	else vFinalText = scCommentMgr.fStrings[2];
	var vComment = {
		user : scServices.scCommentSvc.fUser,
		creationTime : new Date().getTime(),
		content : vFinalText,
		fEdit : true,
		fDirectDelete : true,
		fSelect : true
	};
	/*
	 * TODO Faire joujou avec le commentNumber et valider le fragment de code.
	 */
	this.fParent.Model.fThreads[pRefUriNumber].threads[pThreadNumber].comments
			.push(vComment);

	this.fParent.View.removeThreads();
	this.fParent.View.buildThreads();
	this.fParent.View.computeThreadPosition();

	scServices.scCommentSvc.prepareRequest("Respond", this.fParent.Model
					.getThreadRefUri(pRefUriNumber).replace("@", "\\@")
					+ "@"
					+ this.fParent.Model.getThreadRelativePath(pRefUriNumber,
							pThreadNumber) + "@" + pCommentNumber,
							this.fParent.Model.fThreads[pRefUriNumber].syncTimeStamp,
							this.fParent.getXPaths(), this.fParent.getXPathsNS());
}

/**
 * Init a thread creation. prepare request and load form.
 * 
 * @param {int}
 *            pIndexNodeAnc index in Controller.fOripathList of deep scenari
 *            link to comment.
 */
scCommentMgr.Controller.prototype.createThread = function(pIndexNodeAnc) {
	//scCoLib.util.log("function : scCommentMgr.Controller.createThread(" + pIndexNodeAnc + ")");
	scCommentMgr.scCommentWidgets.broadcastEvent("Create");
	if (this.fReverseRequest) {
		this.fParent.Model.updateModel(this.fReverseRequest);
		this.loadThreads(this.fParent.Model.fThreads);
	}

	this.fParent.Model.removeCommentEditingForm();
	
	var vOldText = this.fParent.fStore.get("scCommentContent");
	var vFinalText;
	if(vOldText && vOldText != "none"){
		vFinalText = vOldText;
		this.fParent.fStore.set("scCommentContent", "none");
	}
	else vFinalText = scCommentMgr.fStrings[2];
	var vRequest = [{
		refUri : this.fControlOriPathList.fList[pIndexNodeAnc].fRefUri,
		threads : [{
			sync : "+",
			oriPath : this.fControlOriPathList.fList[pIndexNodeAnc].fRelativePath
					+ "/1",
			excludedThread : false,
			threadClosed : false,
			comments : [{
						user : scServices.scCommentSvc.fUser,
						creationTime : new Date().getTime(),
						content : vFinalText,
						fEdit : true,
						fSelect : true
					}]
		}]
	}];

	this.fParent.Model.updateModel(vRequest);
	scServices.scCommentSvc.fCurrentMgr.View.removeThreads();
	this.loadThreads(this.fParent.Model.fThreads);
	scServices.scCommentSvc.fCurrentMgr.View.buildThreads();
	scServices.scCommentSvc.fCurrentMgr.View.computeThreadPosition();

	vRequest[0].threads[0].sync = "-";
	this.fFullDelete = true;

	this.fReverseRequest = vRequest;

	scServices.scCommentSvc
			.prepareRequest(
					"Create",
					this.fControlOriPathList.fList[pIndexNodeAnc].toEscapedString(),
					this.fParent.Model
							.getTimeStampFromRefUri(this.fControlOriPathList.fList[pIndexNodeAnc].fRefUri),
					this.fParent.getXPaths(), this.fParent.getXPathsNS());
}

/**
 * Init a comment update. Prepare request and load form.
 * 
 * @param {int}
 *            pRefUriNumber index of refUri to update in Model.fThreads
 * @param {int}
 *            pThreadNumber index of thread to update in
 *            Model.fThreads[refUriNum].threads
 * @param {int}
 *            pCommentNumber index of comment to update in
 *            del.fThreads[refUriNum].threads[threadNum].comments
 */
scCommentMgr.Controller.prototype.updateComment = function(pRefUriNumber, pThreadNumber, pCommentNumber) {
	//scCoLib.util.log("function : scCommentMgr.Controller.updateComment(" + pRefUriNumber + " " + pThreadNumber + " " + pCommentNumber + ")");
	scCommentMgr.scCommentWidgets.broadcastEvent("Update");
	if (this.fReverseRequest) {
		this.fParent.Model.updateModel(this.fReverseRequest);
		this.loadThreads(this.fParent.Model.fThreads);
	}

	this.fParent.Model.removeCommentEditingForm();
	this.fReverseRequest = null;

	this.fParent.Model.fThreads[pRefUriNumber].threads[pThreadNumber].comments[pCommentNumber].fEdit = true;

	this.fParent.View.removeThreads();
	this.fParent.View.buildThreads();
	this.fParent.View.computeThreadPosition();

	scServices.scCommentSvc
			.prepareRequest(
					"Update",
					this.fParent.Model.getThreadRefUri(pRefUriNumber).replace("@", "\\@")
							+ "@"
							+ this.fParent.Model.getThreadRelativePath(
									pRefUriNumber, pThreadNumber) + "@"
							+ pCommentNumber,
					this.fParent.Model.fThreads[pRefUriNumber].syncTimeStamp,
					this.fParent.getXPaths(), this.fParent.getXPathsNS());

}

/**
 * Close or open thread. Send close request to scCommentsvc.
 * 
 * @param {int}    pRefUriNumber
 * @param {int}    pThreadNumber
 * @param {String} pText ("open" or "close")
 */
scCommentMgr.Controller.prototype.closeThread = function(pRefUriNumber, pThreadNumber, pText) {
	//scCoLib.util.log("function : scCommentMgr.Controller.closeThread(" + pRefUriNumber + " " + pThreadNumber + ")");
	scCommentMgr.scCommentWidgets.broadcastEvent("Close");
	if (this.fReverseRequest) {
		this.fParent.Model.updateModel(this.fReverseRequest);
		this.loadThreads(this.fParent.Model.fThreads);
	}

	this.fParent.Model.removeCommentEditingForm();
	this.fReverseRequest = null;
	scServices.scCommentSvc
			.sendRequest(
					"Close",
					this.fParent.Model.getThreadRefUri(pRefUriNumber).replace("@", "\\@")
							+ "@"
							+ this.fParent.Model.getThreadRelativePath(
									pRefUriNumber, pThreadNumber),
					this.fParent.Model.fThreads[pRefUriNumber].syncTimeStamp,
					this.fParent.getXPaths(), this.fParent.getXPathsNS(), pText);
}

/**
 * Delete comment. After asking a confirmation, send a delete request to
 * scCommentSvc.
 * 
 * @param {int}
 *            pRefUriNumber index of refUri to delete in Model.fThreads
 * @param {int}
 *            pThreadNumber index of thread to delete in
 *            Model.fThreads[refUriNum].threads
 * @param {int}
 *            pCommentNumber index of comment to delete in
 *            del.fThreads[refUriNum].threads[threadNum].comments
 */
scCommentMgr.Controller.prototype.deleteComment = function(pRefUriNumber, pThreadNumber, pCommentNumber) {
	//scCoLib.util.log("function : scCommentMgr.Controller.deleteComment(" + pRefUriNumber + " " + pThreadNumber + " " + pCommentNumber + ")");
	scCommentMgr.scCommentWidgets.broadcastEvent("Delete");
	if (this.fReverseRequest) {
		this.fParent.Model.updateModel(this.fReverseRequest);
		this.loadThreads(this.fParent.Model.fThreads);
	}

	this.fParent.Model.removeCommentEditingForm();
	this.fReverseRequest = null;
	if (this.fParent.Model.fThreads[pRefUriNumber].threads[pThreadNumber].comments.length == 1) {
		this.fFullDelete = true;
	} else {
		this.fFullDelete = false;
	}
	var vConfirm = window.confirm(scCommentMgr.fStrings[3]);
	if (vConfirm) {
		scServices.scCommentSvc.fCurrentMgr = this.fParent;
		scServices.scCommentSvc
				.sendRequest(
						"Delete",
						this.fParent.Model.getThreadRefUri(pRefUriNumber).replace("@", "\\@")
								+ "@"
								+ this.fParent.Model.getThreadRelativePath(
										pRefUriNumber, pThreadNumber) + "@"
								+ pCommentNumber,
						this.fParent.Model.fThreads[pRefUriNumber].syncTimeStamp,
						this.fParent.getXPaths(), this.fParent.getXPathsNS());
	}
}

/**
 * Change a thread view. Remove thread content set new display params rebuild
 * comment reset and compute threads position.
 * 
 * @param {int}
 *            pNewDisplay new code for describing current display
 * @param {int}
 *            pNewNextDisplay new code for describing nextDisplay
 * @param {int}
 *            pThreadIndex index of the thread in the view data structure
 *            (view.fThreadTable).
 */
scCommentMgr.Controller.prototype.changeThreadView = function(pNewDisplay, pNewNextDisplay, pThreadIndex) {

	//scCoLib.util.log("function : scCommentMgr.Controller.changeThreadView(" + pNewDisplay + " " + pNewNextDisplay + " " + pThreadIndex + ")");
	scCommentMgr.scCommentWidgets.broadcastEvent("changeThreadView_START");

	// get anchor from pThreadIndex
	var vAnchor = this.fControlOriPathList
			.getNode(this.fParent.View.fThreadTable.fList[pThreadIndex].fAnchorOripath);

	// get threadBuilder
	var vThreadBuilder = scCommentMgr.scCommentWidgets.getThreadBuilder(
			vAnchor, this.fParent.fContextNodeId);

	// get controlsBuilder
	var vControlsBuilder = scCommentMgr.scCommentWidgets
			.getControlsBuilder(
					this.fControlOriPathList
							.getNode(this.fParent.View.fThreadTable.fList[pThreadIndex].fAnchorOripath),
					this.fParent.fContextNodeId);

	if (vThreadBuilder != null) {
		// get Comment Node
		var vNode = this.fParent.View.fThreadTable.fList[pThreadIndex].fNode;
		
		//get Perms
		var vPerms = this.fControlOriPathList.getOripathObject(vNode.parentElement).fPerms;

		// get refUriIndex
		var vRefUriIndex = this.fParent.Model
				.getIndexFromUri(this.fParent.View.fThreadTable.fList[pThreadIndex].fRefUri);
		// getCommentIndex
		var vCommentIndex = this.fParent.Model
				.getThreadIndex(
						this.fParent.View.fThreadTable.fList[pThreadIndex].fRefUri,
						this.fParent.View.fThreadTable.fList[pThreadIndex].fThreadRelativePath);

		// remove content of html thread
		while (vNode.hasChildNodes())
			vNode.removeChild(vNode.firstChild);

		// set new display settings
		this.fParent.View.fThreadTable.fList[pThreadIndex].fDisplay = pNewDisplay;
		this.fParent.View.fThreadTable.fList[pThreadIndex].fNextDisplay = pNewNextDisplay;

		// rebuild thread
		vThreadBuilder
				.buildThread(
						this.fParent.Model.fThreads[vRefUriIndex].threads[vCommentIndex],
						this.fParent.View.fThreadTable.fList[pThreadIndex],
						vRefUriIndex, vCommentIndex, pThreadIndex,
						this.fParent, vControlsBuilder.getFormFromNode(),vPerms);
		this.fParent.View.resetThreadPosition();
		this.fParent.View.computeThreadPosition();
	}

	scCommentMgr.scCommentWidgets.broadcastEvent("changeThreadView_END");
	if("scSiLib" in window) scSiLib.fireResizedNode(this.fParent.contextNode());
}

scCommentMgr.Controller.prototype.setThreadViewMode = function(pNewDisplay,	pNewNextDisplay, 
	pThreadIndex) {
		// set new display settings
		this.fParent.View.fThreadTable.fList[pThreadIndex].fDisplay = pNewDisplay;
		this.fParent.View.fThreadTable.fList[pThreadIndex].fNextDisplay = pNewNextDisplay;
}

// //////////////////////////////////////////////////////
// Internal //
// //////////////////////////////////////////////////////

/**
 * comment's editing interface control - submit
 * 
 * @param {string}
 *            pText content of the editing form.
 */
scCommentMgr.Controller.prototype.editingFormSubmit = function(pText) {
	//scCoLib.util.log("function : scCommentMgr.Controller.editingFormSubmit");

	if (this.fReverseRequest) {
		this.fParent.Model.updateModel(this.fReverseRequest);
		this.fReverseRequest = null;
	}

	scServices.scCommentSvc.setText(pText);
	scServices.scCommentSvc.fCurrentMgr = this.fParent;
	scServices.scCommentSvc.sendRequest();
}

/**
 * comment's editing interface control - cancel
 * 
 */
scCommentMgr.Controller.prototype.editingFormCancel = function() {
	//scCoLib.util.log("function : scCommentMgr.Controller.editingFormCancel");

	if (this.fReverseRequest) {
		this.fParent.Model.updateModel(this.fReverseRequest);
		this.loadThreads(this.fParent.Model.fThreads);
	}
	this.fReverseRequest = null;

	this.fParent.Model.removeCommentEditingForm();
	this.fParent.View.removeThreads();
	this.fParent.View.buildThreads();
	this.fParent.View.computeThreadPosition();
}

/**
 * if not done, parse DOM and return fControlOriPathList attribute. This method
 * should be used instead of a direct access.
 * 
 * @return {scCommentMgr.Utils.OripathList} the list of data-origin attribute
 */
scCommentMgr.Controller.prototype.getControlOriPathList = function() {
	if (this.fControlOriPathList == null) {
		this.fControlOriPathList = this.parseForOriPath(this.fParent
				.contextNode());
	}
	return this.fControlOriPathList;
}

/**
 * load(or update) threads into View.fThreadsTable
 * 
 * @param {}
 *            pCommentThreads Model list of comments thread
 * @param {Boolean}
 *            pForcedMode change layout in order to view all comment
 */
scCommentMgr.Controller.prototype.loadThreads = function(pCommentThreads) {
	//scCoLib.util.log("function : scCommentMgr.Controller.loadThreads()");
	if (this.fParent.View.fThreadTable == null)
		this.fParent.View.fThreadTable = new scCommentMgr.Utils.CommentViewModelList();

	this.fParent.View.fThreadTable.resetFlags();

	// for each refuri
	for (var i = 0; i < pCommentThreads.length; i++) {
		// for each thread
		for (var j = 0; j < pCommentThreads[i].threads.length; j++) {
			// excludedThread because of XPath exclusion.
			if (!pCommentThreads[i].threads[j].excludedThread) {
				// Check if this oripath or Node exist
				var vIndex = this.fParent.View.fThreadTable.getIndex(
						pCommentThreads[i].threads[j].oriPath,
						pCommentThreads[i].refUri);
				var vNodeAnchor;
				// else create new entry in
				// scCommentMgr.Controller.fThreadTable
				if (vIndex == null) {
					// resolve proximity
					vNodeAnchor = this.proximityResolver(
							pCommentThreads[i].refUri,
							pCommentThreads[i].threads[j].oriPath);
					// create entry
					if (vNodeAnchor != null) {
						vIndex = this.fParent.View.fThreadTable.addEntry(
								pCommentThreads[i].refUri,
								pCommentThreads[i].threads[j].oriPath, -1);
						this.fParent.View.fThreadTable.fList[vIndex].fAnchorOripath = this.fControlOriPathList
								.getOripath(vNodeAnchor);
					}
				}
				// if the comment has to be publish
				else {
					// set Flag
					this.fParent.View.fThreadTable.fList[vIndex].fFlag = true;
				}
			}
		}
	}
	this.fParent.View.fThreadTable.deleteFalseFlag();
}

/**
 * update all control oripath (check and compute relative path) after thread
 * creation or full removal
 * 
 * @param {String}
 *            pRequest model sent request code
 * @param {String}
 *            pRefUri RefUri of oripath (built or deleted)
 * @param {String}
 *            pRelavitePath of oripath (built or deleted)
 */
scCommentMgr.Controller.prototype.updateControlOripaths = function(pRequest, pRefUri, pRelavitePath) {
	//scCoLib.util.log("function : scCommentMgr.Controller.updateControlOripaths(" + pRequest + " " + pRefUri + " " + pRelavitePath + ")");
	var vPath = pRelavitePath.split("/");
	var vIndex = vPath.length - 1;
	// Part one : change html oripath
	for (var i = 0; i < this.fControlOriPathList.fList.length; i++) {
		var vNodePath = this.fControlOriPathList.fList[i].fRelativePath
				.split("/");
		if (pRefUri == this.fControlOriPathList.fList[i].fRefUri
				&& vPath.length <= vNodePath.length) {
			for (var j = 0; j < vPath.length; j++) {
				if (j + 1 != vPath.length && vPath[j] != vNodePath[j])
					break;
				else if (j + 1 == vPath.length) {
					if (pRequest == '+' && vNodePath[vIndex] >= vPath[vIndex])
						vNodePath[vIndex]++;
					if (pRequest == '-' && this.fFullDelete
							&& vNodePath[vIndex] > vPath[vIndex]) {

						vNodePath[vIndex]--;
					}
				}
			}
			var vReturnPath = "";
			for (var j = 0; j < vNodePath.length; j++) {
				if (j != 0)
					vReturnPath += "/";
				vReturnPath += vNodePath[j];
			}
			this.fParent.View.fThreadTable.replaceAnchorOripaths(pRefUri + "@"
							+ this.fControlOriPathList.fList[i].fRelativePath,
					pRefUri + "@" + vReturnPath);
			this.fControlOriPathList.fList[i].fRelativePath = vReturnPath;
		}
	}

}

/**
 * Search the best anchor where attach a thread.
 * 
 * @param {String}
 *            pRefUri id of the comment.
 * @param {String}
 *            pRelativePath relativePath of the comment.
 * @return {ScCommentMgr.Utils.Oripath} an Oripath with a single relative path
 *         if attachment is possible. Null if not.
 */
scCommentMgr.Controller.prototype.proximityResolver = function(pRefUri,
		pRelativePath) {

	this.getControlOriPathList();

	var vNode = null;
	var vSize = 0;

	for (var i = 0; i < this.fControlOriPathList.fList.length; i++) {
		if (this.fControlOriPathList.fList[i].fRefUri == pRefUri) {
			var vMode = this.fControlOriPathList.fList[i].fMode;
			var vDepth;
			if (vMode.match("node.?.?")) {
				vDepth = parseInt(vMode.substr(4))
						? parseInt(vMode.substr(4))
						: 1;
				vMode = "node";
			}
			switch (vMode) {
				case "node" :
					// NodeX follow primitive structure.
					// Scenari systematically add a level between two
					// composition-prims.

					if (pRelativePath.match("^"
							+ this.fControlOriPathList.fList[i].fRelativePath
							+ ".+$")
							&& (pRelativePath.length - this.fControlOriPathList.fList[i].fRelativePath.length) <= vDepth
									* 4) {

						if (this.fControlOriPathList.fList[i].fRelativePath.length > vSize) {
							vNode = this.fControlOriPathList.fList[i].fNode;
							vSize = this.fControlOriPathList.fList[i].fRelativePath.length
						}
					}
					break;
				case "leaf" :
					if (pRelativePath.match("^"
							+ this.fControlOriPathList.fList[i].fRelativePath
							+ ".+$")) {
						if (this.fControlOriPathList.fList[i].fRelativePath.length > vSize)
							vNode = this.fControlOriPathList.fList[i].fNode;
						vSize = this.fControlOriPathList.fList[i].fRelativePath.length;
					}
					break;
				default :
					throw "unknown proximity resolver mode";
					break;
			}
		}
	}
	return vNode;
}

/**
 * intern use only. launch a complete dom parsing for data-origin attribute.
 * 
 * @return {scCommentMgr.Utils.OripathList} the list of data-origin attribute
 */
scCommentMgr.Controller.prototype.parseForOriPath = function(pNode) {
	//scCoLib.util.log("function : scCommentMgr.Utils.parseDomForOriPath");
	var vOriPathList = new scCommentMgr.Utils.OriPathList();
	vOriPathList = this.recursiveOripathSearch(pNode, vOriPathList, null);
	return vOriPathList;
}

/**
 * Intern use only. Recursive task for searching data-origin attributes.
 * 
 * @param {Node}
 *            pNode Current node
 * @param {scCommentMgr.Utils.OripathList}
 *            pOripathList OriPathList objeInternct to complete
 * @return {scCommentMgr.Utils.OripathList} Completed OriPathList
 */
scCommentMgr.Controller.prototype.recursiveOripathSearch = function(pNode,
		pOripathList, pString) {
	if (pNode.attributes) {
		var vDataOrigin = pNode.attributes.getNamedItem('data-origin');
		if (vDataOrigin != null) {
			var vDataOriginString = vDataOrigin.value;
			if (vDataOriginString.charAt(0) == '@') {
				pString = vDataOriginString.substring(1, vDataOriginString.indexOf('?'))
						+ "#"
						+ vDataOriginString.substring(vDataOriginString
										.indexOf('#')
										+ 1, vDataOriginString.length);
			} else if (vDataOriginString.charAt(0) == '#') {
				pString = pString.split("#")[0] + "#"
						+ vDataOriginString.substring(1);
			} else
				pString += "/" + vDataOriginString;
			if (scCommentMgr.scCommentWidgets.getControlsBuilder(pNode,
					this.fParent.fContextNodeId))
				pOripathList.addCommentOriPath(pString, pNode);
		}
	}

	var children = pNode.childNodes;
	for (var i = 0; i < children.length; i++) {
		pOripathList = this.recursiveOripathSearch(children[i], pOripathList,
				pString);
	}

	return pOripathList;
}

scCommentMgr.Controller.prototype.updatePerms = function(pPerms) {
	var isModified = false;
	if(!this.fPerms){
		this.fPerms = pPerms;
		isModified = true;
	}
	for (var i = 0; i < pPerms.length; i++) {
		for (var j = 0; j < this.fPerms.length; j++) {
			if(pPerms[i].refUri == this.fPerms[j].refUri &&
			pPerms[i].perms != this.fPerms[j].perms){
				this.fPerms[j].perms = pPerms[i].perms;
				isModified = true;
			}
				
		}
	}
	
	if (isModified) this.updatePermsOripath();
}

scCommentMgr.Controller.prototype.updatePermsOripath = function() {
	for (var i = 0; i < this.fControlOriPathList.fList.length; i++) {
		for (var j = 0; j < this.fPerms.length; j++) {
			if (this.fPerms[j].refUri == this.fControlOriPathList.fList[i].fRefUri){
				var vUpdateControls = this.fControlOriPathList.fList[i].fPerms==null?
					true:this.fControlOriPathList.fList[i].fPerms.Create != this.fPerms[j].perms.Create;
				this.fControlOriPathList.fList[i].fPerms = this.fPerms[j].perms;
				if(vUpdateControls){
					this.fParent.View.updateCommentControl(this.fControlOriPathList.fList[i], i);
				}
			}	
		}
	}
}

/**
 * scCommentMgr.View constructor. Part of scCommentMgr object. View JS object
 * handle thread graphical representation and drive controls and threads builder
 * throught event (hardcoded event in widget mapping and thread and controls
 * builders).
 * 
 * @constructor
 * @param {scCommentMgr}
 *            pParent
 */
scCommentMgr.View = function(pParent) {

	this.fParent = pParent;

	/**
	 * View data structure. Set of data needed for building html.
	 * 
	 * @type scCommentMgr.Utils.CommentViewModelList
	 */
	this.fThreadTable = null;
}


scCommentMgr.View.prototype.updateCommentControl = function(pOripath, pIndex){
	scCommentMgr.scCommentWidgets.broadcastEvent("updateCommentControl_START");

	// Get controls builder
	var vControlsBuilder = scCommentMgr.scCommentWidgets
			.getControlsBuilder(pOripath.fNode,	this.fParent.fContextNodeId);
	if (vControlsBuilder != null) {
		// build
		vControlsBuilder.updateControl(pOripath, pIndex,	this.fParent);
	}
	scCommentMgr.scCommentWidgets.broadcastEvent("updateCommentControl_END");
	if("scSiLib" in window) scSiLib.fireResizedNode(this.fParent.contextNode());
}

/**
 * remove all comment controls by event broadcasting.
 */
scCommentMgr.View.prototype.removeCommentControls = function() {
	//scCoLib.util.log("function : scCommentMgr.View.removeCommentControls");
	scCommentMgr.scCommentWidgets.broadcastEvent("removeCommentControls");
	if("scSiLib" in window) scSiLib.fireResizedNode(this.fParent.contextNode());
}

/**
 * remove all Threads from View by event broadcasting
 */
scCommentMgr.View.prototype.removeThreads = function() {
	//scCoLib.util.log("function : scCommentMgr.View.removeThreads");
	scCommentMgr.scCommentWidgets.broadcastEvent("removeThreads_START");

	// set fThreadTable - fNode to NULL
	if (this.fThreadTable) {
		for (var i = 0; i < this.fThreadTable.fList.length; i++) {
			this.fThreadTable.fList[i].fNode = null;
		}
	}

	scCommentMgr.scCommentWidgets.broadcastEvent("removeThreads_END");
	if("scSiLib" in window) scSiLib.fireResizedNode(this.fParent.contextNode());
}

/**
 * Build thread from scCommentMgr.Controller.fThreadTable At this stage, the
 * document doesn't contains any thread
 */
scCommentMgr.View.prototype.buildThreads = function() {
	//scCoLib.util.log("function : scCommentMgr.View.buildThreads");
	scCommentMgr.scCommentWidgets.broadcastEvent("buildThreads_START");

	for (var i = 0; i < this.fThreadTable.fList.length; i++) {
		// create a div for the thread
		var vThread = document.createElement('div');
		vThread.className = 'thread';
		this.fThreadTable.fList[i].fNode = vThread;

		// get model refuri index
		var vRefUriIndex = this.fParent.Model
				.getIndexFromUri(this.fThreadTable.fList[i].fRefUri);

		// get model thread index
		var vThreadIndex = this.fParent.Model.getThreadIndex(
				this.fThreadTable.fList[i].fRefUri,
				this.fThreadTable.fList[i].fThreadRelativePath);

		// get oripath (scCommentMgr.Utils.Oripath)
		var vOripathObject = this.fParent.Controller.fControlOriPathList
				.getOripathObject(this.fThreadTable.fList[i].fAnchorOripath);
		

		// get thread builder
		var vThreadBuilder = scCommentMgr.scCommentWidgets.getThreadBuilder(
				vOripathObject.fNode, this.fParent.fContextNodeId);

		// get controls builder
		var vControlsBuilder = scCommentMgr.scCommentWidgets
				.getControlsBuilder(vOripathObject.fNode,this.fParent.fContextNodeId);

		var vAnchorCommentContainer = vControlsBuilder.getAnchorContainer(vOripathObject);
		
		// insert thread into the anchor threafs container
		vAnchorCommentContainer.appendChild(vThread);
				
		// build thread
		if (vThreadBuilder != null)
			vThreadBuilder
					.buildThread(
							this.fParent.Model.fThreads[vRefUriIndex].threads[vThreadIndex],
							this.fThreadTable.fList[i], vRefUriIndex,
							vThreadIndex, i, this.fParent, vControlsBuilder.getFormFromNode(),
							vOripathObject.fPerms);
	}

	scCommentMgr.scCommentWidgets.broadcastEvent("buildThreads_END");
	if("scSiLib" in window) scSiLib.fireResizedNode(this.fParent.contextNode());
}


/**
 * Insert a div.cache if anchor container covers the next anchor container.
 */
scCommentMgr.View.prototype.computeThreadSize = function() {
	//scCoLib.util.log("function : scCommentMgr.View.computeThreadSize");
	scCommentMgr.scCommentWidgets.broadcastEvent("computeThreadSize_START");

	var vOripathList = this.fParent.Controller.fControlOriPathList.fList;
	for (var i = 0; i < vOripathList.length; i++) {
		// If this anchor has linked threads
		if (vOripathList[i].fCommentContainerNode) {
			// getCommentsBuilder
			var vThisThreadBuilder = scCommentMgr.scCommentWidgets
					.getThreadBuilder(vOripathList[i].fNode,
							this.fParent.fContextNodeId);

			// in Case of thread size limitation setting
			if (vThisThreadBuilder && vThisThreadBuilder.fLimitControllerSize) {
				// search for the following thread
				for (var j = i + 1; j < vOripathList.length; j++) {
					// following thread must be inside a container linked to a
					// next oripath
					if (vOripathList[j].fCommentContainerNode) {
						if (vOripathList[i].fCommentContainerNode.offsetHeight > vOripathList[j].fCommentContainerNode.finalDest
								- vOripathList[i].fCommentContainerNode.finalDest) {
							vOripathList[i].fCommentContainerNode.style.height = vOripathList[j].fCommentContainerNode.finalDest
									- vOripathList[i].fCommentContainerNode.finalDest
									+ "px";

							// insert a cache
							var vDiv = document.createElement('div');
							vDiv.className = "cache";

							vOripathList[i].fCommentContainerNode
									.insertBefore(
											vDiv,
											vOripathList[i].fCommentContainerNode.firstChild);
							break;
						}
					}
				}
			}
		}
	}

	scCommentMgr.scCommentWidgets.broadcastEvent("computeThreadSize_END");

}

/**
 * Reset the position of all threads (set to the thread at the same position).
 * delete all the div inserted for adpating size and position by event
 * broadcasting.
 * 
 */
scCommentMgr.View.prototype.resetThreadPosition = function() {
	//scCoLib.util.log("function : scCommentMgr.View.resetThreadPosition");

	scCommentMgr.scCommentWidgets.broadcastEvent("resetThreadPosition_START");
	
	for (var i = 0; i < this.fParent.Controller.fControlOriPathList.fList.length; i++) {
		var vOripathObject = this.fParent.Controller.fControlOriPathList.fList[i];
		
		// Get ThreadBuilder
		var vThreadBuilder = scCommentMgr.scCommentWidgets.getThreadBuilder(
				vOripathObject.fNode, this.fParent.fContextNodeId);
		
		if(vOripathObject.fCommentContainerNode && vThreadBuilder && vThreadBuilder.fComputeVerticalPosition)
			vOripathObject.fCommentContainerNode.style.top = scCommentMgr.Utils.offsetTop(vOripathObject.fNode)+"px";
	}
							
	scCommentMgr.scCommentWidgets.broadcastEvent("resetThreadPosition_END");
}

/**
 * Generic algorithm, Compute and set all thread top offset
 * 
 */
scCommentMgr.View.prototype.computeThreadPosition = function() {
	//scCoLib.util.log("function : scCommentMgr.View.computeThreadPosition");

	scCommentMgr.scCommentWidgets.broadcastEvent("computeThreadPosition_START");

	// for each anchor node
	for (var i = 0; i < this.fParent.Controller.fControlOriPathList.fList.length; i++) {

		// ///////////////////////////////
		// INIT Var //
		// ///////////////////////////////
		// get oripath
		var vOripathObject = this.fParent.Controller.fControlOriPathList.fList[i];
		// get next oripath linked with a thread
		var vNextCommentedOripathObject = this.fParent.Controller.fControlOriPathList
				.getNextOripathObject(vOripathObject);
		// get absolute next oripath
		var vNextOripathObject = this.fParent.Controller.fControlOriPathList.fList[i
				+ 1];
		// get previous oripath
		var vPreviousOripathObject = this.fParent.Controller.fControlOriPathList
				.getPreviousOripathObject(vOripathObject);

		// Get ThreadBuilder
		var vThreadBuilder = scCommentMgr.scCommentWidgets.getThreadBuilder(
				vOripathObject.fNode, this.fParent.fContextNodeId);

		// Get forms Builder
		var vControlsBuilder = scCommentMgr.scCommentWidgets
				.getControlsBuilder(vOripathObject.fNode,
						this.fParent.fContextNodeId);
		// //////// END INIT VAR /////////////

		// if a vertical thread computing position is asked
		if (vOripathObject.fCommentContainerNode && vThreadBuilder
				&& vThreadBuilder.fComputeVerticalPosition) {

			// CASE COMMENT ON THE SIDE IN FRONT OF ANCHOR
			if (vThreadBuilder.fCommentOnTheSide
					&& vThreadBuilder.fComputeSideCommentFrontOfAnchor) {
				var vValue = vControlsBuilder.getTop(vOripathObject.fNode,
						"sideInFrontOfNode", "currentNode");
				vOripathObject.fCommentContainerNode.style.top = vValue + "px";
				vOripathObject.fCommentContainerNode.finalDest = vValue;

				if (vNextCommentedOripathObject
						&& (scCommentMgr.Utils
								.offsetTop(vOripathObject.fCommentContainerNode)
								+ vOripathObject.fCommentContainerNode.offsetHeight > scCommentMgr.Utils
								.offsetTop(vNextCommentedOripathObject.fNode))) {
					// SUB CASE DIV SIZE ADAPTER INSERTION
					if (vThreadBuilder.fInsertResizerInContent) {
						var vHeight = (scCommentMgr.Utils
								.offsetTop(vOripathObject.fCommentContainerNode)
								+ vOripathObject.fCommentContainerNode.offsetHeight - scCommentMgr.Utils
								.offsetTop(vNextCommentedOripathObject.fNode));
						vControlsBuilder.insertAdapter(
								vNextCommentedOripathObject.fNode, vHeight,
								true);

					}
					/*
					 * //SUB CASE CACHE IS INSERTED INSIDE A COMMENT THE COMMENT
					 * CONTENER else{ vDiv.className = "cache";
					 * vOripathObject.fCommentContainerNode.insertBefore(vDiv,
					 * vOripathObject.fCommentContainerNode.firstChild) }
					 */
				}
			}
			// CASE COMMENT ON THE SIDE ONE BY ONE
			else if (vThreadBuilder.fCommentOnTheSide
					&& !vThreadBuilder.fComputeSideCommentFrontOfAnchor) {
				if (!vPreviousOripathObject) {
					var vValue = vControlsBuilder.getTop(vOripathObject.fNode,
							"sideOneByOne", "currentNode");
					vOripathObject.fCommentContainerNode.style.top = vValue
							+ "px";
					vOripathObject.fCommentContainerNode.finalDest = vValue;
				} else {
					var vValue = vControlsBuilder.getTop(
							vPreviousOripathObject.fCommentContainerNode,
							"sideOneByOne", "previousComment");
					vOripathObject.fCommentContainerNode.style.top = vValue
							+ "px";
					vOripathObject.fCommentContainerNode.finalDest = vValue;

				}
			}
			// CASE COMMENT INSTERTED IN THE CONTENT
			else {
				var vValue;
				if (vThreadBuilder.fInsertBefore)
					vValue = vControlsBuilder.getTop(vOripathObject,
							"insertionBefore", "oripath");
				else
					vValue = vControlsBuilder.getTop(vOripathObject,
							"insertionAfter", "oripath");

				vOripathObject.fCommentContainerNode.style.top = vValue + "px";
				vOripathObject.fCommentContainerNode.finalDest = vValue;

				// SubCase With resizer insertion
				if ((vNextOripathObject || vThreadBuilder.fAlwaysInsertResier)
						&& vOripathObject.fCommentContainerNode.children.length) {
					var vHeight = (vOripathObject.fCommentContainerNode.offsetHeight);

					if (vThreadBuilder.fInsertBefore)
						vControlsBuilder.insertAdapter(vOripathObject.fNode,
								vHeight, true);
					else
						vControlsBuilder.insertAdapter(vOripathObject.fNode,
								vHeight, false);
				}
			}
		}
	}
	this.computeThreadSize();

	scCommentMgr.scCommentWidgets.broadcastEvent("computeThreadPosition_END");
}

/**
 * scCommentMgr.Utis JS namespace wich contains utils functions and objects
 * library.
 * 
 * @namespace
 * 
 */

scCommentMgr.Utils = {
	/**
	 * build date as string from object Date
	 * 
	 * @param {Date}
	 *            pTimeMilliSec
	 * @return {string}
	 */
	writeDate : function(pTimeMilliSec) {
		var vDate = new Date(pTimeMilliSec);
		var vDay = new String(vDate.getDate());
		if (vDay.length == 1)
			vDay = "0" + vDay;

		var vMonth = new String(vDate.getMonth() + 1);
		if (vMonth.length == 1)
			vMonth = "0" + vMonth;

		var vHour = new String(vDate.getHours());
		if (vHour.length == 1)
			vHour = "0" + vHour;
		var vMinutes = new String(vDate.getMinutes());
		if (vMinutes.length == 1)
			vMinutes = "0" + vMinutes;
		return vDay + "/" + vMonth + "/" + vDate.getFullYear() + " " + vHour
				+ ":" + vMinutes;
	},

	/**
	 * Return int wich is the min length of two args
	 * 
	 * @param {Array}
	 *            pArray1
	 * @param {Array}
	 *            pArray2
	 * @return {int}
	 */
	minArrayLength : function(pArray1, pArray2) {
		if (pArray1.length > pArray2.length)
			return pArray2.length;
		else
			return pArray1.length;
	},

	/**
	 * Add a class to an HTML node
	 * 
	 * @param {DOMElement}
	 *            pNode
	 * @param {string}
	 *            pClass the class to add
	 */
	addHtmlClass : function(pNode, pClass) {
		var vTab = pNode.className.split(" ");
		for (var i = 0; i < vTab.length; i++) {
			if (vTab[i] == pClass)
				return;
		}
		if (vTab.length != 0)
			pNode.className += " ";
		pNode.className += pClass;
	},
	/**
	 * Remove a class from an HTML class
	 * 
	 * @param {DOMElement}
	 *            pNode
	 * @param {string}
	 *            pClass
	 */
	removeHtmlClass : function(pNode, pClass) {
		var vTab = pNode.className.split(" ");
		var vClass = "";
		for (var i = 0; i < vTab.length; i++) {
			if (vTab[i] != pClass && vTab[i] != "")
				vClass += " " + vTab[i];
		}
		pNode.className = vClass;
	},
	/**
	 * change a class from an HTML node
	 * 
	 * @param {DOMElement}
	 *            pNode
	 * @param {string}
	 *            pOldClass the class to remove
	 * @param {string}
	 *            pNewClass the class to add
	 */
	changeHtmlClass : function(pNode, pOldClass, pNewClass) {
		this.removeHtmlClass(pNode, pOldClass);
		this.addHtmlClass(pNode, pNewClass);
	},

	/**
	 * check if a HTML Node contains a class
	 * 
	 * @param {DOMElement}
	 *            pNode
	 * @param {string}
	 *            pClass the class to check
	 * @return {Boolean}
	 */
	containsHtmlClass : function(pNode, pClass) {
		var vTab = pNode.className.split(" ");
		for (var i = 0; i < vTab.length; i++) {
			if (vTab[i] == pClass)
				return true;
		}
		return false;
	},

	/**
	 * Compute an absolute offset top from a node
	 * 
	 * @param {DOMElement}
	 *            pNode
	 * @return {int}
	 */
	offsetTop : function(pNode) {
		var vOffset = pNode.offsetTop;
		while (pNode.offsetParent) {
			pNode = pNode.offsetParent;
			vOffset += pNode.offsetTop;
		}
		return vOffset
	},

	/**
	 * scroll smoothly a windows
	 * 
	 * @param {int}
	 *            pDest Y axis destination of the scroll
	 * @param {int}
	 *            pInvDeltaD reverse range delta
	 * @param {int}
	 *            pDeltaT time delta
	 */
	smoothScroll : function(pDest, pInvDeltaD, pDeltaT) {
		if (!pDeltaT)
			pDeltaT = 1;
		if (!pInvDeltaD)
			pInvDeltaD = 10;
		var vOld = window.scrollY;

		window.scrollBy(0, pDest / pInvDeltaD);
		var vDelta = vOld - window.scrollY;
		pDest += vDelta;

		if (pDest && vDelta)
			setTimeout("scCommentMgr.Utils.smoothScroll(" + pDest + ", "
					+ pInvDeltaD + ", " + pDeltaT + ");");

	},

	/** Protect characters -- by -~- */
	escapeComment : function(pText) {
		if (!pText) return pText;
		return pText.replace(/(-\~*)(?=-)/g, "$1~"); 
	},
	/** Transform back -- */
	unescapeComment : function(pText) {
		if (!pText) return pText;
		return pText.replace(/(-\~*)\~(?=-)/g, "$1");
	}

}

// //////////////////////////////////////////////////////
// oripath //
// //////////////////////////////////////////////////////

/**
 * Oripath Object constructor. An oripath is a representation of a deep scenari
 * link inserted into an HTML publication fRelativePath : relative path from
 * item to element fRefUri : ID or URI of an item
 * 
 * @constructor
 * @param{String} pOripath fRefUri@fRelativePath
 * @param {Node}
 *            pNode Dom node containing this oripath (for anchor)
 */
scCommentMgr.Utils.OriPath = function(pOripath, pNode, pMode) {
	var vOripathTab = pOripath.split('#');
	this.fRelativePath = vOripathTab[1];
	this.fRefUri = vOripathTab[0];
	this.fNode = pNode;
	this.fCommentContainerNode = null;
	this.fMode = pMode ? pMode : "leaf";
	this.fPerms = null;
}
/**
 * build a String from an oripath.
 * 
 * @param {int}
 *            pCommentNumber number of a comment inside a thread (added to the
 *            end to the oripath)
 * @return {string} oripath
 */
scCommentMgr.Utils.OriPath.prototype.toString = function(pCommentNumber) {
	if (pCommentNumber)
		return this.fRefUri + "@" + this.fRelativePath + "@" + pCommentNumber;
	else
		return this.fRefUri + "@" + this.fRelativePath;
}

scCommentMgr.Utils.OriPath.prototype.toEscapedString = function(pCommentNumber) {
	if (pCommentNumber)
		return this.fRefUri.replace("@", "\\@") + "@" + this.fRelativePath + "@" + pCommentNumber;
	else
		return this.fRefUri.replace("@", "\\@") + "@" + this.fRelativePath;
}

// //////////////////////////////////////////////////////
// oripath - list //
// //////////////////////////////////////////////////////

/**
 * oripathList constructor. OripathList is the controler data structure
 * OriPathList Object fList : Array of OriPath
 * 
 * @constructor
 */
scCommentMgr.Utils.OriPathList = function() {
	this.fList = [];
}

// //////////////////////////////////////////////////////
// oripath - list //
// Getters //
// //////////////////////////////////////////////////////
/**
 * get an oripath object from an oripath string
 * 
 * @param {string|pNode}
 *            pOripath || pCommentContainer
 * @return {scCommentMgr.utils.Oripath} oripath
 */
scCommentMgr.Utils.OriPathList.prototype.getOripathObject = function(pOripath) {
	for (var i = 0; i < this.fList.length; i++) {
		if (this.fList[i].toString() === pOripath
				|| this.fList[i].fCommentContainerNode === pOripath)
			return this.fList[i];
	}
	return null;
}

/**
 * get the next object of the array
 * 
 * @param {scCommentMgr.utils.Oripath}
 *            pOripathObject current
 * @return {pOripathObject} next
 */
scCommentMgr.Utils.OriPathList.prototype.getNextOripathObject = function(
		pOripathObject) {
	for (var i = 0; i < this.fList.length; i++) {
		if (this.fList[i] == pOripathObject)
			for (var j = i + 1; j < this.fList.length; j++) {
				if (this.fList[j].fCommentContainerNode)
					return this.fList[j];
			}
	}
	return null;
}

/**
 * get the previous object of the table
 * 
 * @param {scCommentMgr.utils.Oripath}
 *            pOripathObject current
 * @return {scCommentMgr.utils.Oripath} previous
 */
scCommentMgr.Utils.OriPathList.prototype.getPreviousOripathObject = function(
		pOripathObject) {
	for (var i = 0; i < this.fList.length; i++) {
		if (this.fList[i] == pOripathObject) {
		if (i + 1 != this.fList.length)
			for (var j = i - 1; j >= 0; j--) {
				if (this.fList[j].fCommentContainerNode)
					return this.fList[j];
			}
		}
	}
	return null;
}

/**
 * get a string of refUris ready to be sent to the server (refUri1\trefuri2\t
 * ...)
 * 
 * @return {string}
 */
scCommentMgr.Utils.OriPathList.prototype.getListRefUri = function() {
	var vRefUris = "";
	var vWrittenRefUri = new Array();
	var vAdd;
	for (var i = 0; i < this.fList.length; i++) {
		vAdd = true;
		for (var j = 0; j < vWrittenRefUri.length; j++) {
			if (this.fList[i].fRefUri == vWrittenRefUri[j])
				vAdd = false;
		}
		if (vAdd) {
			if (vRefUris != "") {
				vRefUris += "\t";
			}
			vRefUris += this.fList[i].fRefUri;
			vWrittenRefUri.push(this.fList[i].fRefUri);
		}
	}
	return vRefUris;
}
/**
 * get all the HTML nodes of the array
 * 
 * @return {Array} array of Nodes
 */
scCommentMgr.Utils.OriPathList.prototype.getNodes = function() {
	var vNodes = new Array();
	for (var i = 0; i < this.fList.length; i++) {
		vNodes.push(this.fList[i].fNode);
	}
	return vNodes;
}

/**
 * get the HTML node from an oripath string
 * 
 * @param {string}
 *            pOripath
 * @return {DOMElement}
 */
scCommentMgr.Utils.OriPathList.prototype.getNode = function(pOripath) {
	for (var i = 0; i < this.fList.length; i++) {
		if (this.fList[i].toString() == pOripath)
			return this.fList[i].fNode;
	}
	return null;
}
/**
 * get the oripath string from HTML Node
 * 
 * @param {DomElement}
 *            pNode
 * @return {string} oripath
 */
scCommentMgr.Utils.OriPathList.prototype.getOripath = function(pNode) {
	for (var i = 0; i < this.fList.length; i++) {
		if (this.fList[i].fNode == pNode)
			return this.fList[i].toString();
	}
	return null;
}
// //////////////////////////////////////////////////////
// oripath - list //
// Methods //
// //////////////////////////////////////////////////////

/**
 * Create Oripath and add to the list
 * 
 * @param {String}
 *            oripath to parse
 * @param {DomElement}
 *            pNode
 */
scCommentMgr.Utils.OriPathList.prototype.addCommentOriPath = function(pOripath,
		pNode) {

	this.fList.push(new scCommentMgr.Utils.OriPath(pOripath, pNode,
			scCommentMgr.scCommentWidgets.getAnchorMode(pNode)));
}

// //////////////////////////////////////////////////////
// CommentViewModel //
// //////////////////////////////////////////////////////

/**
 * Constructor of CommentViewModel object. CommentViwModel is the 'model' of a
 * thread view. It contains the HTML Node of a thread, the anchor oripath
 * (juncture key with oripathlist), thread refuri, thread relative path, a
 * display code, a next display code and an internal flag.
 * 
 * @constructor
 * @param {DOMElement}
 *            pNode HTML node of the thread.
 * @param {string}
 *            pAnchorOripath oripath of the anchor
 * @param {string}
 *            pThreadRelativePath relative path of the thread (like 1/4/2/5)
 * @param {string}
 *            pRefUri refUri fo the thread
 * @param {int}
 *            pDisplay code which could be used for thread HTML construction
 * @param {int}
 *            pNextDisplay code which could be used for build multiview
 */
scCommentMgr.Utils.CommentViewModel = function(pNode, pAnchorOripath,
		pThreadRelativePath, pRefUri, pDisplay, pNextDisplay) {
	this.fNode = pNode;
	this.fAnchorOripath = pAnchorOripath;
	this.fThreadRelativePath = pThreadRelativePath;
	this.fRefUri = pRefUri;
	this.fDisplay = pDisplay;
	this.fNextDisplay = pNextDisplay;
	this.fFlag = true;
}
// //////////////////////////////////////////////////////
// CommentViewModelList //
// //////////////////////////////////////////////////////

/**
 * Constructor of CommentViewModelList. Data structure of View. ordered array of
 * CommentViewModel (ordered by RefUri then RelativePath)
 * 
 * @constructor
 */
scCommentMgr.Utils.CommentViewModelList = function() {
	this.fList = new Array();
}

// //////////////////////////////////////////////////////
// CommentViewModelList //
// Getters //
// //////////////////////////////////////////////////////

/**
 * get index of a CommentViewModel object from its relative path and refuri OR
 * from its container node
 * 
 * @param {Node |
 *            string} pRefElement Case Node, use only one arg. Two on the other
 *            case (type:String relativePath)
 * @param {String}
 *            pRefUri
 * @return {int} index
 */
scCommentMgr.Utils.CommentViewModelList.prototype.getIndex = function(
		pRefElement, pRefUri) {
	for (var i = 0; i < this.fList.length; i++) {
		if (this.fList[i].fNode === pRefElement
				|| this.fList[i].fThreadRelativePath === pRefElement
				&& pRefUri === this.fList[i].fRefUri)
			return i
	}
	return null;
}
/**
 * get all indexes of CommentViewModel related to a single anchor
 * 
 * @param {String}
 *            pAnchor oripath of the anchor
 * @return {Array.int}
 */
scCommentMgr.Utils.CommentViewModelList.prototype.getArrayFromAnchor = function(
		pAnchor) {
	var result = new Array();
	for (var i = 0; i < this.fList.length; i++) {
		if (this.fList[i].fAnchorOripath == pAnchor) {
			result.push(i);
		}
	}
	return result;
}

/**
 * get the thread node form refUri and thread relativePath
 * 
 * @param {String}
 *            pRefUri
 * @param {String}
 *            pThreadRelativePath
 * @return {Node}
 */
scCommentMgr.Utils.CommentViewModelList.prototype.getThread = function(pRefUri,
		pThreadRelativePath) {
	return this.fList[this.getIndex(pThreadRelativePath, pRefUri)].fNode;
}

// //////////////////////////////////////////////////////
// CommentViewModelList //
// Methods //
// //////////////////////////////////////////////////////

/**
 * Delete an element of the list.
 * 
 * @param {string |
 *            number} pRefElement In case of int, use list index(and one single
 *            arg). Else use RelavitePath and RefUri
 * @param {String}
 *            pRefUri
 */
scCommentMgr.Utils.CommentViewModelList.prototype.removeEntry = function(
		pRefElement, pRefUri) {
	for (var i = 0; i < this.fList.length; i++) {
		if (pRefElement === i
				|| pRefElement === this.fList[i].fThreadRelativePath
				&& pRefUri === this.fList[i].fRefUri) {
			this.fList.splice(i, 1);
		}
	}
}
/**
 * Replace relativePath and set flag to false
 * 
 * @param {String}
 *            pRefUri
 * @param {String}
 *            pLastRelativePath
 * @param {String}
 *            pNewRelativePath
 */
scCommentMgr.Utils.CommentViewModelList.prototype.replaceEntry = function(
		pRefUri, pLastRelativePath, pNewRelativePath) {
	for (var i = 0; i < this.fList.length; i++) {
		if (pRefUri === this.fList[i].fRefUri
				&& pLastRelativePath === this.fList[i].fThreadRelativePath
				&& this.fList[i].fFlag == false) {
			this.fList[i].fThreadRelativePath = pNewRelativePath;
			this.fList[i].fFlag = true;
		}
	}
}

/**
 * Add an entry to the RIGHT displaying place... (order by RefUri then
 * RelativePath)
 * 
 * @param {String}
 *            pRefUri
 * @param {String}
 *            pThreadRelativePath
 * @param {int}
 *            pDisplay option
 * @return {int} index
 */
scCommentMgr.Utils.CommentViewModelList.prototype.addEntry = function(pRefUri,
		pThreadRelativePath, pDisplay) {
	var vRefUriRange = false;

	if (this.fList.length == 0) {
		this.fList.push(new scCommentMgr.Utils.CommentViewModel(null, null,
				pThreadRelativePath, pRefUri, pDisplay, null));
		return 0;
	}
	for (var i = 0; i < this.fList.length; i++) {
		if (pRefUri == this.fList[i].fRefUri)
			vRefUriRange = true;

		// Case 1 refUri unknown
		if (i + 1 == this.fList.length && vRefUriRange == false) {
			this.fList.push(new scCommentMgr.Utils.CommentViewModel(null, null,
					pThreadRelativePath, pRefUri, pDisplay, null));
			return i + 1;
		}

		// case 3 refUri known and relativePath to insert
		else if (vRefUriRange == true) {

			var vCurrentPath = this.fList[i].fThreadRelativePath.split("/");
			var vPathToAdd = pThreadRelativePath.split("/");
			var vMax = scCommentMgr.Utils.minArrayLength(vCurrentPath,
					vPathToAdd);
			for (var j = 0; j < vCurrentPath.length; j++) {
				if (vCurrentPath[j] > vPathToAdd[j]) {
					this.fList.splice(i, 0,
							new scCommentMgr.Utils.CommentViewModel(null, null,
									pThreadRelativePath, pRefUri, pDisplay,
									null));
					return i;
				} else if (vCurrentPath[j] < vPathToAdd[j])
					break;
			}
			if ((i + 1 < this.fList.length && this.fList[i + 1].fRefUri != pRefUri)
					|| i + 1 == this.fList.length) {
				this.fList.splice(i + 1, 0,
						new scCommentMgr.Utils.CommentViewModel(null, null,
								pThreadRelativePath, pRefUri, pDisplay, null));
				return i + 1;
			}
		}
	}
}
/**
 * reset all flags to false
 */
scCommentMgr.Utils.CommentViewModelList.prototype.resetFlags = function() {
	for (var i = 0; i < this.fList.length; i++) {
		this.fList[i].fFlag = false;
	}
}
/**
 * Delete all element with a false flag
 */
scCommentMgr.Utils.CommentViewModelList.prototype.deleteFalseFlag = function() {
	for (var i = 0; i < this.fList.length; i++) {
		if (this.fList[i].fFlag == false)
			this.fList.splice(i, 1);
	}
}
/**
 * Update all anchor oripath equals to pOldOripath to a pNewOripath
 * 
 * @param {String}
 *            pOldOripath
 * @param {String}
 *            pNewOripath
 */
scCommentMgr.Utils.CommentViewModelList.prototype.replaceAnchorOripaths = function(
		pOldOripath, pNewOripath) {
	for (var i = 0; i < this.fList.length; i++) {
		if (this.fList[i].fAnchorOripath == pOldOripath) {
			this.fList[i].fAnchorOripath = pNewOripath;
		}
	}
}

/**
 * Local Storage API (localStorage/userData/cookie)
 * 
 * @constructor
 */
scCommentMgr.Utils.LocalStore = function(pId) {
	if (pId && !/^[a-z][a-z0-9]+$/.exec(pId))
		throw new Error("Invalid store name");
	this.fId = pId || "";
	this.fRootKey = document.location.pathname.substring(0,
			document.location.pathname.lastIndexOf("/"))
			+ "/";
	if ("localStorage" in window && typeof window.localStorage != "undefined") {
		this.get = function(pKey) {
			var vRet = localStorage.getItem(this.fRootKey + this.xKey(pKey));
			return (typeof vRet == "string" ? unescape(vRet) : null)
		};
		this.set = function(pKey, pVal) {
			localStorage.setItem(this.fRootKey + this.xKey(pKey), escape(pVal))
		};
	} else if (window.ActiveXObject) {
		this.get = function(pKey) {
			this.xLoad();
			return this.fIE.getAttribute(this.xEsc(pKey))
		};
		this.set = function(pKey, pVal) {
			this.fIE.setAttribute(this.xEsc(pKey), pVal);
			this.xSave()
		};
		this.xLoad = function() {
			this.fIE.load(this.fRootKey + this.fId)
		};
		this.xSave = function() {
			this.fIE.save(this.fRootKey + this.fId)
		};
		this.fIE = document.createElement('div');
		this.fIE.style.display = 'none';
		this.fIE.addBehavior('#default#userData');
		document.body.appendChild(this.fIE);
	} else {
		this.get = function(pKey) {
			var vReg = new RegExp(this.xKey(pKey) + "=([^;]*)");
			var vArr = vReg.exec(document.cookie);
			if (vArr && vArr.length == 2)
				return (unescape(vArr[1]));
			else
				return null
		};
		this.set = function(pKey, pVal) {
			document.cookie = this.xKey(pKey) + "=" + escape(pVal)
		};
	}
	this.xKey = function(pKey) {
		return this.fId + this.xEsc(pKey)
	};
	this.xEsc = function(pStr) {
		return "LS" + pStr.replace(/ /g, "_")
	};
}
