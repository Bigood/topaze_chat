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

scCommentMgr.opaleControlsBuilder = function(pContext) {

	/**
	 * Insert comment with "onClick" event
	 */
	
	this.fInsertOnClick = pContext.fInsertOnClick?true:false;

}
// //////////////////////////////////////////////////////
// Interface //
// //////////////////////////////////////////////////////
/**
 * handle events see scCommentMgr.View for available events
 * 
 * @param {string}
 *            pEvent
 */
scCommentMgr.opaleControlsBuilder.prototype.event = function(pEvent) {
	switch (pEvent) {

		case "onLoad" :
 			var vCommentMode;
 			var vMgr = sc$('mgrContainer').mgr;
			if ((vCommentMode = vMgr.fStore.get("scCommentMode")) && vCommentMode != String(vMgr.Controller.fCommentMode)) vMgr.Controller.onOffCommentMode();

			if(vCommentMode != "true"){
				vMgr.Controller.onOffCommentMode();
				vMgr.Controller.onOffCommentMode();
			}
			
			break;


		case "removeThreads_START" :
			this.removeAdapter();
			break;

		case "buildThreads_END" :
			break;

		case "resetThreadPosition_START" :
			this.removeAdapter();
			break;
		
		case "computeThreadPosition_END" :
			this.addNumberThread();

	}

}

/**
 * Create all comment controls with oripath from
 * scCommentMgr.Controller.fControlOriPathList
 */
scCommentMgr.opaleControlsBuilder.prototype.updateControl = function(pOripath,pIndex, pMgr) {
		//scCoLib.util.log("function : scCommentMgr.opaleControlsBuilder.buildCommentControls( " + pOripath + " " + pIndex + " " + pMgr + " )");
	if(pOripath.fPerms.Create && !pOripath.fBuilt){
		if (this.fInsertOnClick) {
			pOripath.fNode.ondblclick = function(event) {
				scCommentMgr.scCommentWidgets.controlsBuilder.getBuilder(0).onDblClick(pIndex);
				event = event || window.event;
				event.cancelBubble = true;
				if (event.stopPropagation) event.stopPropagation();
			}
			scCommentMgr.Utils.addHtmlClass(pOripath.fNode, "scCommentable");

			pOripath.fNode.onmouseover = function(event) {
				scCommentMgr.scCommentWidgets.controlsBuilder.getBuilder(0).onOver(this);
				event = event || window.event;
				event.cancelBubble = true;
				if (event.stopPropagation)event.stopPropagation();
			}
			pOripath.fNode.onmouseout = function(event) {
				scCommentMgr.scCommentWidgets.controlsBuilder.getBuilder(0).resetOver();
				event = event || window.event;
				event.cancelBubble = true;
				if (event.stopPropagation)event.stopPropagation();
			}

		} else {
			var vForm = scDynUiMgr.addElement("form",pOripath.fNode.parentNode, "addCommentForm", pOripath.fNode);
			var vButton = scDynUiMgr.addElement("input",vForm, "addCommentButton");
			vButton.setAttribute("type", "button");
			vButton.setAttribute("value", scCommentMgr.fStrings[5]);
			vButton.setAttribute("title", scCommentMgr.fStrings[5]);
			vButton.setAttribute("onClick","scCommentMgr.opaleControlsBuilder.prototype.formClosing("
							+ pIndex + ",'timestamp', null, 'create')");
		}
		pOripath.fBuilt = true;
	}
	else if(!pOripath.fPerms.Create && pOripath.fBuilt){
		if (this.fInsertOnClick) {
			scCommentMgr.Utils.removeHtmlClass(pOripath.fNode, "scCommentable");
			pOripath.fNode.ondblclick = null;
			pOripath.fNode.onmouseover = null;
			pOripath.fNode.onmouseout = null;
			scCommentMgr.Utils.removeHtmlClass(pOripath.fNode, "hover");
		}
		else{pOripath.fNode.parentNode.removeChild(pOripath.fNode.previousSibling);}
		pOripath.fBuilt = false;
	}
}

/**
 * Used inside the View by generic y-position algorithm. Must return the
 * y-position of a CommentContainer depending of the anchor node and insertion
 * param.
 * 
 * @param {DOM
 *            element} pNode the anchor node
 * @param {string}
 *            pKindOfInsertion describe the kind of y position. Should be
 *            "sideInFrontOfNode", "sideOneByOne", "insertion".
 * @param {string}
 *            pKindOfNode describe the kind of pNode. Should be
 *            "currentNode"(anchorNode) or "PrevisousComment"
 */
scCommentMgr.opaleControlsBuilder.prototype.getTop = function(pParam, pKindOfInsertion, pKindOfNode) {
	switch (pKindOfInsertion) {
		// An easy case. Position a commentcontainer in front of the top of anchor node
		case "sideInFrontOfNode" :
			return scCommentMgr.Utils.offsetTop(pParam);
			break;
		// Insert the comment container one just after the previous one.

		case "sideOneByOne" :
			// If the sended node is currentNode, the algorithm try to compute
			// the first comment container y-position. Return top of anchor.
			if (pKindOfNode == "currentNode")
				return scCommentMgr.Utils.offsetTop(pParam);
			// else, return the bottom of the previous comment container
			else
				return scCommentMgr.Utils.offsetTop(pParam)
						+ pParam.offsetHeight;
			break;

		case "insertionAfter" :
			var vNode = pParam.fNode;
			// if the node contains sub nodes
			if (scCommentMgr.scCommentWidgets.insertFirst(vNode)) {
				if (vNode.childNodes.length > 1)
					return scCommentMgr.Utils.offsetTop(vNode.firstChild)
							+ vNode.firstChild.offsetHeight
							- scCommentMgr.Utils
									.offsetTop(sc$('mgrContainer').parentNode);
				else
					return scCommentMgr.Utils.offsetTop(vNode)
							+ vNode.offsetHeight
							- scCommentMgr.Utils
									.offsetTop(sc$('mgrContainer').parentNode);
			}
			// else return the bottom of the node
			else
				return scCommentMgr.Utils.offsetTop(vNode)
						+ vNode.offsetHeight
						- scCommentMgr.Utils
								.offsetTop(sc$('mgrContainer').parentNode);
			break;

		case "insertionBefore" :
			var vNode = pParam.fNode;
			return scCommentMgr.Utils.offsetTop(vNode)
					- pParam.fCommentContainerNode.offsetHeight
					- scCommentMgr.Utils
							.offsetTop(sc$('mgrContainer').parentNode);
			break;

	}
}

