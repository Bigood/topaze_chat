var tplMgr = {
	fAssmntMaxTry: null,
	subWinSearch:null,
	fRequiredIndex:null,
	fLftPath : "ide:tplLft",
	fLftWidthDelta : 150,
	fRgtPath : "ide:tplRgt",
	fRgtCoPath : "des:.rgtCo",
	fRgtWidthDelta : 200,
	fRgtWidthDeltaMax : 400,
	fRgtWidthDeltaMin : 100,
	fRgtWidthInc : 50,
	fRgtInnerWidthDelta : 0,
	fCbkPath : "des:.cbkClosed",
	fMainPath : "ide:tplMain",
	fArcPath : "ide:tplArc",
	fCoachPath : "coachBk",
	fBtnNextPath : "ide:nextBtn",
	fBtnBackPath : "ide:backBtn",
	fQuizBkPath : "des:.quizBk",
	fQuizBtnValidPath : "des:a.btnValid",
	fQuizResultPath : "des:div.quizResult",
	fQuizArcBkPath : "des:div.arcBk",
	fQuizBtnStartPath : "des:a.btnStart",
	fQuizBtnResultsPath : "des:a.btnResults",
	fQuizBkExplanationPath : "des:div.explanationBk",

	fNoArcFilter : ".noArcFra",
	fMcqArcFilter : ".mcqArcFra",
	fHasSubNavFilter : ".hasSubNav",
	fArcContentPath : "des:.arcIntro|.arcTrans",
	fBarClsPre : "bar",
	fEnLnkClass : "enabled_entry",
	fDisLnkClass : "disabled_entry",
	fStrings : ["￼Tout afficher￼","￼Pas à pas￼",
	/*02*/      "￼Afficher tous les exercices.￼","￼Afficher les exercices un à un.￼",
	/*04*/      "￼Veuillez remplir le(s) champ(s) obligatoires pour continuer￼","￼Fermer￼",
	/*06*/      "￼Suivant￼","￼Question suivante.￼",
	/*08*/      "￼Suite￼","￼Lire la suite.￼",
	            ""],

	init : function(){
		try {
			// init filters
			this.fNoArcFilter = scPaLib.compileFilter(this.fNoArcFilter);
			this.fMcqArcFilter = scPaLib.compileFilter(this.fMcqArcFilter);
			this.fHasSubNavFilter = scPaLib.compileFilter(this.fHasSubNavFilter);
			// init main items
			this.fLft = scPaLib.findNode(this.fLftPath);
			if(this.fLft){
				this.fLft.fBaseWidth = this.fLft.clientWidth;
				this.fLft.fBaseClass = this.fLft.className;
				this.fLft.fOpen = false;
			}
			this.fRgt = scPaLib.findNode(this.fRgtPath);
			this.fRgt.fBaseWidth = this.fRgt.clientWidth;
			this.fRgt.fBaseClass = this.fRgt.className;
			this.fRgt.fOpen = false;
			this.fRgtCo = scPaLib.findNode(this.fRgtCoPath, this.fRgt);
			//init une div pour indiquer qu'un champ est à remplir si la classe indexRequired_yes existe dans le contenu
			if(scPaLib.findNode("des:.indexRequired_yes")){
				this.fRequiredIndex = this.xAddElt("div", scPaLib.findNode(this.fRgtCoPath), "required_index ", true, null, null);
				this.fRequiredIndex.innerHTML = "<p class='arcBk_co_Warn_User_Indexed'><em>"+this.fStrings[4]+"</em></p>";
			}
			this.fRgtInnerWidthDelta = 0;
			var vRgtWidthDelta = /rgtWidthDelta=([^;]*)/.exec(document.cookie);
			if(vRgtWidthDelta && vRgtWidthDelta.length == 2) this.fRgtWidthDelta = Number(vRgtWidthDelta[1]);
			this.fMain = scPaLib.findNode(this.fMainPath);
			this.fMain.fBaseLeft = scCoLib.toInt(this.xReadStyle(this.fMain, "left"));
			this.fArc = scPaLib.findNode(this.fArcPath);
			// Close collapsable blocks that are closed by default.
			var vCbks = scPaLib.findNodes(this.fCbkPath);
			for (var i in vCbks) {
				var vTgl = scPaLib.findNode("des:a", vCbks[i]);
				if (vTgl) vTgl.onclick();
			}

			// init assmnt nodes
			if (topazeMgr.fNodeType == "assmnt") {
				//variable contenant les nodes quizBk après suppression
				this.fQuizBks = scPaLib.findNodes(this.fQuizBkPath, this.fMain);
				this.fQuizBtnValid = scPaLib.findNode(this.fQuizBtnValidPath, this.fArc);
				this.fQuizBtnStart = scPaLib.findNode(this.fQuizBtnStartPath, this.fArc);
				this.fQuizBtnResults = scPaLib.findNode(this.fQuizBtnResultsPath, this.fArc);
				this.fQuizResult = scPaLib.findNode(this.fQuizResultPath, this.fMain);
				this.fQuizArcBk = scPaLib.findNode(this.fQuizArcBkPath, this.fArc);	
				this.fArcDisplay = this.fQuizResult ? this.fQuizArcBk : this.fQuizBtnValid;
				if (this.fQuizBks && this.fQuizBks.length > 1) {
					this.fArcDisplay.style.display = "none";
					var vQuizBtnParent = scPaLib.findNode("par:", this.fArcDisplay)
					this.fQuizBtnNxt = this.xAddBtn(vQuizBtnParent, "btnNxt", this.fStrings[6], this.fStrings[7], this.fArcDisplay);
					this.fQuizBtnNxt.onclick = this.sQuizNxt;
					this.fQuizBtnMde = this.xAddBtn(this.fMain, "btnQuizMde quizSteped", this.fStrings[0], this.fStrings[2], this.fBtm);
					this.fQuizBtnMde.onclick = this.sQuizTglMde;
					this.fQuizIdx = -1;
					this.fQuizSteped = 0;
					if(tplMgr.fQuizzMode && tplMgr.fQuizzMode == "one") this.sQuizNxt();
					else if(tplMgr.fQuizzMode && tplMgr.fQuizzMode == "all") this.sQuizTglMde();
					else if(document.cookie.indexOf("quizModeSteped=true") >= 0) this.sQuizNxt();
					else this.sQuizTglMde();
				}
				//gestion du nombre de fois qu'il est possible de faire un exercice
				if (this.fQuizBtnResults) {
					this.fQuizTryNum = scCoLib.toInt(scServices.assmntMgr.getResponse(topazeMgr.fNodeId, "", "tryNum"));
					this.fQuizBkExplanation = scPaLib.findNode(this.fQuizBkExplanationPath);
					this.fQuizBtnResults.style.display = "none";
					this.fQuizBkExplanation.style.display = "none";
					if (this.fQuizTryNum >= this.fAssmntMaxTry) {
						for (var i in this.fQuizBks) this.fQuizBks[i].style.display = "none";
						if (this.fQuizBtnMde) this.fQuizBtnMde.style.display = "none";
						if (this.fQuizBtnNxt) this.fQuizBtnNxt.style.display = "none";
						if (this.fQuizBtnValid) this.fQuizBtnValid.style.display = "none";
						if (this.fQuizBtnStart) this.fQuizBtnStart.style.display = "none";
						this.fQuizBtnResults.style.display = "";
						this.fQuizBkExplanation.style.display = "";
					}
				}
			}
			// init left bar
			this.fBtnNext = scPaLib.findNode(this.fBtnNextPath);
			this.fBtnBack = scPaLib.findNode(this.fBtnBackPath);
			// init right bar
			this.fArcHasContent = scPaLib.findNodes(this.fArcContentPath, this.fRgtCo).length > 0;
			if (scPaLib.checkNode(this.fMcqArcFilter, this.fRgt) || this.fArcHasContent){
				this.fArcBtnMore = this.xAddBtn(this.fRgtCo, "btnArcMore", this.fStrings[8], this.fStrings[9], null);
				this.fArcBtnMore.onclick = function() {tplMgr.tglRgt(true)};
			}
			if(!(document.cookie.indexOf("rgtOpen=false")>=0) && !scPaLib.checkNode(this.fNoArcFilter, this.fRgt)) this.tglRgt(true);
			// init Coach
			if(tplMgr.fCoachVals) {
				var vHomeNav = scPaLib.findNode("des:.homeNav");
				if(!vHomeNav) this.tglRgt(true);
				var vCoach = sc$(this.fCoachPath);
				for(var i in this.fCoachVals) {
					var vCoachVals = this.fCoachVals[i];
					var vCoachMin = vCoachVals.substring(0,vCoachVals.lastIndexOf(','));
					var vCoachMax = vCoachVals.substring(vCoachVals.lastIndexOf(',')+1);
					if(this.fCoachIndexVal >= vCoachMin && this.fCoachIndexVal <= vCoachMax && !scPaLib.findNode("chi:img",vCoach)) {
						var vCoachImg = this.xAddElt("img", vCoach, "coachImg", null, null, null);
						vCoachImg.src = "../res/" + i.substring(i.lastIndexOf('/')+1);
						vCoachImg.alt = "coach";
						var vArc =vHomeNav?vHomeNav:this.fArc;
						vArc.style.borderBottom = "1px dotted";
						// Permet de loader l'image pour être sûr d'obtenir la hauteur
						if(this.fArc) {
							setTimeout(function(){
								tplMgr.fArc.style.bottom = scCoLib.toInt(tplMgr.xReadStyle(tplMgr.fArc,"bottom")) + (vCoachImg.clientHeight ? vCoachImg.clientHeight : vCoachImg.offsetHeight) + 6 + "px";
							},500)
						}
					}
				}
			}		
			scOnLoads[scOnLoads.length] = this;
		} catch(e){
			scCoLib.util.logError("tplMgr.init::Error", e);
		}
	},
	onLoad : function(){
		scCoLib.util.log("tplMgr.onLoad");
		try {
			// history manager
			this.fHistMgr = new histMgr;
			this.fHistMgr.init(true);
			// Manage nav buttons
			if (this.fBtnNext) this.fBtnNext.style.visibility = (this.fHistMgr.hasNext() ? "" : "hidden");
			if (this.fBtnBack) this.fBtnBack.style.visibility = (this.fHistMgr.hasBack() ? "" : "hidden");
		} catch(e){
			scCoLib.util.log("tplMgr.onLoad error: "+e);
		}
	},
	tglLft : function(pForce){
		scCoLib.util.log("tplMgr.tglLft");
		this.fLft.fOpen = pForce || !this.fLft.fOpen;
//		this.fLft.style.width = (!this.fLft.fOpen ? this.fLft.fBaseWidth : this.fLft.fBaseWidth + this.fLftWidthDelta) + "px";
		this.fLft.className = this.fLft.className.replace(this.fBarClsPre + (this.fLft.fOpen ? "Closed" : "Opened"), this.fBarClsPre + (this.fLft.fOpen ? "Opened" : "Closed"));
	},
	tglRgt : function(pForce){
		scCoLib.util.log("tplMgr.tglRgt");
		this.fRgt.fOpen = pForce || !this.fRgt.fOpen;
		this.xRgtUdt();
		this.fRgt.className = this.fRgt.className.replace(this.fBarClsPre + (this.fRgt.fOpen ? "Closed" : "Opened"), this.fBarClsPre + (this.fRgt.fOpen ? "Opened" : "Closed"));
		document.cookie = "rgtOpen=" + this.fRgt.fOpen;
	},
	rgtMore : function(){
		this.fRgtWidthDelta += this.fRgtWidthInc;
		this.fRgtWidthDelta = Math.min(this.fRgtWidthDelta,this.fRgtWidthDeltaMax);
		this.xRgtUdt();
	},
	rgtLess : function(){
		this.fRgtWidthDelta -= this.fRgtWidthInc;
		this.fRgtWidthDelta = Math.max(this.fRgtWidthDelta,this.fRgtWidthDeltaMin);
		this.xRgtUdt();
	},
	/** tplMgr.next() - move to next page in the history. */
	next : function(){
		if (this.fHistMgr){
			if(scServices.preloadMgr) scServices.preloadMgr.goTo(this.fHistMgr.next());
			else window.location.replace(this.fHistMgr.next());
		}
	},
	/** tplMgr.back() - move to next page in the history. */
	back : function(){
		if (this.fHistMgr){
			if(scServices.preloadMgr) scServices.preloadMgr.goTo(this.fHistMgr.back());
			else window.location.replace(this.fHistMgr.back());
		}
	},

	sQuizPrv : function(){
		scCoLib.util.log("tplMgr.sQuizPrv");
		if (tplMgr.fQuizIdx <= 0) return;
		tplMgr.fQuizIdx--
		tplMgr.xQuizUdt();
	},
	sQuizNxt : function(){
		scCoLib.util.log("tplMgr.sQuizNxt");
		if (tplMgr.fQuizIdx >= tplMgr.fQuizBks.length - 1) return;
		tplMgr.fQuizIdx++
		tplMgr.xQuizUdt();
	},
	sQuizTglMde : function(){
		scCoLib.util.log("tplMgr.sQuizTglMde");
		tplMgr.fQuizSteped = 1 - tplMgr.fQuizSteped;
		tplMgr.fQuizBtnMde.title = tplMgr.fStrings[tplMgr.fQuizSteped+2];
		tplMgr.fQuizBtnMde.innerHTML =  "<span>" + tplMgr.fStrings[tplMgr.fQuizSteped] + "</span>";
		tplMgr.fQuizBtnMde.className = "btnQuizMde" + (tplMgr.fQuizSteped == 0 ? " quizSteped" : "");
		document.cookie = "quizModeSteped=" + (tplMgr.fQuizSteped == 0);
		if (tplMgr.fQuizSteped == 0) {
			tplMgr.fQuizIdx = -1;
			tplMgr.sQuizNxt();
		} else {
			for (i in tplMgr.fQuizBks) {
				tplMgr.fQuizBks[i].style.display = "";
				tplMgr.fQuizBks[i].className = tplMgr.fQuizBks[i].className + " quizBkInList";
			}
			tplMgr.fQuizBtnNxt.style.display = "none";
			tplMgr.fArcDisplay.style.display = "";
		}
	},
	xQuizUdt : function(){
		scCoLib.util.log("tplMgr.xQuizUdt");
		for (i in this.fQuizBks) {
			this.fQuizBks[i].style.display = (i == this.fQuizIdx ? "" : "none");
			this.fQuizBks[i].className = this.fQuizBks[i].className.replace(" quizBkInList", "");
		}
		this.fQuizBtnNxt.style.display = (tplMgr.fQuizIdx >= tplMgr.fQuizBks.length - 1 ? "none" : "");
		this.fArcDisplay.style.display = (tplMgr.fQuizIdx >= tplMgr.fQuizBks.length - 1 ? "" : "none");
	},
	xRgtUdt : function(){
		scCoLib.util.log("tplMgr.xRgtUdt");
		this.fRgt.style.width = (!this.fRgt.fOpen ? this.fRgt.fBaseWidth : this.fRgt.fBaseWidth + this.fRgtWidthDelta) + "px";
		this.fRgtCo.style.width = (this.fRgt.fBaseWidth + this.fRgtWidthDelta - this.fRgtInnerWidthDelta) + "px";
		this.fMain.style.right = (!this.fRgt.fOpen ? this.fMain.fBaseLeft : this.fMain.fBaseLeft + this.fRgtWidthDelta) + "px";
		document.cookie = "rgtWidthDelta=" + this.fRgtWidthDelta;
	},
	xMediaFallback: function(pMedia) {
		while (pMedia.firstChild) {
			if (pMedia.firstChild instanceof HTMLSourceElement) {
				pMedia.removeChild(pMedia.firstChild);
			} else {
				pMedia.parentNode.insertBefore(pMedia.firstChild, pMedia);
			}
		}
		pMedia.parentNode.removeChild(pMedia);
	},
	
	/* ================== toolbox =====================*/
	/** tplMgr.xReadStyle : cross-browser css rule reader */
	xReadStyle : function(pElt, pProp) {
		try {
			var vVal = null;
			if (pElt.style[pProp]) {
				vVal = pElt.style[pProp];
			} else if (pElt.currentStyle) {
				vVal = pElt.currentStyle[pProp];
			} else {
				var vDefaultView = pElt.ownerDocument.defaultView;
				if (vDefaultView && vDefaultView.getComputedStyle) {
					var vStyle = vDefaultView.getComputedStyle(pElt, null);
					var vProp = pProp.replace(/([A-Z])/g,"-$1").toLowerCase();
					if (vStyle[vProp]) return vStyle[vProp];
					else vVal = vStyle.getPropertyValue(vProp);
				}
			}
			return vVal.replace(/\"/g,""); //Opera returns certain values quoted (literal colors).
		} catch (e) {
			return null;
		}
	},
	/** tplMgr.xSwitchClass - switch css classes. */
	xSwitchClass : function(pNode, pClassOld, pClassNew, pAddIfAbsent) {
		var vAddIfAbsent = pAddIfAbsent || false;
		if (pClassOld && pClassOld != "") {
			if (pNode.className.indexOf(pClassOld)==-1){
				if (!vAddIfAbsent) return;
				else if (pClassNew && pClassNew != '' && pNode.className.indexOf(pClassNew)==-1) pNode.className = pNode.className + " " + pClassNew;
			} else {
				var vCurrentClasses = pNode.className.split(' ');
				var vNewClasses = new Array();
				for (var i = 0, n = vCurrentClasses.length; i < n; i++) {
					if (vCurrentClasses[i] != pClassOld) {
						vNewClasses.push(vCurrentClasses[i]);
					} else {
						if (pClassNew && pClassNew != '') vNewClasses.push(pClassNew);
					}
				}
				pNode.className = vNewClasses.join(' ');
			}
		}
	},
	/** navMgr.xAddElt : Add an HTML element to a parent node. */
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
	/** tocMgr.xAddBtn : Add a HTML button to a parent node. */
	xAddBtn : function(pParent, pClassName, pCapt, pTitle, pNxtSib) {
		var vBtn = pParent.ownerDocument.createElement("a");
		vBtn.className = pClassName;
		vBtn.fName = pClassName;
		vBtn.href = "#";
		vBtn.target = "_self";
		if (pTitle) vBtn.setAttribute("title", pTitle);
		vBtn.innerHTML = "<span>" + pCapt + "</span>"
		if (pNxtSib) pParent.insertBefore(vBtn,pNxtSib)
		else pParent.appendChild(vBtn);
		return vBtn;
	},
	
	loadSortKey : "YtplMgr"
}

function scSiRuleEnsureVisible(pPathNode, pContainer) {
	this.fPathNode = pPathNode;
	this.fContainer = pContainer;
	scOnLoads[scOnLoads.length] = this;
}
scSiRuleEnsureVisible.prototype.onResizedAnc = function(pOwnerNode, pEvent) {
	if(pEvent.phase==1 || pEvent.resizedNode == pOwnerNode) return;
	this.ensureVis();
}
scSiRuleEnsureVisible.prototype.onResizedDes = function(pOwnerNode, pEvent) {
	if(pEvent.phase==1) return;
	this.ensureVis();
}
scSiRuleEnsureVisible.prototype.resetNode = function() {
	this.fNode = scPaLib.findNode(this.fPathNode, this.fContainer);
	this.ensureVis();
}
scSiRuleEnsureVisible.prototype.ensureVis = function() {
	if( !this.fNode) return;
	try{
		var vParent = this.fNode.offsetParent;
		if( !vParent) return;
		var vOffset = this.fNode.offsetTop;
		while(vParent != this.fContainer) {
			var vNewParent = vParent.offsetParent;
			vOffset += vParent.offsetTop;
			vParent = vNewParent;
		}
		var vOffsetMiddle = vOffset + this.fNode.offsetHeight/2;
		var vMiddle = this.fContainer.clientHeight / 2;
		this.fContainer.scrollTop = vOffsetMiddle - vMiddle;
	} catch(e) {scCoLib.util.log("ERROR: scSiRuleEnsureVisible.ensureVis : "+e)}
}
scSiRuleEnsureVisible.prototype.onLoad = function() {
	scCoLib.util.log("scSiRuleEnsureVisible.onLoad");
	try {
		this.resetNode();
		scSiLib.addRule(this.fContainer, this);
	} catch(e){scCoLib.util.log("ERROR: scSiRuleEnsureVisible.onLoad : "+e);}
}
scSiRuleEnsureVisible.prototype.loadSortKey = "SiZ";
scSiRuleEnsureVisible.prototype.ruleSortKey = "Z";
