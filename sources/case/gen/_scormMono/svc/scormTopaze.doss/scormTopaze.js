scServices.scormTopaze = scOnLoads[scOnLoads.length] = scOnUnloads[scOnUnloads.length] = {
	fSteps : [],
	fIndexes : [],
	fStepsSeen : [],
	fGlobalIndexId : null,
	fGlobalIndexTp : null,
	fRoute : false,
	_History : {},
	

	onLoad : function(){
		if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) {
			var vApi = scServices.scorm2k4.getScorm2k4API();
			// Si cmi.entry est vide c'est une nouvelle tentative donc on réinitialise
			if(!vApi.GetValue("cmi.entry")) {
				scServices.storage.resetData();
				scServices.scPreload.reload();
			}
		}
	},

	register: function(pId,pType,pData){
		if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) {
			if(pType == "globalIndex") {this.fGlobalIndexId=pId;this.fGlobalIndexTp=pData;}
			if(pType == "index") this.fIndexes[pId]=pData;
			if(pType == "step") this.fSteps[pData]=pId;
			if(pId == null && pType == null && pData == null) this.fRoute=true;
		}
	},

	/*
	 * pFields : array
	 */
	LMSsetData : function(pFields,pVal){
		if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) {
			scServices.suspendDataStorage.setVal(["topaze"].concat(pFields), pVal);
		}
	},

	objToJson : function(pObj){
		try{
			return JSON.stringify(pObj);
		} catch(e){ // TODO: purge when IE7 not supported
			var vBuf="";
			if(pObj) for (var vKey in pObj){
				var vLbl = (pObj instanceof Array) ? "" : '"' + vKey + '":';
				var vObj = pObj[vKey];
				if(vObj != null) {
					vBuf+= (vBuf!="" ? "," : "") + vLbl;
					if(Array.isArray(vObj) || typeof vObj == "object" || vObj instanceof Object) vBuf+= this.xSerialiseObjJs(vObj);
					else if(typeof vObj == "number") vBuf+= '"' + vObj + '"';
					else vBuf+= '"' + vObj.toString().replace(/[\t\n\r\\'"]/g, this.escapeJss) + '"';
				}
			}
			if(Array.isArray(pObj)) return "[" + vBuf + "]";
			else if(typeof pObj == "object" || vObj instanceof Object) return "{" + vBuf + "}";
			else return vBuf;
		}
	},

	jsonToObj : function(pString){
		if(!pString) return {};
		try{
			return JSON.parse(pString);
		} catch(e){ // TODO: purge when IE7 not supported
			var vVal;
			eval("vVal="+pString);
			return vVal;
		}
	},

	sendData : function(){
		if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) {
			var vApi = scServices.scorm2k4.getScorm2k4API();
			vApi.SetValue("cmi.completion_status", "completed");
			scServices.exitModeStorage.terminate("");
		} 
	},

	loadSortKey: "1scormTopaze"


}

/*************** HACK ****************/
/**
 * @API SCORM2004topaze : Hack des fonctions de storage
 */ 
if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) scServices.storage.fRootKey = "";
else scServices.storage.fRootKey = document.location.pathname+"/";
scServices.storage.activeStorage = function(pBoolean){
	if(!pBoolean) this.fIsActive = false;
	else {
		try {
			if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) {
				this.fStorage = scServices.scorm2k4.getScorm2k4API();
			} else if (typeof localStorage != "undefined") {
				this.fStorage = localStorage;
				this.fIsLocal = true;
			} else {
				this.fStorage = globalStorage[this.fDomain];
			}
			this.fIsActive = true;
		}catch(e){
			this.fIsActive = false;
		}
	}
	return this.fIsActive;
}
scServices.storage.setItem = function(pKey,pVal){
	if (!this.isStorageActive) return null;
	if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) {
		scServices.suspendDataStorage.setVal(["history",pKey], pVal);
	} else return this.fStorage.setItem(pKey, pVal);
}
scServices.storage.getItem = function(pKey){
	if (!this.isStorageActive) return null;
	if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) {
		if(scServices.suspendDataStorage.getVal(["history",pKey])) return scServices.suspendDataStorage.getVal(["history",pKey]);		
	} else {
		var vIt = this.fStorage.getItem(pKey);
		return vIt ? (this.fIsLocal ? vIt : vIt.value) : null;
	}
}
scServices.storage.resetData = function(){
	if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) {
		var vApi = scServices.scorm2k4.getScorm2k4API();
		vApi.SetValue("cmi.completion_status", "incomplete");
		vApi.SetValue("cmi.suspend_data", "");
		vApi.SetValue("cmi.session_time", "");
		vApi.SetValue("cmi.location", "");
		vApi.SetValue("cmi.exit", "suspend");

	} else {
		if (this.fIsLocal){
			this.fStorage.clear();
		} else {
			if(!pRootKey) pRootKey = this.fRootKey;
			var vCnt = this.fStorage.length;
			for(var i = 0; i < vCnt; i++) {
				var vKey = this.fStorage.key(i);
				if(vKey.indexOf(pRootKey)==0) this.fStorage.setItem(vKey, "");
			}
		}
	}
}
scServices.storage.onLoad = function(){
	if(scServices.scorm12 && scServices.scorm12.isScorm12Active()) return;
	this.activeStorage(true);
}
scServices.assmntMgr.reloadData = function(){
	if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) return;
	else {try{this.data={resp:{},scorePts:{},minPts:{},maxPts:{},status:{},hints:{}};var vItem=scServices.storage.getItem(scServices.storage.getRootKey()+"assmnt");if(vItem) eval("this.data={"+vItem+"};");} catch(e){}}
}
/**
 * @API SCORM2004topaze : surcharge pour supprimer le Commit à ce niveau et suppression de l'envoie du session time fait dans le commit
 */ 