/**
 * function which must take the anchor node in param and return the created
 * form.
 * 
 * @param {DOM
 *            element} pNode the anchor node
 * @return {DOM element} the HTML thread insertion form
 */
scCommentMgr.opaleControlsBuilder.prototype.getFormFromNode = function() {
	if (this.fInsertOnClick)
		return function(pNode) {
			return pNode;
		};
	else
		return function(pNode) {
			return pNode.previousSibling;
		};
}

/**
 * Build and insert a blank div.commentSizeAdapter if asked in commentControls
 * 
 * @param {DOM
 *            element} pNode the anchor
 * @param {int}
 *            pHeight y size of futur div.commentSizeAdapter
 * @param {Boolean}
 *            pInsertlast true : insert last, false : insert first
 */
scCommentMgr.opaleControlsBuilder.prototype.insertAdapter = function(pNode,pHeight, pInsertBefore) {
	// build div.commentSizeAdapter
	var vAdapter = document.createElement("div");
	vAdapter.className = "commentSizeAdapter";
	vAdapter.style.height = pHeight + "px";

	// Insert after
	if (!pInsertBefore) {
		// Insert after first child
		if (scCommentMgr.scCommentWidgets.insertFirst(pNode)) {
			// insert inside the div, after the form AND after the
			// targged element
			if (pNode.childNodes.length > 1)pNode.insertBefore(vAdapter, pNode.childNodes[1]);
			else pNode.appendChild(vAdapter);
		}
		// Case the element handle only the targetted element (p,
		// span, etc.)
		else if (pNode.nextSibling)	pNode.parentNode.insertBefore(vAdapter, pNode.nextSibling);
		else pNode.parentNode.appendChild(vAdapter);

	}
	// insertBefore
	else {pNode.parentNode.insertBefore(vAdapter, pNode.previousSibling);}
}

/**
 * delete all .commentSizeAdapter class
 */
scCommentMgr.opaleControlsBuilder.prototype.removeAdapter = function() {
	var vCommentSizeAdapter = scPaLib.findNodes("des:.commentSizeAdapter",
			document);
	// compute content position because of thread removing
	for (var i = 0; i < vCommentSizeAdapter.length; i++)
		vCommentSizeAdapter[i].parentNode.removeChild(vCommentSizeAdapter[i]);

	var vExtraMarginSizeAdapter = scPaLib.findNodes(
			"des:.extraMarginSizeAdapter", document);
	for (var i = 0; i < vExtraMarginSizeAdapter.length; i++) {
		vExtraMarginSizeAdapter[i].style.marginBottom = "";
		scCommentMgr.Utils.removeHtmlClass(vExtraMarginSizeAdapter[i],
				"extraMarginSizeAdapter");
	}
}

/**
 * In case of true insertion specified in threadBuilder, manage the insertion.
 */
scCommentMgr.opaleControlsBuilder.prototype.getAnchorContainer = function(vOripath) {	
	// Get insertion Params
	var vThreadBuilder = scCommentMgr.scCommentWidgets.getThreadBuilder(vOripath.fNode, "mgrContainer")
	
	
	var vInsertBefore = vThreadBuilder.fInsertBefore;
	var vTrueInsertion = vThreadBuilder.fTrueInsertion;

			
	if(!vOripath.fCommentContainerNode){
		// get the anchor threads container. Create it if null
		vOripath.fCommentContainerNode = document.createElement('div');
		vOripath.fCommentContainerNode.className = "commentContainer";
		vOripath.fCommentContainerNode.id = "commentContainer"+ vOripath.toString();

		if (vTrueInsertion) {
			vOripath.fCommentContainerNode.ondblclick = function(event) {
				event = event || window.event;
				event.cancelBubble = true;
				if (event.stopPropagation)
					event.stopPropagation();
			}

			if (vTrueInsertion && !vOripath.fCommentContainerNode.inserted) {
				vOripath.fCommentContainerNode.inserted = true;
				if (!vInsertBefore) {
					if (scCommentMgr.scCommentWidgets.insertFirst(vOripath.fNode)) {	
						// insert inside the div, after the form AND after the targged element
						if (vOripath.fNode.childNodes.length > 1)
							vOripath.fNode.insertBefore(vOripath.fCommentContainerNode,vOripath.fNode.childNodes[1]);
						else
							vOripath.fNode.appendChild(vOripath.fCommentContainerNode);
					}
					// Case the element handle only the targetted element (p,span, etc.)
					else if (vOripath.fNode.nextSibling)
						vOripath.fNode.parentNode.insertBefore(vOripath.fCommentContainerNode,vOripath.fNode.nextSibling);
					else vOripath.fNode.parentNode.appendChild(vOripath.fCommentContainerNode);
				}
				// insertBefore
				else {
					vOripath.fNode.parentNode.insertBefore(vOripath.fCommentContainerNode,vOripath.fNode.previousSibling);
				}
			}
		}
		else{
			sc$('commentContainer').appendChild(vOripath.fCommentContainerNode);
		}
	}
	return vOripath.fCommentContainerNode;
}

// //////////////////////////////////////////////////////
// Internal //
// //////////////////////////////////////////////////////

scCommentMgr.opaleControlsBuilder.prototype.onDblClick = function(pIndex) {
	if (sc$("mgrContainer").mgr.Controller.fCommentMode)
		scCommentMgr.opaleControlsBuilder.prototype.formClosing(pIndex, null, null, "create");
}

scCommentMgr.opaleControlsBuilder.prototype.onOver = function(pNode) {
	if (sc$("mgrContainer").mgr.Controller.fCommentMode) {
		this.resetOver();
		scCommentMgr.Utils.addHtmlClass(pNode, "hover");
	}
}

scCommentMgr.opaleControlsBuilder.prototype.resetOver = function() {
	var vSelectedNodes = scPaLib.findNodes("des:.hover", document);
	for (var i = 0; i < vSelectedNodes.length; i++)
		scCommentMgr.Utils.removeHtmlClass(vSelectedNodes[i], "hover");
}

