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
 * Portions created by the Initial Developer are Copyright (C) 2010-2012 the
 * Initial Developer. All Rights Reserved.
 * 
 * Contributor(s):
 * 
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"), or
 * the CeCILL Licence Version 2.0 (http://www.cecill.info/licences.en.html), in
 * which case the provisions of the GPL, the LGPL or the CeCILL are applicable
 * instead of those above. If you wish to allow use of your version of this file
 * only under the terms of either the GPL, the LGPL or the CeCILL, and not to
 * allow others to use your version of this file under the terms of the MPL,
 * indicate your decision by deleting the provisions above and replace them with
 * the notice and other provisions required by the GPL, the LGPL or the CeCILL.
 * If you do not delete the provisions above, a recipient may use your version
 * of this file under the terms of any one of the MPL, the GPL, the LGPL or the
 * CeCILL. ]]LICENCE
 */

/**
 * CommentSvc JS namespace wich contains client side functions. CommentSvc
 * should be declared only once in a template.
 * @namespace
 * 
 */
scServices.scCommentSvc = {

	/**
	 * request code to send
	 * 
	 * @type {string}
	 */
	fRequest : null,
	/**
	 * oripath param to send
	 * 
	 * @type {string}
	 */
	fOriPathStr : null,
	/**
	 * text param to send
	 * 
	 * @type {string}
	 */
	fText : null,
	
	fUnencodedText : null,

	/**
	 * XPath param to send for comment excluding
	 * 
	 * @type {string}
	 */
	fXPath : null,

	/**
	 * XML namespace of the model to send in order to resolve XPATH on server
	 * side
	 * 
	 * @type {string}
	 */
	fXPathNS : null,
	
	fTimeStamps : null,
	
	fInit : false,

	/**
	 * current client mgr
	 * 
	 * @type {scCommentMgr.Mgr}
	 */
	fCurrentMgr : null,
	
	/**
	 * local access to the scCommentMgr namespace.
	 */
	scCommentMgr : null,
	
	fUser : null,
	
	setScCommentMgr : function(pScCommentMgr){
		this.scCommentMgr = pScCommentMgr;
	},

	/**
	 * Init all args before a request. Must be used before a call of
	 * sendRequest() without args
	 * 
	 * @param {string}
	 *            pRequest cdAction
	 * @param {string}
	 *            pOriPathStr Refuris for List or Sync. Full oripath else.
	 * 
	 * @param {string}
	 *            pXPath XPath to exclude
	 * @param {string}
	 *            pXPathNS XML NS of the targuetted model
	 * @param {string}
	 *            pText Text of the comment to send
	 * 
	 * @return nothing
	 */
	prepareRequest : function(pRequest, pOriPathStr, pTimeStamps, pXPath, pXPathNS, pText) {
		//scCoLib.util.log("function : scServices.scCommentSvc.prepareRequest("+ pRequest + ", " + pOriPathStr + ", " + pXPath	+ ", " + pXPathNS + ", " + pText + ")");
		
		if (pRequest) this.fRequest = encodeURIComponent(pRequest);
		if (pOriPathStr) this.fOriPathStr = encodeURIComponent(pOriPathStr);
		if (pText) this.fUnencodedText = pText;
		if (pXPath) this.fXPath = encodeURIComponent(pXPath);
		if (pXPathNS)this.fXPathNS = encodeURIComponent(pXPathNS); 
		if (pTimeStamps)this.fTimeStamps = encodeURIComponent(pTimeStamps);
	},

	/**
	 * Init text args
	 * 
	 * @param {string}
	 *            pText
	 * @return nothing
	 */
	setText : function(pText) {
		//scCoLib.util.log("function : scServices.scCommentSvc.sendText("+ pText + ")");
		this.fUnencodedText = pText;
	},

	/**
	 * Send a request to the server. Call currentMgr with the server response.
	 * If all args was previously initialised by prepareRequest(), sendRequest()
	 * can be used without args.
	 * 
	 * @param {string}
	 *            pRequest cdAction
	 * 
	 * @param {string}
	 *            pOriPathStr in case of add/update/delete/close/response the
	 *            oripath as String. In case of list or sync the list URI as
	 *            String
	 * @param {string}
	 *            pXPath XPath to exclude
	 * @param {string}
	 *            pXPathNS XML NS of the targuetted model
	 * @param {string}
	 *            pText facultative
	 */
	sendRequest : function(pRequest, pOriPathStr, pTimeStamps, pXPath, pXPathNS, pText) {
		//scCoLib.util.log("function : scServices.scCommentSvc.sendRequest(" + pRequest + ", " + pOriPathStr + ", " + pXPath + ", "+ pXPathNS + ", " + pText + ")");
		
		if (pRequest) this.fRequest = encodeURIComponent(pRequest);
		if (pOriPathStr) this.fOriPathStr = encodeURIComponent(pOriPathStr);
		if (pText) this.fUnencodedText = pText;
		if (pXPath) this.fXPath = encodeURIComponent(pXPath);
		if (pXPathNS)this.fXPathNS = encodeURIComponent(pXPathNS); 
		if (pTimeStamps)this.fTimeStamps = encodeURIComponent(pTimeStamps);
		
		this.fText = encodeURIComponent(this.scCommentMgr.Utils.escapeComment(this.fUnencodedText));
		
		// Request handling
		//sc4.0 AND sc4.1 compliant.
		var vExp = /(.*\/u\/)itemDynGen\/(.+?)\/.*/;
		var vTable = vExp.exec(location.pathname);
		var vURL = vTable[1] + "comment?param=" + vTable[2] + '&cdaction=' + this.fRequest;

		switch (this.fRequest) {
			case 'List' :
				vURL += '&RefUris=' + this.fOriPathStr + '&ExcludeXPathNS='
						+ this.fXPathNS + '&ExcludeXPath=' + this.fXPath;
				if(this.fTimeStamps) vURL += '&TimeStamps='+this.fTimeStamps;
				break;

			case 'Create' :
				vURL += '&OriPath=' + this.fOriPathStr + '&Text=' + this.fText
						+ '&TimeStamps=' + this.fTimeStamps
						+ '&ExcludeXPathNS=' + this.fXPathNS + '&ExcludeXPath='
						+ this.fXPath;
				break;

			case 'Update' :
				vURL += '&OriPath=' + this.fOriPathStr + '&Text=' + this.fText
						+ '&TimeStamps=' + this.fTimeStamps
						+ '&ExcludeXPathNS=' + this.fXPathNS + '&ExcludeXPath='
						+ this.fXPath;
				break;

			case 'Respond' :
				vURL += '&OriPath=' + this.fOriPathStr + '&Text=' + this.fText
						+ '&TimeStamps=' + this.fTimeStamps
						+ '&ExcludeXPathNS=' + this.fXPathNS + '&ExcludeXPath='
						+ this.fXPath;
				;
				break;

			case 'Delete' :
				vURL += '&OriPath=' + this.fOriPathStr + '&TimeStamps='
						+ this.fTimeStamps;
				;
				break;

			case 'Close' :
				vURL += '&OriPath=' + this.fOriPathStr + '&TimeStamps='
						+ this.fTimeStamps;
				;
				break;
		}
		//if foripath is init. Else, does not send request.
		if(this.fOriPathStr){
			var vReq = this.getHttpRequest();
			vReq.open("GET", vURL, false);
			vReq.send();
			var vError = false;
			try{
				var vAnswer = this.deserialiseObjJs(vReq.responseText);
				this.fUser = vAnswer.user;
				
				this.fCurrentMgr.update(vAnswer.synchronizedResponse, vAnswer.threadArray, vAnswer.permArray, vAnswer.requestTimeStamp);
				
				if(!vAnswer.synchronizedResponse && this.fInit) throw {error:"synchro", message:this.scCommentMgr.fStrings[14]};
				if(!vAnswer.hasPermission) throw {error:"perm", message:this.scCommentMgr.fStrings[15]};
				
				if(!this.fInit) this.fInit = true ;
			}
			catch(e){
				switch(e.error){
					case "synchro" :
						var vText = e.message+" "+this.scCommentMgr.fStrings[16]+"\n";
						if (this.fRequest == "Update" || this.fRequest == "Create"){
							vText += this.scCommentMgr.fStrings[17]+" ";	
							this.fCurrentMgr.fStore.set("scCommentContent", this.fUnencodedText);
						}
						vText += this.scCommentMgr.fStrings[18];
					break;
					
					case "perm" :
						var vText = e.message+"\n";
						if (this.fRequest == "Update" || this.fRequest == "Create"){
							scServices.scCommentSvc += this.scCommentMgr.fStrings[17]+" ";	
							this.fCurrentMgr.fStore.set("scCommentContent", this.fUnencodedText);
						}
						vText += this.scCommentMgr.fStrings[19];
					break;	
					
					default:
						var vText = this.scCommentMgr.fStrings[20] +" ";
						if (this.fRequest == "Update" || this.fRequest == "Create"){
							vText += this.scCommentMgr.fStrings[17]+" ";	
							this.fCurrentMgr.fStore.set("scCommentContent", this.fUnencodedText);
						}
						vText += this.scCommentMgr.fStrings[21];
						if(scCoLib.fDebug){
						vText+="\n\n ************ DEBUG ************ "
						+ "\n" + e
						+ "\n\n" + vReq.responseText
						+ "\n\n*******************************";
						}
					break;
				}
				alert(vText);
			}
			
		}
	},

	// //////////////////////////////////////////////////////
	// Internal //
	// //////////////////////////////////////////////////////

	/**
	 * Deserialise JSON string
	 * 
	 * @param {string}
	 *            pStr JSON string
	 * @return {object} deserialised object
	 */
	deserialiseObjJs : function(pString){
		if(!pString) return {};
		try{
			return JSON.parse(pString);
		} catch(e){ // TODO: purge when IE7 not supported
			var vVal;
			eval("vVal="+pString);
			return vVal;
		}
	},

	/**
	 * build an httpRequest object. IE friendly
	 * 
	 * @return {XMLHttpRequest}
	 */
	getHttpRequest : function() {
		if ("XMLHttpRequest" in window && (!window.location.protocol == "file:" || !("ActiveXObject" in window))) return new XMLHttpRequest();
		else if ("ActiveXObject" in window) return new ActiveXObject("Microsoft.XMLHTTP");
	}
}
