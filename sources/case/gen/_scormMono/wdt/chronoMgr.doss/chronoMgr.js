/* === chrono manager =============================================== */
var chronoMgr = {
	fDefaultInactivityTime : 5, /*Temps d'inactivité avant terminate. En minutes*/
	fTimeToShowChrono : 1, /*Temps restant avant affichage du chrono. En minutes*/
	fRemainingTime : new Date(),
	fAnchorPath : "ide:tplTop",
	fChronoCls : "chrono",
	
	
	/** init function - must be called at the end of page body */
	init : function(){
		if(!(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active() || scServices.scorm12 && scServices.scorm12.isScorm12Active()) || this.fInactivityTime == 0) return;
		this.fChronoElt = this.xAddElt("span", scPaLib.findNode(this.fAnchorPath), this.fChronoCls, null, null, null);
		if (!this.fInactivityTime) var vTime = this.fDefaultInactivityTime;
		else var vTime = this.fInactivityTime;
		this.xCountInactivity(vTime);
		this.xAddEvent(window, 'click', function(){chronoMgr.xCountInactivity(vTime)}, false);
		this.xAddEvent(window, 'mousemove', function(){chronoMgr.xCountInactivity(vTime)}, false);
	},
	xCountInactivity : function(pTime) {
		chronoMgr.fMaxTimeAllowed = pTime*60000;
		this.fStartTime = new Date().getTime();
		this.xChronoExec();
		this.fTimer = window.setInterval("chronoMgr.xChronoExec()", 200);	
	},
	xChronoExec : function() {
		var vPassedTime = new Date().getTime() - this.fStartTime;
		this.fRemainingTime.setTime(chronoMgr.fMaxTimeAllowed - vPassedTime);
		if(this.fRemainingTime.getTime() > 0) {
			if (this.fRemainingTime.getTime() < this.fTimeToShowChrono*60000) this.fChronoElt.innerHTML = this.xFormatTime(this.fRemainingTime);
			else this.fChronoElt.innerHTML = "";
		} else {
			window.clearInterval(this.fTimer);
			scServices.exitModeStorage.terminate("suspend");
		}
	},
	/** tools ***************************************************************/
	xAddEvent : function(elt, event, fctn, capture) {
		return document.addEventListener ? elt.addEventListener(event, fctn, capture): elt.attachEvent ? elt.attachEvent('on' + event, fctn): false;
	},
	xFormatTime : function(pTime,pFormat) {
		var vH = pTime.getUTCHours();
		var vM = pTime.getUTCMinutes();
		var vS = pTime.getUTCSeconds();
		if(!pFormat) var vStr = (vH > 0 ? (vH > 9 ? "" : "0") + vH + ":" : "") + (vM > 9 ? "" : "0") + vM + (vS > 9 ? ":" : ":0") + vS;
		else var vStr = (vH > 0 ? (vH > 9 ? "" : "0") + vH + " heures " : "") + (vM > 0 ? (vM > 9 ? "" : "0") + vM + " minutes " : "") + (vS > 0 ? (vS > 9 ? "" : "0") + vS + " secondes " : "");
		return(vStr);
	},
	xAddElt : function(pName, pParent, pClassName, pNoDisplay, pHidden, pNxtSib){
		var vElt;
		if(scCoLib.isIE && pName.toLowerCase() == "iframe") {
			//BUG IE : impossible de masquer les bordures si on ajoute l'iframe via l'API DOM.
			var vFrmHolder = pParent.ownerDocument.createElement("div");
			if (pNxtSib) pParent.insertBefore(vFrmHolder,pNxtSib)
			else pParent.appendChild(vFrmHolder);
			vFrmHolder.innerHTML = "<iframe scrolling='no' frameborder='0'></iframe>";
			vElt = vFrmHolder.firstChild;
		} else {
			vElt = pParent.ownerDocument.createElement(pName);
			if (pNxtSib) pParent.insertBefore(vElt,pNxtSib)
			else pParent.appendChild(vElt);
		}
		if (pClassName) vElt.className = pClassName;
		if (pNoDisplay) vElt.style.display = "none";
		if (pHidden) vElt.style.visibility = "hidden";
		return vElt;
	},
	loadSortKey : "AZ"
}