scCommentMgr.opaleControlsBuilder.prototype.formClosing = function(pArg1,
		pArg2, pArg3, pCommand, pArgSup) {
	var vNode = scPaLib.findNode("des:textarea.editformArea", document);
	if (vNode
			&& sc$('mgrContainer').mgr.Controller.fCommentMode
			&& !confirm(scCommentMgr.fStrings[4])) {
		return;
	}

	switch (pCommand) {
		case "create" :

			sc$('mgrContainer').mgr.Controller.createThread(pArg1);
			scCommentMgr.Utils.addHtmlClass(sc$('mgrContainer'),
					"commentCreation");
			break;

		case "delete" :
			sc$('mgrContainer').mgr.Controller.deleteCommentWithSleep1(pArg1,
					pArg2, pArg3);
			scCommentMgr.Utils.removeHtmlClass(sc$('mgrContainer'),
					"commentCreation");
			break;

		case "update" :
			sc$('mgrContainer').mgr.Controller
					.updateComment(pArg1, pArg2, pArg3);
			scCommentMgr.Utils.removeHtmlClass(sc$('mgrContainer'),
					"commentCreation");
			break;

		case "close" :
		    var vMgr = sc$('mgrContainer').mgr;
		    if(pArg3 == "close")
				vMgr.Controller.setThreadViewMode(0, 1, pArgSup);
			else
				vMgr.Controller.setThreadViewMode(1, 0, pArgSup);
			vMgr.Controller.closeThread(pArg1, pArg2, pArg3);
			scCommentMgr.Utils.removeHtmlClass(sc$('mgrContainer'),
					"commentCreation");
			break;

		case "respond" :
			sc$('mgrContainer').mgr.Controller
					.respondThread(pArg1, pArg2, pArg3);
			scCommentMgr.Utils.removeHtmlClass(sc$('mgrContainer'),
					"commentCreation");
			break;

		case "onOff" :
			sc$('mgrContainer').mgr.Controller.onOffCommentMode();
			scCommentMgr.utils.removeHtmlClass(sc$('mgrContainer'),
					"commentCreation");
			break;

	}

}

scCommentMgr.opaleControlsBuilder.prototype.exitWindow = function() {
	if (scPaLib.findNode("des:textarea.editformArea", document)
			&& sc$('mgrContainer').mgr.Controller.fCommentMode)
		return scCommentMgr.fStrings[4];
}

/* NIB : commenté. Pose des problèmes de positionnement
scCommentMgr.opaleControlsBuilder.prototype.computeSize = function() {
	var vContainers = scPaLib.findNodes("des:.commentContainer", document);
	for (var i = 0; i < vContainers.length; i++) {
  var value = 0;
		var currentChild = vContainers[i].firstChild;
		while (currentChild) {
			value += currentChild.offsetHeight;
		 currentChild = currentChild.nextSibling;
		 }
		vContainers[i].style.height = value + "px";
	}
}
*/
scCommentMgr.opaleControlsBuilder.prototype.addNumberThread = function(){
	var vTotalNumber = 0;
	var vTotalOpenedNumber = 0;
	var vOripathList = sc$("mgrContainer").mgr.Controller.fControlOriPathList.fList;
	for(var i = 0 ; i < vOripathList.length ; i++){
		if(vOripathList[i].fCommentContainerNode){
			var vLocalOpenedNumber = 0;
			var vLocalNumber = vOripathList[i].fCommentContainerNode.childNodes.length;
			for(var j = 0 ; j < vLocalNumber ; j++)
				if(!scCommentMgr.Utils.containsHtmlClass(vOripathList[i].fCommentContainerNode.childNodes[j], "closed")){
					vLocalOpenedNumber++;
				}
			
			if(vLocalNumber){
				var vCounter;
				if(vOripathList[i].fNode.firstChild && vOripathList[i].fNode.firstChild.className == "localInfoBullet"){
					vCounter = vOripathList[i].fNode.firstChild;
				}
				else{
					vCounter =  scDynUiMgr.addElement("span", vOripathList[i].fNode, "localInfoBullet", vOripathList[i].fNode.firstChild);
					vCounter.appendChild(document.createTextNode(""));
					
					var vDescNode = scDynUiMgr.addElement("span", vCounter, "localInfoBulletDesc");
					vDescNode.appendChild(document.createTextNode(""));					
				}
				
				vCounter.firstChild.textContent = new String(vLocalOpenedNumber+"/"+vLocalNumber);
				var vDesc = new String(vLocalOpenedNumber + scCommentMgr.fStrings[22] + vLocalNumber);
				vCounter.setAttribute("title", vDesc);
				vCounter.lastChild.firstChild.textContent = vDesc;				
				
				vTotalOpenedNumber += vLocalOpenedNumber;
				vTotalNumber += vLocalNumber;
				
			}
		}
	}
	if(vTotalNumber){
		var vCommentSwitcher = sc$("onOffButton_mgrContainer");
		if(vCommentSwitcher.previousSibling && vCommentSwitcher.previousSibling.className == "globalInfoBullet"){
			vCounter = vCommentSwitcher.previousSibling;
		}
		else{
			vCounter = scDynUiMgr.addElement("span", vCommentSwitcher.parentNode, "globalInfoBullet", vCommentSwitcher);
			vCounter.appendChild(document.createTextNode(""));
			
			var vDescNode = scDynUiMgr.addElement("span", vCounter, "globalInfoBulletDesc");
			vDescNode.appendChild(document.createTextNode(""));
		}		
		vCounter.firstChild.textContent = new String(vTotalOpenedNumber+"/"+vTotalNumber);
		var vDesc =  vTotalOpenedNumber + scCommentMgr.fStrings[22] + vTotalNumber;
		vCounter.setAttribute("title",vDesc);
		vCounter.lastChild.firstChild.textContent = vDesc;

	}
}

window.onbeforeunload = scCommentMgr.opaleControlsBuilder.prototype.exitWindow;

/**
 * Thread builder class. This js class implements methods for building thread
 * html view. It's devided in three part of code : - interface (fields or
 * methods which must be implemented) - internal (fields or methods kept from
 * opaleThreadsBuilder) - specific (fields or methods implemented for extbook
 * specific needs)
 * 
 * @param {Bool}
 *            pComputeVerticalPosition use generic algorithm for computing
 *            vertical position if true
 * @param {Bool}
 *            pCommentOnTheSide compute a vertical position at the same y-level
 *            than content if true
 * @param {Bool}
 *            pComputeSideCommentFrontOfAnchor compute vertical position at the
 *            same y-level than linked anchor
 * @param {Bool}
 *            pTrueInsertion add commentContainer inside the HTML node of the
 *            content if true. Otherwise, insertion used use absolute CSS rules.
 * @param {Bool}
 *            pInsertBefore In case of comment insertion, insert before the
 *            anchor node
 * @param {Bool}
 *            pInsertResizerInContent Allow generic algorithm to insert blank
 *            div into the content (needed if "false" insertion or comment on
 *            the side)
 * @param {Bool}
 *            pAlwaysInsertResier Force div resizer insertion, even when nothing
 *            follow the comment Anchor
 * @param {Bool}
 *            pLimitControllerSize insert a div.cache in the
 *            commentAnchorContainer if threads cover an other
 *            commentAnchorContainer
 * @param {Bool}
 *            pBuildArrow insert a div.arrow in thread
 * @param {Bool}
 *            pDefaultDisplayOpen control the default thread building true =>
 *            open false => closed
 * @param {Bool}
 *            pFullThreadRemoving control thre thread removing method true =>
 *            html is deleted each time than comment mode is off false => html
 *            is deleted only before threads rebuilding
 */
