/**
 * LICENCE[[
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1/CeCILL 2.O
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is kelis.fr code.
 *
 * The Initial Developer of the Original Code is 
 * samuel.monsarrat@kelis.fr
 *
 * Portions created by the Initial Developer are Copyright (C) 2008
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * or the CeCILL Licence Version 2.0 (http://www.cecill.info/licences.en.html),
 * in which case the provisions of the GPL, the LGPL or the CeCILL are applicable
 * instead of those above. If you wish to allow use of your version of this file
 * only under the terms of either the GPL, the LGPL or the CeCILL, and not to allow
 * others to use your version of this file under the terms of the MPL, indicate
 * your decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL, the LGPL or the CeCILL. If you do not
 * delete the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL, the LGPL or the CeCILL.
 * ]]LICENCE
 */

/**
 * History manager.
 */
function histMgr() {
	this.fHst = new Object();   // History data object
	this.fHst.sk = new Array(); // History stack
	this.fHst.pt = 0;           // Pointer to current page
	this.fHst.md = "";          // Init mode (normal or subsequent to next or back)
	if (scServices.storage.isStorageActive()){
		this.fHstIdx = scServices.storage.getRootKey()+"nav_hist";
		var vHistItem = scServices.storage.getItem(this.fHstIdx);
		if(vHistItem) {
			this.xSetHst(scServices.dataUtil.deserialiseObjJs(vHistItem));
		}
	}
}
/**
 * histMgr.init() - Init : add current page to history.
 * @param pIncludeInNav : Flag, include the URL in navigation (back() & next()).
 */
histMgr.prototype.init = function(pIncludeInNav) {
	if (this.fHst.md == "") this.add(window.location.href, pIncludeInNav);
	this.fHst.md = "";
	this.xSave();
}

/**
 * histMgr.add() - Add current page to history.
 * If the pointer is not at the end of the stack then reorganize the stack
 * @param pUrl : URL to add.
 * @param pIncludeInNav : Flag, include the URL in navigation (back() & next()).
 */
histMgr.prototype.add = function(pUrl, pIncludeInNav) {
	var vEntry = new Object();
	vEntry.lk = pUrl;
	vEntry.nv = pIncludeInNav;
	if (this.fHst.sk.length == 0 || pUrl != this.fHst.sk[this.fHst.sk.length-1]){
		if (this.fHst.sk.length == 0 || this.fHst.pt == this.fHst.sk.length-1){
			this.fHst.sk[this.fHst.sk.length] = vEntry;
		} else {
			var vBaseHist = this.fHst.sk.slice(0,this.fHst.pt);
			var vNewHist = vBaseHist.concat(this.fHst.sk.slice(this.fHst.pt,this.fHst.sk.length).reverse(),vEntry);
			this.fHst.sk = vNewHist;
		}
		this.fHst.pt = this.fHst.sk.length - 1;
		this.fHst.md = "";
	}
}

/**
 * histMgr.back() - Set history manager for moving back one page.
 * @returns URL of page to move to.
 */
histMgr.prototype.back = function() {
	if (this.hasBack()){
		this.fHst.md = "b";
		this.fHst.pt--;
		while (!this.fHst.sk[this.fHst.pt].nv) this.fHst.pt--;
		this.xSave();
		return this.fHst.sk[this.fHst.pt].lk;
	}
}

/**
 * histMgr.next() - Set history manager for moving foward one page.
 * @returns URL of page to move to.
 */
histMgr.prototype.next = function() {
	if (this.hasNext()){
		this.fHst.md = "n";
		this.fHst.pt++;
		while (!this.fHst.sk[this.fHst.pt].nv) this.fHst.pt++;
		this.xSave();
		return this.fHst.sk[this.fHst.pt].lk;
	}
}

/**
 * histMgr.hasNext() - determines if a next page is available.
 * @returns true if next page available.
 */
histMgr.prototype.hasNext = function() {
	if (this.fHst.pt >= this.fHst.sk.length-1) return false;
	for (var i = this.fHst.pt+1; i < this.fHst.sk.length; i++) if (this.fHst.sk[i].nv) return true;
	return false;
}

/**
 * histMgr.hasBack() - determines if a previous page is available.
 * @returns true if previous page available.
 */
histMgr.prototype.hasBack = function() {
	if (this.fHst.pt <= 0) return false;
	for (var i = this.fHst.pt-1; i >= 0; i--) if (this.fHst.sk[i].nv) return true;
	return false;
}

/**
 * histMgr.isInHistory() - determines if a given URL is in the stack.
 * @param pUrl : URL to check.
 * @returns true if URL is in the stack.
 */
histMgr.prototype.isInHistory = function(pUrl) {
	var vFound = false;
	for (var i in this.fHst.sk) {
		if (this.fHst.sk[i].lk == pUrl) {
			vFound = true;
			break;
		}
	}
	return vFound;
}

/**
 * histMgr.xSave() - Saves the history data using the storage API.
 */
histMgr.prototype.xSave = function() {
	 if(scServices.storage.isStorageActive()) scServices.storage.setItem(this.fHstIdx, scServices.dataUtil.serialiseObjJs(this.xGetHst()));
}

/**
 * histMgr.xSetHst() - Loads history data.
 * @param pHst : history data object to load (stack as tokenisable string).
 */
histMgr.prototype.xSetHst = function(pHst) {
	var vSk = pHst.sk.split("|");
	for (var i in vSk) {
		vSk[i] = scServices.dataUtil.deserialiseObjJs(vSk[i]);
		vSk[i].nv = vSk[i].nv == "true";
	}
	this.fHst.sk = vSk;
	this.fHst.pt = pHst.pt;
	this.fHst.md = pHst.md;
}

/**
 * histMgr.xGetHst() - Retreive a history data object with a joined stack.
 * @returns history data object.
 */
histMgr.prototype.xGetHst = function() {
	var vHst = new Object();
	vHst.sk = new Array();
	for (var i in this.fHst.sk) vHst.sk[i] = scServices.dataUtil.serialiseObjJs(this.fHst.sk[i]);
	vHst.sk = vHst.sk.join("|");
	vHst.pt = this.fHst.pt;
	vHst.md = this.fHst.md;
	return vHst;
}

