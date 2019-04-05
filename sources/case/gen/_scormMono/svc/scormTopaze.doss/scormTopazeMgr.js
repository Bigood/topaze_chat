var scormTopazeMgr = {
	// fHistMgr : null,
	/* Controle d'activité du user */
	fTimeBeforeStopChrono : 30000,
	fWaitNode : null,
	fInactiveTime : 0,
	fPausedTime : 0,
	fPassedTime : 0,
	fstartTime : new Date().getTime(),
	fLastTime : new Date().getTime(),

	init : function(){
		scOnLoads[scOnLoads.length] = scOnUnloads[scOnUnloads.length] = this;
	},

	onLoad : function(){
		if (!histMgr) return;
		// this.fHistMgr = new histMgr;
		/* Controle d'activité du user */
		if(scServices.scormTopaze.fTimeBeforeStopChronoUser) this.fTimeBeforeStopChrono = scServices.scormTopaze.fTimeBeforeStopChronoUser*1000;
		this.xAddEvent(window, 'mousemove', scormTopazeMgr.xMarkUserActivity, false);
		window.setInterval(function() {
			var vNewTime = new Date().getTime();
			scormTopazeMgr.fPassedTime = vNewTime - scormTopazeMgr.fstartTime;
			if(scormTopazeMgr.fInactiveTime > scormTopazeMgr.fTimeBeforeStopChrono) {
				scormTopazeMgr.fPausedTime += vNewTime  - scormTopazeMgr.fLastTime;
				if(!scormTopazeMgr.fWaitNode) {
					try {		
						scormTopazeMgr.fWaitNode = scormTopazeMgr.xAddElt("div", scPaLib.findNode("bod:"), "sessionTimeAlert");
						scormTopazeMgr.fWaitNode.style.opacity = 0;
						scormTopazeMgr.xAddElt("div", scormTopazeMgr.fWaitNode, "sessionTimeAlert_hover");
						var vWaitNodeCo = scormTopazeMgr.xAddElt("div", scormTopazeMgr.fWaitNode, "sessionTimeAlert_co");
						var vText = scormTopazeMgr.xAddElt("div", vWaitNodeCo , "sessionTimeAlert_text")
						vText.innerHTML = "Déplacez votre souris sur cette fenêtre pour poursuivre votre lecture.";
					}catch(e){
						scormTopazeMgr.fWaitNode = null;
					}
				} else {
					if(scormTopazeMgr.fWaitNode.style.opacity != 1) new scormTopazeMgr.FadeEltTask(scormTopazeMgr.fWaitNode,1);
				}
			} else scormTopazeMgr.fInactiveTime += vNewTime  - scormTopazeMgr.fLastTime;
			scormTopazeMgr.fLastTime = vNewTime;
		}, 0);
	},


	onUnload: function(){
		// Enregistrement des indices
		var vGlobalIndex = scServices.scormTopaze.fGlobalIndexId;
		scServices.scormTopaze.LMSsetData(["globalindex",vGlobalIndex,"v"],topazeMgr.getIndexVal(vGlobalIndex, scServices.scormTopaze.fGlobalIndexTp.slice(1)));
		for(i in scServices.scormTopaze.fIndexes) {	
			var vIndex = i;
			scServices.scormTopaze.LMSsetData(["indexes",vIndex,"v"], topazeMgr.getIndexVal(vIndex, scServices.scormTopaze.fIndexes[i].slice(1)));
		}
		// Enregistrement des étapes si on est pas sur la home qui n'est pas une étape
		if(topazeMgr.fNodeType != "case") {
			// Steps et route remonte la même chose, seul diggère le nom de la variable ... demanande S. Fraysse 01/08/2013
			scServices.scormTopaze.fStepsSeen.push({id:topazeMgr.fNodeId,partExo:scormTopazeMgr.fPartExo,t:this.fPassedTime-this.fPausedTime});
			scServices.scormTopaze.LMSsetData(scServices.scormTopaze.fRoute?["route"]:["steps"],scServices.scormTopaze.fStepsSeen);
			// if(scServices.scormTopaze.fRoute){
			// 	scServices.scormTopaze.fStepsSeen.push({id:topazeMgr.fNodeId,partExo:scormTopazeMgr.fPartExo,t:this.fPassedTime-this.fPausedTime});
			// 	scServices.scormTopaze.LMSsetData(["route"],scServices.scormTopaze.fStepsSeen);
			// } else{
			// 	for(i in scServices.scormTopaze.fSteps) {	
			// 		var vStep = scServices.scormTopaze.fSteps[i];	
			// 		if(vStep == topazeMgr.fNodeId) {
			// 			scServices.scormTopaze.fStepsSeen.push({id:vStep,partExo:scormTopazeMgr.fPartExo,t:this.fPassedTime-this.fPausedTime});
			// 			scServices.scormTopaze.LMSsetData(["steps"],scServices.scormTopaze.fStepsSeen);
			// 		}
			// 	}
			// }
		}
		// Commit uniquement sur le unload
		scServices.suspendDataStorage.commit(true,"");
	},

	xMarkUserActivity : function() {
		scormTopazeMgr.fInactiveTime = 0;
		if(scormTopazeMgr.fWaitNode && scormTopazeMgr.fWaitNode.style.opacity != 0) new scormTopazeMgr.FadeEltTask(scormTopazeMgr.fWaitNode,0);
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

	xAddEvent : function(elt, event, fctn, capture) {
		return document.addEventListener ? elt.addEventListener(event, fctn, capture): elt.attachEvent ? elt.attachEvent('on' + event, fctn): false;
	},

	/** scormTopazeMgr.xSetOpacity : Set the opacity of a given node.
	 * @param pRate Variable de 0 à 1. */
	xSetOpacity: function(pNode, pRate){
		if(scCoLib.isIE) pNode.filters.item("DXImageTransform.Microsoft.Alpha").opacity = pRate*100;
		else pNode.style.opacity = pRate;
	},
	/** scormTopazeMgr.xStartOpacityEffect : Start the opacity of a given node.
	 * On ajoute le filtre d'opacité sur IE.
	 * On place le node en visibility: "".
	 * @param pRate 2 valeurs possibles: 0 (invisible) ou 1 (visible). */
	xStartOpacityEffect: function(pNode, pRate){
		if(scCoLib.isIE) pNode.style.filter = pRate==1 ? "progid:DXImageTransform.Microsoft.Alpha(opacity=100)" : "progid:DXImageTransform.Microsoft.Alpha(opacity=0)";
		else pNode.style.opacity = pRate;
		pNode.style.visibility = "";
	},
	/** scormTopazeMgr.xEndOpacityEffect : End the opacity of a given node.
	 * On supprime le filtre d'opacité sur IE (évite des bugs de refresh).
	 * On place le node en visibility: hidden.
	 * @param pRate 2 valeurs possibles: 0 (invisible) ou 1 (visible). */
	xEndOpacityEffect: function(pNode, pRate){
		if(scCoLib.isIE) pNode.style.filter = "";
		else pNode.style.opacity = pRate;
		if(pRate == 0) pNode.style.visibility = "hidden";
		else pNode.style.visibility = "";
	},

	loadSortKey : "ZScormTopazeMgr"
}
/* === Generic Utility Classes ============================================== */
/** scormTopazeMgr.FadeEltTask : TiLib task that fades a given element in or out.
 * @param pElt element to fade.
 * @param pDir fade direction : 0=out, 1=in.
 * @param pMgr .
 * @param pStartFunc optionnal function that will be executed at the start of the task.
 * @param pEndFunc optionnal function that will be executed at the end of the task.
 * @param pInstant optionnal parameter if true no animation. */
scormTopazeMgr.FadeEltTask = function(pElt,pDir,pMgr,pStartFunc,pEndFunc,pInstant){
	//scCoLib.util.log("New scormTopazeMgr.FadeEltTask");
	this.fRate = new Array();
	this.fRate[0] = [.9, .85, .8, .7, .6, .5, .4, .3, .2, .15, .1];
	this.fRate[1] = [.1, .15, .2, .3, .4, .5, .6, .7, .8, .85, .9];
	try{
		this.fElt = pElt;
		this.fDir = (pDir >= 1 ? 1 : 0);
		this.fMgr = pMgr || {fEnableEffects:"true"};
		this.fStartFunc = pStartFunc || function(){};
		this.fEndFunc = pEndFunc || function(){};
		if (pInstant || !this.fMgr.fEnableEffects) {
			this.terminate();
			return;
		}
		if (this.fElt.fFadeTask) {
			this.fElt.fFadeTask.changeDir(this.fDir);
		} else {
			this.fStartFunc();
			scormTopazeMgr.xStartOpacityEffect(this.fElt, 1-this.fDir);
			this.fEndTime = ( Date.now  ? Date.now() : new Date().getTime() ) + 100;
			this.fIdx = -1;
			this.fElt.fFadeTask = this;
			scTiLib.addTaskNow(this);
		}
	}catch(e){scCoLib.util.log("ERROR scormTopazeMgr.FadeEltTask : "+e);}
}
scormTopazeMgr.FadeEltTask.prototype = {
	/** FadeEltTask.execTask */
	execTask : function(){
		while(this.fEndTime < (Date.now ? Date.now() : new Date().getTime()) && this.fIdx < this.fRate[this.fDir].length) {
			this.fIdx++;
			this.fEndTime += 100;
		}
		this.fIdx++;
		this.fEndTime += 100;
		if(this.fIdx >= this.fRate[this.fDir].length) {
			scormTopazeMgr.xEndOpacityEffect(this.fElt, this.fDir);
			this.fEndFunc();
			this.fElt.fFadeTask = null;
			return false;
		}
		scormTopazeMgr.xSetOpacity(this.fElt, this.fRate[this.fDir][this.fIdx]);
		return true;
	},
	/** FadeEltTask.execchangeDirTask */
	changeDir : function(pDir){
		var vDir = (pDir >= 1 ? 1 : 0)
		if (vDir != this.fDir) this.fIdx = this.fRate[this.fDir].length - this.fIdx - 1;
		this.fDir = vDir;
	},
	/** FadeEltTask.terminate */
	terminate : function(){
		// 	scCoLib.util.log("scormTopazeMgr.FadeEltTask.terminate");
		this.fIdx = this.fRate[this.fDir].length;
		this.execTask();
	}
}