scCommentMgr.opaleThreadsBuilder = function(pContext) {

	// //////////////////////////////////////////////////////
	// Interface //
	// //////////////////////////////////////////////////////
	/**
	 * use generic algorithm for computing vertical position
	 */
	this.fComputeVerticalPosition = pContext.fComputeVerticalPosition?true:false;
	/**
	 * compute a vertical position at the same y-level than anchor
	 */
	this.fCommentOnTheSide = pContext.fCommentOnTheSide?true:false;;

	/**
	 * compute vertical position at the same y-level than linked anchor
	 */
	this.fComputeSideCommentFrontOfAnchor = pContext.fComputeSideCommentFrontOfAnchor?true:false;

	/**
	 * add commentContainer inside the HTML node of the content if true.
	 * -Otherwise, insertion used use absolute CSS rules.
	 */
	this.fTrueInsertion = pContext.fTrueInsertion?true:false;
	/**
	 * In case of comment insertion, insert before the anchor node
	 */
	this.fInsertBefore = pContext.fInsertBefore?true:false;

	/**
	 * Allow generic algorithm to insert blank div into the content
	 */
	this.fInsertResizerInContent = pContext.fInsertResizerInContent?true:false;

	/**
	 * Force div resizer insertion, even when nothing follow the comment Anchor
	 */
	this.fAlwaysInsertResier = pContext.fAlwaysInsertResier?true:false;

	/**
	 * insert a div.cache in the commentAnchorContainer if threads cover an other
	 * commentAnchorContainer
	 */
	this.fLimitControllerSize = pContext.fLimitControllerSize?true:false;

	// //////////////////////////////////////////////////////
	// Internal //
	// //////////////////////////////////////////////////////
	/**
	 * insert a div.arrow in thread
	 */
	this.fBuildArrow = pContext.fBuildArrow?true:false;

	/**
	 * control the default thread building true => open false => closed
	 */
	this.fDefaultDisplayOpen = pContext.fDefaultDisplayOpen?true:false;

	/**
	 * control thre thread removing method true => html is deleted each time
	 * than comment mode is off false => html is deleted only before threads
	 * rebuilding
	 */
	this.fFullThreadRemoving = pContext.fFullThreadRemoving?true:false;

}

// //////////////////////////////////////////////////////
// Interface //
// //////////////////////////////////////////////////////

/**
 * Event system
 * 
 * @param {string}
 *            pEvent name of the event.
 * 
 * Must handle event removeThreads_START or removeThreads_END for removing
 * threads
 */

scCommentMgr.opaleThreadsBuilder.prototype.event = function(pEvent) {
	switch (pEvent) {
		case "onLoad" :
			break;

		case "removeThreads_START" :
			this.removeThreads();
			break;

		case "buildThreads_START" :
			this.initThreadBuilding();
			break;
			
		case "buildThreads_END" :
			this.initEvents();
			break;

		case "computeThreadPosition_END" :
			this.selectText();
			break;

		default :
			break;
	}

}

/**
 * Build a thread
 * 
 * @param {scServer
 *            Class} pThreadModel extract of mgr model ({thread [comment,
 *            comment, ...]}
 * @param {scCommentMgr.Utils.CommentViewModel}
 *            pViewModel view model of this thread
 * @param {int}
 *            pRefUriIndex index of refUri in model. Used for binding Controller
 *            methods
 * @param {int}
 *            pThreadIndex index of thread in model. Used for binding Controller
 *            methods
 * @param {int}
 *            pIndex index of CommentViewModel. Used for binding Controller
 *            changeThreadView method
 * @param {scCommentMgr}
 *            pMgr the full mgr.
 * @param {function}
 *            pFromAnchorToForm function which handle find a control from anchor
 * @return {DOM element} return the created thread
 */