scServices.exitModeStorage.terminate = function(pExitMode){
	this._done = true;
	this._exitMode = pExitMode;
	scServices.suspendDataStorage._Dirty = true;
};
/**
 * @API SCORM2004topaze : onunload renvoie suspend et incomplete si l'EDC est pas validée
 */ 
scServices.exitModeStorage.onUnload = function(){
	if(! this._done) {
		var vApi = scServices.scorm2k4.getScorm2k4API();
		vApi.SetValue("cmi.completion_status", "incomplete");
		this.terminate("suspend");
	}
}
/**
 * @API SCORM2004topaze : Pas d'utilisation de "interactions" : tout est écrit dans cmi.suspend_data
 */ 
scServices.assmntMgr.xConnect2k4 = function(){
	scServices.assmntMgr.xConnect12();
	this.commit = function(pLmsCommit, pLmsCommitParam){scServices.suspendDataStorage.commit(pLmsCommit, pLmsCommitParam);};
}
/**
 * @API SCORM2004topaze : Envoie du session time (tempas passé moins les pause) + pas de commit à interval régulier ni de commit sur les exos (le commit à lieu lors du unload) + scorm 1.2 renvoie null
 */ 
scServices.suspendDataStorage.commit = function(pLmsCommit, pLmsCommitParam) {
	if( ! this._Dirty) return;
	if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) {
		var vApi = scServices.scorm2k4.getScorm2k4API();
		// Hack : Commit et SetValue si pLmsCommit=true
		if(pLmsCommit) {
			vApi.SetValue("cmi.suspend_data", scServices.scormTopaze.objToJson(this._Fields));
			// Hack : on calcul le temps de session réel sans les temps de pause
			var vSteps = scServices.suspendDataStorage.getVal(["topaze","route"])?scServices.suspendDataStorage.getVal(["topaze","route"]):scServices.suspendDataStorage.getVal(["topaze","steps"]),
				vStepTime = 0;
			for (var i in vSteps) vStepTime += vSteps[i].t;				
			vApi.SetValue("cmi.session_time", scServices.exitModeStorage.serializeMsTime(vStepTime));
			// Si pas de terminate alors on fait un commit (sinon le commit est fait dans le terminate)
			if(!scServices.exitModeStorage._done) vApi.Commit(pLmsCommitParam);
			else {
				vApi.SetValue("cmi.exit",scServices.exitModeStorage._exitMode);
				vApi.Terminate("");
			}
		}
	} else if(scServices.scorm12 && scServices.scorm12.isScorm12Active()) {
		return;
	} else if(scServices.storage && scServices.storage.isStorageActive()) {
		scServices.storage.getStorage().setItem(scServices.storage.getRootKey()+"suspend_data", scServices.dataUtil.serialiseObjJs(this._Fields));
	}
	this._Dirty = false;
}
/**
 * @API SCORM2004topaze : Convert json2obj sur _fields + suppression interval commit + scorm 1.2 renvoie null
 */ 
scServices.suspendDataStorage.onLoad = function(){
	var vApi;
	if(scServices.scorm2k4 && scServices.scorm2k4.isScorm2k4Active()) {
		vApi = scServices.scorm2k4.getScorm2k4API();
		try {
			this._Fields = scServices.scormTopaze.jsonToObj(vApi.GetValue("cmi.suspend_data"));
			scServices.scormTopaze.fStepsSeen = scServices.suspendDataStorage.getVal(["topaze","route"])?scServices.suspendDataStorage.getVal(["topaze","route"]):scServices.suspendDataStorage.getVal(["topaze","steps"])?scServices.suspendDataStorage.getVal(["topaze","steps"]):[];
			scServices.scorm2k4.checkError();
		} catch(e){
			this._Fields = {};
			alert("SCORM 2004 : Echec à la récupération des précédentes données enregistrées.");
		}
	} else if(scServices.scorm12 && scServices.scorm12.isScorm12Active()) {
		return;
	} else if(scServices.storage && scServices.storage.isStorageActive()) {
		vApi = scServices.storage.getStorage();
		var vItem = scServices.storage.getItem(scServices.storage.getRootKey()+"suspend_data");
		if(vItem) this._Fields = scServices.dataUtil.deserialiseObjJs(vItem);
	}
	
	// if(vApi) this._ThreadCommit = window.setInterval("scServices.suspendDataStorage.commit();", 60000);
}
/**
 * @API SCORM2004topaze : Suppression commit et terminate sur unload 
 */ 
scServices.scorm2k4.onUnload = function(){}
scServices.suspendDataStorage.onUnload = function(){}