scCommentMgr.opaleThreadsBuilder.prototype.buildThread = function(
		pThreadModel, pViewModel, pRefUriIndex, pThreadIndex, pIndex, pMgr,
		pFromAnchorToForm, pPerms) {

	var vAnchor = pMgr.Controller.fControlOriPathList
			.getNode(pViewModel.fAnchorOripath);

	scCommentMgr.Utils.addHtmlClass(vAnchor, "scCommented");
	scCommentMgr.Utils.addHtmlClass(pFromAnchorToForm(vAnchor), "scCommented");
	if (pThreadModel.comments.length > 1) {
		scCommentMgr.Utils.addHtmlClass(vAnchor, "scCommentMulti");
		scCommentMgr.Utils.addHtmlClass(pFromAnchorToForm(vAnchor),
				"scCommentMulti");
	}

	if (pViewModel.fDisplay == -1) {
		if(pThreadModel.threadClosed)
			pViewModel.fDisplay = 0;
		else
			if (this.fDefaultDisplayOpen)
				pViewModel.fDisplay = 1;
			else
				pViewModel.fDisplay = 0;
	}
	if (pViewModel.fDisplay == 0)
		pViewModel.fNextDisplay = 1;
	else
		pViewModel.fNextDisplay = 0;

	if (scCoLib.fDebug) {
		var vThreadOriPath = document.createTextNode("Oripath : "
				+ pViewModel.fRefUri + "@" + pViewModel.fThreadRelativePath);
				
		var vThreadOriPathContainer = scDynUiMgr.addElement("div", pViewModel.fNode);
		if (pViewModel.fDisplay == 0) vThreadOriPathContainer.className = "debugPathFloat";
		else vThreadOriPathContainer.className = "debugPath";
		
		vThreadOriPathContainer.appendChild(vThreadOriPath);
	}
	if (pViewModel.fDisplay == 1) scCommentMgr.Utils.changeHtmlClass(pViewModel.fNode, "collapsed", "open");
	else scCommentMgr.Utils.changeHtmlClass(pViewModel.fNode, "open", "collapsed");
	
	if(pThreadModel.threadClosed) scCommentMgr.Utils.addHtmlClass(pViewModel.fNode, "closed");
	
	var vThreadTools = scDynUiMgr.addElement("div",pViewModel.fNode, "threadTools");
	if (this.fBuildArrow) scDynUiMgr.addElement("div",vThreadTools, "commentArrow");
	
	var vEdit = false;
	for (var k = 0; k < pThreadModel.comments.length; k++){
		if(pThreadModel.comments[k].fEdit){ vEdit = true ; break;}
	}
	
	if(!vEdit){
		if(pPerms.Delete){
			var vDeleteThreadButton = scDynUiMgr.addElement("input",vThreadTools, "deleteThread");
			vDeleteThreadButton.setAttribute("value", scCommentMgr.fStrings[7]);
			vDeleteThreadButton.setAttribute("title", scCommentMgr.fStrings[7]);
			vDeleteThreadButton.setAttribute("type", "button");
			vDeleteThreadButton.setAttribute("onClick", "scCommentMgr.opaleControlsBuilder.prototype.formClosing("
									+ +pRefUriIndex + "," + pThreadIndex + "," + null + ", 'delete'" + ")");
		}
		
		if(pPerms.Close){
			var vValidButton = scDynUiMgr.addElement("input",vThreadTools);
			if(pThreadModel.threadClosed){
				vValidButton.className ="open";
				vValidButton.setAttribute("value", scCommentMgr.fStrings[13]);
				vValidButton.setAttribute("title", scCommentMgr.fStrings[13]);
				vValidButton.setAttribute("onClick","scCommentMgr.opaleControlsBuilder.prototype.formClosing("
				  +pRefUriIndex + "," + pThreadIndex +","+"\"open\""+ ", 'close',"+pIndex+")");
			}
			else{
				vValidButton.className = "close";
				vValidButton.setAttribute("value", scCommentMgr.fStrings[8]);
				vValidButton.setAttribute("title", scCommentMgr.fStrings[8]);
				vValidButton.setAttribute("onClick","scCommentMgr.opaleControlsBuilder.prototype.formClosing("
				  +pRefUriIndex + "," + pThreadIndex +","+"\"close\""+ ", 'close', "+pIndex+")");
			}
			vValidButton.setAttribute("type", "button");
		}
	
	
		// PART 5 Reduce size
		var vButtonSize = scDynUiMgr.addElement("input",vThreadTools);
		vButtonSize.setAttribute("type", "button");
		if (pViewModel.fDisplay == 1) {
			// 5.A Reduce
			vButtonSize.setAttribute("value", scCommentMgr.fStrings[11]);
			vButtonSize.setAttribute("title", scCommentMgr.fStrings[11]);
			vButtonSize.className = "minusButton";
		} else {
			// 5.B Maximize
			vButtonSize.setAttribute("value", scCommentMgr.fStrings[12]);
			vButtonSize.setAttribute("title", scCommentMgr.fStrings[12]);
			vButtonSize.className = "maximButton";
		}
		vButtonSize.setAttribute("onClick", "sc$('"+ pMgr.fContextNodeId
		                + "').mgr.Controller.changeThreadView("
						+ pViewModel.fNextDisplay + "," + pViewModel.fDisplay + ","+ pIndex + ")");
	}
	
	

	
	
	var vPair = false;
	// for each comment of the thread
	for (var k = 0; k < pThreadModel.comments.length; k++) {
		if (vPair) vPair = false;
		else vPair = true;

		var vDivComment = scDynUiMgr.addElement("div",pViewModel.fNode, "comment");
		var vDivCommentInside = scDynUiMgr.addElement("div",vDivComment, "commentInside");

		if (k == 0) scCommentMgr.Utils.addHtmlClass(vDivComment, "first");
		if (vPair) scCommentMgr.Utils.addHtmlClass(vDivComment, "even");
		else scCommentMgr.Utils.addHtmlClass(vDivComment, "odd");
		if (k + 1 == pThreadModel.comments.length) scCommentMgr.Utils.addHtmlClass(vDivComment, "last");
		
		if(!pThreadModel.comments[k].fEdit && !pThreadModel.threadClosed){
			// PART 1 : DIV TOOLS
			var vdivTools = scDynUiMgr.addElement("div",vDivCommentInside, "tools");
			if(pPerms.Update || pPerms.Update_AsCurrentUser && pThreadModel.comments[k].user == scServices.scCommentSvc.fUser ||
			   pThreadModel.comments[k].user == "null" || pThreadModel.comments[k].user == ""){
				
				var vButtonUpdate = scDynUiMgr.addElement("input",vdivTools, "editButton");
				vButtonUpdate.setAttribute("type", "button");
				vButtonUpdate.setAttribute("value", scCommentMgr.fStrings[6]);
				vButtonUpdate.setAttribute("title", scCommentMgr.fStrings[6]);
				vButtonUpdate.setAttribute("onClick",
						"scCommentMgr.opaleControlsBuilder.prototype.formClosing("
								+ +pRefUriIndex + "," + pThreadIndex + "," + k+ ", 'update'" + ")");
			}
			if(pPerms.Delete || pPerms.Delete_AsCurrentUser && pThreadModel.comments[k].user == scServices.scCommentSvc.fUser ||
			   pThreadModel.comments[k].user == "null" || pThreadModel.comments[k].user == ""){
				var vButtonDelete = scDynUiMgr.addElement("input",vdivTools, "deleteButton");
				vButtonDelete.setAttribute("type", "button");
				vButtonDelete.setAttribute("value", scCommentMgr.fStrings[7]);
				vButtonDelete.setAttribute("title", scCommentMgr.fStrings[7]);
				vButtonDelete.setAttribute("onClick",
						"scCommentMgr.opaleControlsBuilder.prototype.formClosing("
								+ +pRefUriIndex + "," + pThreadIndex + ","+ k+ ", 'delete'" + ")");
			}
		}

		// PART 2 META
		var vMetaDiv = scDynUiMgr.addElement("div",vDivCommentInside, "meta");
		if (pThreadModel.comments[k].user != ""	&& pThreadModel.comments[k].user != "null") {
			vMetaDiv.appendChild(document.createTextNode(pThreadModel.comments[k].user + " - "));
		}
		var vMetaCommentTimeStamp = document.createTextNode(scCommentMgr.Utils
				.writeDate(parseInt(pThreadModel.comments[k].creationTime)));
		vMetaDiv.appendChild(vMetaCommentTimeStamp);

		// PART 3 CONTENT
		var vContentDiv = scDynUiMgr.addElement("div",vDivCommentInside, "content");
		var vIsForm = false;
		// 3.1 FORM
		if (pThreadModel.comments[k].fEdit) {
			vIsForm = true;
			scCommentMgr.Utils.addHtmlClass(vDivComment, "edit");
			var vEditForm = scDynUiMgr.addElement("form",vDivCommentInside, "editForm");

			var vEditFormSubmit = scDynUiMgr.addElement("input",vEditForm, "validButton");
			vEditFormSubmit.setAttribute("type", "button");
			vEditFormSubmit.setAttribute("value", scCommentMgr.fStrings[8]);
			vEditFormSubmit.setAttribute("title", scCommentMgr.fStrings[8]);
			vEditFormSubmit.setAttribute("onclick",
							"sc$(\"mgrContainer\").mgr.Controller.editingFormSubmit(scPaLib.findNode(\"des:.editformArea\",document).value);");

			var vEditFormCancel = scDynUiMgr.addElement("input",vEditForm);
			if (pThreadModel.comments[k].fSelect) vEditFormCancel.className = "cancelCreateButton";
			else vEditFormCancel.className = "cancelEditButton";
			vEditFormCancel.setAttribute("type", "button");
			vEditFormCancel.setAttribute("value", scCommentMgr.fStrings[9]);
			vEditFormCancel.setAttribute("title", scCommentMgr.fStrings[9]);
			vEditFormCancel.setAttribute("onclick","sc$(\"mgrContainer\").mgr.Controller.editingFormCancel();");

			var vTextArea =  scDynUiMgr.addElement("textarea",vEditForm, "editformArea");
			vTextArea.fSelect = pThreadModel.comments[k].fSelect;

			vTextArea.appendChild(document.createTextNode(pThreadModel.comments[k].content));

		}
		// 3.2 CLASSIC CONTENT
		else {
			var vCommentContent = scDynUiMgr.addElement("p",vContentDiv);
			vCommentContent.appendChild(document.createTextNode(pThreadModel.comments[k].content));
		}

		if (k == pThreadModel.comments.length - 1) {
			var vBottomDiv = scDynUiMgr.addElement("div",vDivComment.parentNode, "bottom");

			// PART 4 RESPONSE
			if(!vIsForm && pPerms.Respond && pViewModel.fDisplay && !pThreadModel.threadClosed){
				var vButtonRespond = scDynUiMgr.addElement("input",vBottomDiv, "addButton");
				vButtonRespond.setAttribute("type", "button");
				vButtonRespond.setAttribute("value", scCommentMgr.fStrings[10]);
				vButtonRespond.setAttribute("title", scCommentMgr.fStrings[10]);
				vButtonRespond.setAttribute("onClick",
						"scCommentMgr.opaleControlsBuilder.prototype.formClosing("
								+ +pRefUriIndex + "," + pThreadIndex + "," + k+ ",'respond'" + ")");
			}
		}
	}
	return pViewModel.fNode;
}

/**
 * choose between a true removing or thread masking
 */
scCommentMgr.opaleThreadsBuilder.prototype.removeThreads = function() {
	if (this.fFullThreadRemoving)
		this.resetThreads();
	else
		this.maskThreads();
}

// //////////////////////////////////////////////////////
// Internal //
// //////////////////////////////////////////////////////
/**
 * add scDeletedComment class to thread div
 */
scCommentMgr.opaleThreadsBuilder.prototype.maskThreads = function() {
	var vThreads = scPaLib.findNodes("des:.thread", document);
	for (var i = 0; i < vThreads.length; i++) {
		scCommentMgr.Utils.addHtmlClass(vThreads[i], "scDeletedComment");
	}
}

/**
 * full thread removing before build thread.
 */
scCommentMgr.opaleThreadsBuilder.prototype.initThreadBuilding = function() {
	if (!this.fFullThreadRemoving)
		this.resetThreads();
}

/**
 * delete all html threads
 */
scCommentMgr.opaleThreadsBuilder.prototype.resetThreads = function() {

	var vContainers = scPaLib.findNodes("des:.commentContainer", document);
	for (var i = 0; i < vContainers.length; i++) {
		while (vContainers[i].hasChildNodes()) {
			vContainers[i].removeChild(vContainers[i].firstChild);
		}
		// vContainers[i].style.height = "";
	}

	var vTab = scPaLib.findNodes("des:.scCommented", document);
	for (var i = 0; i < vTab.length; i++) {
		scCommentMgr.Utils.removeHtmlClass(vTab[i], "scCommented");
		scCommentMgr.Utils.removeHtmlClass(vTab[i], "scCommentMulti");
	}
}

scCommentMgr.opaleThreadsBuilder.prototype.selectText = function() {
	var vTextArea = scPaLib.findNode("des:.editformArea", document);
	if (vTextArea) {
		vTextArea.focus();
		if (vTextArea.fSelect)
			vTextArea.select();
	}
}

scCommentMgr.opaleThreadsBuilder.prototype.initEvents = function() {

	var vContainers = scPaLib.findNodes("des:.commentContainer", document);
	for (var i = 0; i < vContainers.length; i++) {
		vContainers[i].onmouseover = function(event) {
			scCommentMgr.scCommentWidgets.threadBuilder.getBuilder(0).onOver(this);
			event = event || window.event;
			event.cancelBubble = true;
			if (event.stopPropagation)
				event.stopPropagation();
		}
		vContainers[i].onmouseout = function(event) {
			scCommentMgr.scCommentWidgets.controlsBuilder.getBuilder(0).resetOver();
			event = event || window.event;
			event.cancelBubble = true;
			if (event.stopPropagation)
				event.stopPropagation();
		}
	}
}

scCommentMgr.opaleThreadsBuilder.prototype.onOver = function(pCommentContainer) {

	scCommentMgr.scCommentWidgets.controlsBuilder.getBuilder(0).resetOver();

	scCommentMgr.Utils.addHtmlClass(
			sc$("mgrContainer").mgr.Controller.fControlOriPathList
					.getOripathObject(pCommentContainer).fNode, "hover");

}
	/**
	 * opaleThreadsBuilder param description
	 * 
	 * @param {Bool}
	 *            pComputeVerticalPosition use generic algorithm for computing
	 *            vertical position if true
	 * @param {Bool}
	 *            pCommentOnTheSide compute a vertical position at the same
	 *            y-level than content if true
	 * @param {Bool}
	 *            pComputeSideCommentFrontOfAnchor compute vertical position at
	 *            the same y-level than linked anchor
	 * @param {Bool}
	 *            pTrueInsertion add commentContener inside the HTML node of the
	 *            content if true. Otherwise, insertion used use absolute CSS
	 *            rules.
	 * @param {Bool}
	 *            pInsertBefore In case of comment insertion, insert before the
	 *            anchor node
	 * @param {Bool}
	 *            pInsertResizerInContent Allow generic algorithm to insert
	 *            blank div into the content (needed if "false" insertion or
	 *            comment on the side)
	 * @param {Bool}
	 *            pAlwaysInsertResier Force div resizer insertion, even when
	 *            nothing follow the comment Anchor
	 * @param {Bool}
	 *            pLimitControllerSize insert a div.cache in the
	 *            commentAnchorContener if threads cover an other
	 *            commentAnchorContener
	 * @param {Bool}
	 *            pBuildArrow insert a div.arrow in thread
	 * @param {Bool}
	 *            pDefaultDisplayOpen control the default thread building true =>
	 *            open false => closed
	 * @param {Bool}
	 *            pFullThreadRemoving control thre thread removing method true =>
	 *            html is deleted each time than comment mode is off false =>
	 *            html is deleted only before threads rebuilding
	 */
scCommentMgr.opaleThreadsContext = function(){
	return {
		fComputeVerticalPosition : false,
		fCommentOnTheSide : false,
		fComputeSideCommentFrontOfAnchor : false,
		fTrueInsertion : true,
		fInsertBefore : false,
		fInsertResizerInContent :true,
		fAlwaysInsertResier :true,
		fLimitControllerSize :false,
		fBuildArrow : false,
		fDefaultDisplayOpen : true,
		fFullThreadRemoving : false
	};
}

	/**
	 * opaleControlsBuilder param
	 * 
	 * @param {Bool}
	 *            pInsertOnClick Insert comment with "onClick" event
	 */
scCommentMgr.opaleControlsContext = function(){
	return {
		fInsertOnClick : true
	};
}
/**
 * scCommentMgr.scCommentWidgets JS namespace which handle Widgets declaration.
 * There is two kinds of widgets : controls builder which handles comment
 * insertion form and threads y-position computing ; threads builder which
 * handles comment thread HTML view and comment controls.
 * 
 */
scCommentMgr.scCommentWidgets = {
	/**
	 * Declaration of threadbuilders widgets. For each line : ["mgrId",
	 * "checkMethod", "arg1", ["arg2"], widget (could be null to exclude
	 * selected nodes] check method should be : - cn : scPaLib.checkNode (only
	 * one arg) - fn : scPaLib.findNode (two args) - fns : scPaLib.findNodes
	 * (two args)
	 */
	threadBuilder : [
		["mgrContainer","cn","",new scCommentMgr.opaleThreadsBuilder(scCommentMgr.opaleThreadsContext())],
		["mgrContainer","cn", ".bib_genRef", null],
		["mgrContainer","cn", ".ref_genRef", null],
		["mgrContainer","cn", ".glos_genRef", null],
		["mgrContainer","cn", ".acr_genRef", null],
		["mgrContainer","cn", ".decoCourseUa", null],
		["mgrContainer","fns", "cde:#tplIco/cde:", null]
	],
	/**
	 * Declaration of controlsbuilders widgets. For each line : ["mgrId",
	 * "checkMethod", "arg1", ["arg2"], widget (could be null to exclude
	 * selected nodes] check method should be : - cn : scPaLib.checkNode (only
	 * one arg) - fn : scPaLib.findNode (two args) - fns : scPaLib.findNodes
	 * (two args)
	 */
	
	controlsBuilder : [
		["mgrContainer", "cn", "", new scCommentMgr.opaleControlsBuilder(scCommentMgr.opaleControlsContext())],
		["mgrContainer","cn", ".bib_genRef", null],
		["mgrContainer","cn", ".ref_genRef", null],
		["mgrContainer","cn", ".glos_genRef", null],
		["mgrContainer","cn", ".acr_genRef", null],
		["mgrContainer","cn", ".decoCourseUa", null],
		["mgrContainer","fns", "cde:#tplIco/cde:", null]
	],
	/**
	 * Overload the association mode between a comment ant its anchor.
	 * Default: leaf (first ancestor is matched)
	 * possible values :
	 *  - node  (father only)
	 *  - nodeX (where x is a numeric value. Ancestor of X level. 
	 *           ex: node2 -> grand father
	 *               node3 -> grand grand father
	 */
	overloadAnchorMode : [["cn", ".mainContent", "node2"]],

/**
	 * Default comment insertion mode is next to the commented html element.
	 * This function is called to overload this behavior.
	 * 
	 * return true if the comment has to be inserted as a child of commented html element.
	 */
	insertFirst : function(pNode){
		return scPaLib.checkNode("div.expUcDiv", pNode) || scPaLib.checkNode("div.mainContent", pNode);
	},

	/**
	 * get a thread builder from Node and mgrId
	 * 
	 * @param {DOM
	 *            element} pNode
	 * @param {string}
	 *            pMgrId
	 * @return {scCommentMgr.XXXThreadBuilder}
	 */
	
	getThreadBuilder : function(pNode, pMgrId) {
		try{
			var vThreadBuilder = null;
	
			for (var j = 0; j < this.threadBuilder.length; j++) {
				if (pMgrId == this.threadBuilder[j][0])
					switch (this.threadBuilder[j][1]) {
						case "cn" :
							if (scPaLib.checkNode(this.threadBuilder[j][2], pNode))
								vThreadBuilder = this.threadBuilder[j][3];
							break;
	
						case "fn" :
							var vNode = scPaLib.findNode(this.threadBuilder[j][2],
									this.threadBuilder[j][3]);
							if (pNode == vNode)
								vThreadBuilder = this.threadBuilder[j][4];
							break;
	
						case "fns" :
							var vNodes = scPaLib.findNodes(
									this.threadBuilder[j][2],
									this.threadBuilder[j][3]);
							for (var k = 0; k < vNodes.length; k++)
								if (vNodes[k] == pNode)
									vThreadBuilder = this.threadBuilder[j][4];
							break;
						
						case "custom" : 
							if(this.threadBuilder[j][2](this.threadBuilder[j][3]))
								vThreadBuilder = this.threadBuilder[j][4];
							break;
					}
			}
			return vThreadBuilder;
		}
		catch(e){ scCoLib.util.log(e.message);}
	},
	/**
	 * get a controls builder from Node and mgrId
	 * 
	 * @param {DOM
	 *            element} pNode
	 * @param {string}
	 *            pMgrId
	 * @return {scCommentMgr.XXXControlsBuilder}
	 */
	getControlsBuilder : function(pNode, pMgrId) {
		try{
			var vControlsBuilder = null;
	
			for (var j = 0; j < this.controlsBuilder.length; j++) {
				if (pMgrId == this.controlsBuilder[j][0])
					switch (this.controlsBuilder[j][1]) {
						case "cn" :
							if (scPaLib
									.checkNode(this.controlsBuilder[j][2], pNode))
								vControlsBuilder = this.controlsBuilder[j][3];
							break;
	
						case "fn" :
							var vNode = scPaLib.findNode(
									this.controlsBuilder[j][2],
									this.controlsBuilder[j][3]);
							if (pNode == vNode)
								vControlsBuilder = this.controlsBuilder[j][4];
							break;
	
						case "fns" :
							var vNodes = scPaLib.findNodes(
									this.controlsBuilder[j][2],
									this.controlsBuilder[j][3]);
							for (var k = 0; k < vNodes.length; k++)
								if (vNodes[k] == pNode)
									vControlsBuilder = this.controlsBuilder[j][4];
							break;
						
						case "custom" : 
							if(this.threadBuilder[j][2](this.threadBuilder[j][3]))
								vThreadBuilder = this.threadBuilder[j][4];
							break;
					}
			}
			return vControlsBuilder;
		}
		catch(e){ scCoLib.util.log(e.message);}
	},
	/**
	 * Broadcast pEvent to all widgets of pSenderManager
	 * 
	 * @param {string}
	 *            pEvent
	 * @param {string}
	 *            pSenderManager Id of the manager
	 */
	broadcastEvent : function(pEvent, pSenderManager) {

		for (var i = 0; i < this.threadBuilder.length; i++) {
			if ((pSenderManager == this.threadBuilder[i][0] || !pSenderManager)
					&& this.threadBuilder[i][this.threadBuilder[i].length - 1])
				this.threadBuilder[i][this.threadBuilder[i].length - 1]
						.event(pEvent);
		}

		for (var i = 0; i < this.controlsBuilder.length; i++) {
			if ((pSenderManager == this.controlsBuilder[i][0] || !pSenderManager)
					&& this.controlsBuilder[i][this.controlsBuilder[i].length - 1])
				this.controlsBuilder[i][this.controlsBuilder[i].length - 1].event(pEvent);
		}
	},
	getAnchorMode : function(pNode){
		try{
		
			for (var j = 0; j < this.overloadAnchorMode.length; j++) {
				switch (this.overloadAnchorMode[j][0]) {
					case "cn" :
						if (scPaLib.checkNode(this.overloadAnchorMode[j][1], pNode))
							return this.overloadAnchorMode[j][2];
						break;
		
					case "fn" :
						var vNode = scPaLib.findNode(this.overloadAnchorMode[j][1],
								this.overloadAnchorMode[j][2]);
						if (pNode == vNode)
							return this.overloadAnchorMode[j][3];
						break;
		
					case "fns" :
						var vNodes = scPaLib.findNodes(
								this.overloadAnchorMode[j][1],
								this.overloadAnchorMode[j][2]);
						for (var k = 0; k < vNodes.length; k++)
							if (vNodes[k] == pNode)
								return this.overloadAnchorMode[j][3];
						break;
					
					case "custom" : 
						if(this.threadBuilder[j][2](this.threadBuilder[j][3]))
							vThreadBuilder = this.threadBuilder[j][4];
						break;
				}
			}
		}
		catch(e){ scCoLib.util.log(e.message);}
	}
}


scCommentMgr.scCommentWidgets.controlsBuilder.getBuilder = function(i){
	if(this[i][1] == "cn") return this[i][3];
	else return this[i][4];
}

scCommentMgr.scCommentWidgets.threadBuilder.getBuilder = function(i){
	if(this[i][1] == "cn") return this[i][3];
	else return this[i][4];
}

scCommentMgr.Controller.prototype.deleteCommentWithSleep1 = function(
		pRefUriNumber, pThreadNumber, pCommentNumber) {
	var vConfirm = window.confirm(scCommentMgr.fStrings[3]);
	if (vConfirm) {

		var vMgr = sc$('mgrContainer').mgr;
		var vRefUri = vMgr.Model.getThreadRefUri(pRefUriNumber);
		var vThreadRelativePath = vMgr.Model.getThreadRelativePath(
				pRefUriNumber, pThreadNumber);

		var vThread = vMgr.View.fThreadTable.getThread(vRefUri,
				vThreadRelativePath);
		
		this.temp_oripath = vRefUri.replace("@", "\\@") + "@" + vThreadRelativePath;
		if(pCommentNumber != null)
			this.temp_oripath += "@" + pCommentNumber;
		this.temp_timeStamp = this.fParent.Model.fThreads[pRefUriNumber].syncTimeStamp;

		scCommentMgr.scCommentWidgets.broadcastEvent("Delete");
		if (this.fReverseRequest) {
			this.fParent.Model.updateModel(this.fReverseRequest);
			this.loadThreads(this.fParent.Model.fThreads);
		}

		this.fParent.Model.removeCommentEditingForm();
		this.fReverseRequest = null;
		if(pCommentNumber != null){
			if (this.fParent.Model.fThreads[pRefUriNumber].threads[pThreadNumber].comments.length == 1) {
				this.fFullDelete = true;
				scCommentMgr.Utils.addHtmlClass(scPaLib.findNodes("chi:.comment",
								vThread)[pCommentNumber], "toDelete");
			} else {
				this.fFullDelete = false;
				scCommentMgr.Utils.addHtmlClass(scPaLib.findNodes("chi:.comment",
								vThread)[pCommentNumber], "toDelete");
			}
		}
		else {
			scCommentMgr.Utils.addHtmlClass(vThread, "toDelete");
		}
		setTimeout(this.deleteCommentWithSleep2, 300);

	}
}

scCommentMgr.Controller.prototype.deleteCommentWithSleep2 = function() {
	var vMgr = sc$('mgrContainer').mgr
	scServices.scCommentSvc.fCurrentMgr = vMgr;
	scServices.scCommentSvc.sendRequest("Delete", vMgr.Controller.temp_oripath,
	vMgr.Controller.temp_timeStamp,
			vMgr.getXPaths(), vMgr.getXPathsNS());
}
