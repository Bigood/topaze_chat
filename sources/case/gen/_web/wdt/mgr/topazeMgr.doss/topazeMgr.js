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
 * Portions created by the Initial Developer are Copyright (C) 2008-2015
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): nicolas.boyer@kelis.fr
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
 * TOPAZE manager.
 */
var topazeMgr = {
	fNodeId: null,   // Unique node ID - MUST be defined before onLoad() is executed.
	fNodeType: null, // Node type (exp, heavy etc.) - MUST be defined before onLoad() is executed.
	fSessKey: "",    // general assmnt session.
	fSessKeyQuiz: "",    // quiz assmnt session.
	fIdxs: [],       // array of index objects
	fVars: [],       // array of variable objects
	fNxtNodes: [],   // array of next nodes (DOM)
	fNxtCnds: [],    // array of ARC next condition objects (see topazeMgr.addArcCnd())
	fIndexVarCalc: {}, // Object of calc
	fPathArcRoot : "ide:tplArc",
	fPathMapRoot : "ide:map",
	fPathArcNodes : "des:.arcList/chi.li",
	fPathAreaNodes : "chi:area",
	fPathIndexRequiredNodes : "des:input.indexRequired_yes",
	fStrings : ["￼ERREUR - condition incompatible : Une étape conditionnée par un indice ne peut pas utiliser un opérateur à pourcentage. Utilisez dans ce cas un opérateur à indice.￼",
	            "￼Attention seules les valeurs numériques sont acceptées.￼",
	            "￼Un problème est survenue dans l\'indice javascript $s￼",
	            "￼l\'indice ne retourne pas un nombre ($s)￼",
	            "￼ERREUR - condition incompatible : vous devez utiliser une variable avec cet opérateur.￼"],

/** topazeMgr.onLoad() - sc api on load init function. */
	onLoad : function(){
		try{
			if (!this.fNodeId || !this.fNodeType) throw new Error("Topaze manager not correctly initialized. missing node id or node type.");
			scCoLib.util.log("topazeMgr.onLoad - node ID="+this.fNodeId);
			
			// Manage Next links
			this.fArcRoot = scPaLib.findNode(this.fPathArcRoot);
			this.fMapRoot = scPaLib.findNode(this.fPathMapRoot);
			this.fNxtNodes = (this.fNodeType == "nav" || this.fNodeType == "case") ? scPaLib.findNodes(this.fPathAreaNodes,this.fMapRoot) : scPaLib.findNodes(this.fPathArcNodes,this.fArcRoot);
			this.initArc();
			
			// node specific init.
			switch (this.fNodeType){
				case "case": {
					return;
				}
				case "assmnt": {
					if(!this.isNodeVisited(this.fNodeId)) scServices.assmntMgr.setCompletionStatus(this.fNodeId, this.fSessKey, "attempt");
					break;
				}
				case "exp":
				case "heavy":
				case "nav": {
					if(!this.isNodeVisited(this.fNodeId)) scServices.assmntMgr.setCompletionStatus(this.fNodeId, this.fSessKey, "attempt");
					scServices.assmntMgr.setPts(this.fNodeId, this.fSessKey, 0, 1, 1);
					scServices.assmntMgr.commit();
					break;
				}
			}

			// requiredIndex
			this.fIndexRequiredNodes = scPaLib.findNodes(this.fPathIndexRequiredNodes);
			this.xHasEmptyRequiredIndex(this.fIndexRequiredNodes,this.fArcRoot);
			
		} catch(e){scCoLib.util.logError("ERROR topazeMgr.onLoad",e)}
	},

/** topazeMgr.isNodeVisited() */
//   @param pNodeId : Node ID
//   @param pSessKey : optionnal : session key
//   @returns true if the node has been visited
	isNodeVisited : function(pNodeId, pSessKey){
		pSessKey = pSessKey || this.fSessKey;
		return (scServices.assmntMgr.getCompletionStatus(pNodeId, pSessKey)!="notAttempt");
	},

/** topazeMgr.isNodeFinished() */
//   @param pNodeId : Node ID
//   @param pSessKey : optionnal : session key
//   @returns true for a quiz node that has been finished (validated)
	isNodeFinished : function(pNodeId, pSessKey){
		pSessKey = pSessKey || this.fSessKey;
		return (scServices.assmntMgr.getCompletionStatus(pNodeId, pSessKey)=="complete");
	},

/** topazeMgr.addArcCnd() - Add an ARC condition to the list that is processed on load. 
 *  The order in which the conditions are added defines the corresponding next link that they control
 *  condition objects are of the form: {id:"order id",pl:"payload object",op:"operation ex: %>",vl:"compare value"}
 *  payload objects are of the form:   {id:"object unique id",tp:"type (n=node, u=userIndex, a=autoIndex, s=status)"} */
//    @param pCnd : conditon object
	addArcCnd : function(pCnd){
		this.fNxtCnds[this.fNxtCnds.length] = pCnd;
	},

/** topazeMgr.initArc() - generic ARC init function.
 * Empty by default. Can be replaced with one of the initArc* functions on init. */
	initArc : function(){
	},

/** topazeMgr.initArcChoose() - Choose ARC init function.
 * processes the ARC conditions to determine which next node link to display.*/
	initArcChoose : function(){
		if (this.fNxtCnds.length>0){
			var vNxtFound = false;
			for (var i = 0; i < this.fNxtCnds.length; i++) {
				var vCnd = this.fNxtCnds[i];
				var vDisplayNxt = false;
				if (vCnd.op) { // this is a standard cond
					var vPl = null;
					var vOp;
					var vIsNode = vCnd.pl.tp == "n";
					var vIsVariable = vCnd.pl.tp == "uv" || vCnd.pl.tp == "av";
					var vVl = !vIsVariable?this.xToFloat(vCnd.vl):vCnd.vl;
					if (vCnd.op.charAt(0) == "%") { //this is a % cond
						vOp = vCnd.op.substring(1);
						if (vIsNode && this.isNodeVisited(vCnd.pl.id)) vPl = this.getScore(vCnd.pl.id);
						else if (!vIsNode) alert(this.fStrings[0]);
					} else if (vCnd.op.charAt(0) == "s") { // this is a str cond with a variable
						vOp = vCnd.op.substring(1);
						if (vIsVariable) vPl = this.getVarVal(vCnd.pl.id,vCnd.pl.tp[0]);
						else alert(this.fStrings[4]);
					} else { // this is a non node % cond and non str cond
						vOp = this.fNxtCnds[i].op;
						if (vIsNode) vPl = this.isNodeVisited(vCnd.pl.id) ? scServices.assmntMgr.getScorePts(vCnd.pl.id, this.fSessKey) : 0;
						else if(vCnd.pl.nb) vPl = this.xToFloat(this.getIndexVal(vCnd.pl.id,vCnd.pl.tp,vCnd.pl.nb));
						else vPl = this.xToFloat(this.getIndexVal(vCnd.pl.id,vCnd.pl.tp));
					}
					switch (vOp){
						case ">": {
							vDisplayNxt = vPl > vVl; break;
						}
						case ">=": {
							vDisplayNxt = vPl >= vVl; break;
						}
						case "=": {
							if (vIsVariable)
							{
								var vPl = typeof vPl == "string" ? vPl.toLowerCase() : vPl;
								vDisplayNxt = vPl == vVl.toLowerCase();
							}
							else vDisplayNxt = vPl == vVl; break;
						}
						case "<": {
							vDisplayNxt = vPl < vVl; break;
						}
						case "<=": {
							vDisplayNxt = vPl <= vVl; break;
						}
					}
					vNxtFound = (vDisplayNxt ? true : vNxtFound);
				} else {
					if(this.fNodeType == "nav") vDisplayNxt = true;
					else vDisplayNxt =  !vNxtFound; // must be the default step
				}
				if (this.fNodeType == "nav" || this.fNodeType == "case") this.fNxtNodes[i].className = (vDisplayNxt ? this.fNxtNodes[i].className.replace("disabled_area", "") : this.fNxtNodes[i].className + " disabled_area");
				else this.fNxtNodes[i].style.display = (vDisplayNxt? "" : "none");
			}
		}
	},

/** topazeMgr.initIndex() - Init an auto index. */
	initIndex : function(pId,pMode){
		this.fIdxs[pId] = new Object();
		this.fIdxs[pId].md = pMode;
		this.fIdxs[pId].cl = [];
	},

/** topazeMgr.addIndexCalc() - Add an auto index calculaton. */
//   @param pId : index id
//   @param pInput : input value
//   @param pCalc : calculation object: {op:"operation",vl:"value",mx:"max limit",mn:"min limit",lm:"type de limites"} 
	addIndexCalc : function(pId,pInput,pCalc){
		var vVl = this.xToFloat(pInput);
		if (pCalc){
			for (var i = 0; i < pCalc.length; i++) {
				var vCalc = pCalc[i];
				switch (vCalc.op){
					case "r": { //rate
						vVl = vVl * this.xToFloat(vCalc.vl); break;
					}
					case "t": { //translate
						vVl += this.xToFloat(vCalc.vl); break;
					}
					case "m": { //map
						vVl = (vVl>this.xToFloat(vCalc.mx) && vCalc.mx.length>0 ? this.xToFloat(vCalc.vl) : (vVl<this.xToFloat(vCalc.mn) && vCalc.mn.length>0 ? this.xToFloat(vCalc.vl) : vVl)); break;
					}
					case "l": { //limit
						vVl = (vCalc.lm=="int" && vVl<=this.xToFloat(vCalc.mx) && vVl>=this.xToFloat(vCalc.mn) && vCalc.mx.length>0 && vCalc.mn.length>0 ? this.xToFloat(vCalc.vl) : (vCalc.lm=="ext" && vCalc.mx.length>0 && vCalc.mn.length>0 && (vVl>this.xToFloat(vCalc.mx) || vVl<this.xToFloat(vCalc.mn)) ? this.xToFloat(vCalc.vl) : vVl)); break;
					}
				}
			}
		}
		this.fIdxs[pId].cl[this.fIdxs[pId].cl.length] = vVl;
	},

/** topazeMgr.addIndexFunc() - Add an auto index free JS function. */
//   @param pId : index id
//   @param pFunc : fonction 
	addIndexFunc : function(pId,pFunc,pIdxPath){
		var vVl = null;
		try{
			vVl = pFunc();
			if (typeof vVl != "number") throw new Error(this.fStrings[3].replace("$s",vVl));
		} catch(e){
			alert(this.fStrings[2].replace("$s",pIdxPath) + "\n\n" + e);
		}
		this.fIdxs[pId].cl[this.fIdxs[pId].cl.length] = vVl;
	},

/** topazeMgr.getIndexVal() - return an index value. */
//   @param pId : index id
//   @param pType : index type (a=auto, s=step, u=user)
//   @param pDefaultVal : default value 
//   @returns index value
	getIndexVal : function(pId,pType,pNbInput,pDefaultVal){
		var vVl, vIdx, i;
		switch (pType){
			case "a": {
				this.fIndexVarCalc[pId].getCalc();
				vVl = 0;
				vIdx = this.fIdxs[pId];
				for (i = 0; i < vIdx.cl.length; i++) {
					vVl += vIdx.cl[i];
				}
				if (vIdx.md == "average") {
					vVl = vVl / vIdx.cl.length;
					return pNbInput?(this.xToFloat(vVl) * 100) / pNbInput + "%":this.xToFloat(vVl) * 100 + "%";
				} else return this.xToFloat(vVl);
				break;
			}
			case "s": {
				return (this.isNodeVisited(pId) ? 1 : 0);
				break;
			}
			default: {
				vVl = scServices.assmntMgr.getScorePts(pId, this.fSessKey)||pDefaultVal||"";
				return pType == "u" ? this.xToFloat(vVl):vVl; // if type = u (explicit) then garantee float.
			}
		}
	},

/** topazeMgr.setIndexVal() - set an index value. */
//   @param pId : index id
//   @param pVal : index value
	setIndexVal : function(pId, pVal){
		scServices.assmntMgr.setCompletionStatus(pId, this.fSessKey, "attempt");
		scServices.assmntMgr.setPts(pId, this.fSessKey, pVal, pVal, pVal);
		scServices.assmntMgr.commit();
	},

/** topazeMgr.setUserIndex() - set a user index. */
//   @param pId : index id
//   @param pInput : input DOM node
	setUserIndex : function(pId, pInput){
		pInput.value = pInput.value.replace(/,/g,"\.");
		if (pInput.value.search("^[0-9.]*$") != -1){
			this.setIndexVal(pId,pInput.value);
			this.xHasEmptyRequiredIndex(this.fIndexRequiredNodes,this.fArcRoot);
			this.initArc();
		} else {
			alert(this.fStrings[1]);
			pInput.value = pInput.fVal;
		}
	},

/** topazeMgr.getScore() */
//   @param pNodeId : Node ID
//   @param pSessKey : optionnal : session key
//   @returns the score of the node as a percentage
	getScore : function(pNodeId, pSessKey){
		pSessKey = pSessKey || this.fSessKey;
		if (!this.isNodeFinished(pNodeId, pSessKey)) return null;
		var vMin = scServices.assmntMgr.getMinPts(pNodeId, pSessKey);
		var vScore = scServices.assmntMgr.getScorePts(pNodeId, pSessKey);
		var vMax = scServices.assmntMgr.getMaxPts(pNodeId, pSessKey);
		return (vMax==vMin ? (vScore<=0 ? 0 : 100) : (vScore-vMin) / (vMax-vMin) * 100);
	},

/** topazeMgr.getScoreMax() */
//   @param pNodeId : Node ID
//   @param pSessKey : optionnal : session key
//   @returns the maximum or current score of the node as a percentage
	getScoreMax : function(pNodeId, pSessKey){
		pSessKey = pSessKey || this.fSessKey;
		if (!this.isNodeFinished(pNodeId, pSessKey)) return null;
		var vMin = scServices.assmntMgr.getMinPts(pNodeId, pSessKey);
		var vScore = scServices.assmntMgr.getResponse(pNodeId, pSessKey, "maxScorePts");
		if (typeof vScore == "undefined") vScore = scServices.assmntMgr.getScorePts(pNodeId, pSessKey);
		var vMax = scServices.assmntMgr.getMaxPts(pNodeId, pSessKey);
		return (vMax==vMin ? (vScore<=0 ? 0 : 100) : (vScore-vMin) / (vMax-vMin) * 100);
	},

/** topazeMgr.getScoreMin() */
//   @param pNodeId : Node ID
//   @param pSessKey : optionnal : session key
//   @returns the minimum or current score of the node as a percentage
	getScoreMin : function(pNodeId, pSessKey){
		pSessKey = pSessKey || this.fSessKey;
		if (!this.isNodeFinished(pNodeId, pSessKey)) return null;
		var vMin = scServices.assmntMgr.getMinPts(pNodeId, pSessKey);
		var vScore = scServices.assmntMgr.getResponse(pNodeId, pSessKey, "minScorePts");
		if (typeof vScore == "undefined") vScore = scServices.assmntMgr.getScorePts(pNodeId, pSessKey);
		var vMax = scServices.assmntMgr.getMaxPts(pNodeId, pSessKey);
		return (vMax==vMin ? (vScore<=0 ? 0 : 100) : (vScore-vMin) / (vMax-vMin) * 100);
	},

/** topazeMgr.setAppletIndex() - set a applet index. */
//   @param pId : index id
//   @param pVal : value
//   @returns true if success
	setAppletIndex : function(pId, pVal){
		scCoLib.util.log("topazeMgr.setAppletIndex - id="+pId+" value="+pVal);
		pVal = pVal.replace(/,/g,"\.");
		if (pVal.search("^[0-9.]*$") != -1){
			this.setIndexVal(pId,pVal);
			this.initArc();
			return true;
		} else {
			window.setTimeout("alert(topazeMgr.fStrings[1]);",10);
			return false;
		}
	},

/** topazeMgr.initVar() - Init an auto variable. */
	initVar : function(pId){
		this.fVars[pId] = {val:""};
	},

/** topazeMgr.addVarFunc() - Add an auto variable free JS function. */
//   @param pId : index id
//   @param pFunc : fonction 
	addVarFunc : function(pId,pFunc,pIdxPath){
		var vVl = null;
		try{
			vVl = pFunc();
		} catch(e){
			alert(this.fStrings[2].replace("$s",pIdxPath) + "\n\n" + e);
		}
		this.fVars[pId].val = vVl;
	},

/** topazeMgr.getVarVal() - return an variable value. */
//   @param pId : variable id
//   @param pType : variabe type (a=auto, u=user)
//   @param pDefaultVal : default value 
//   @returns variable value
	getVarVal : function(pId,pType,pDefaultVal){
		var vVl, vIdx, i;
		switch (pType){
			case "a": {
				this.fIndexVarCalc[pId].getCalc();
				vVar = this.fVars[pId];
				return (vVar) ? vVar.val : "";
				break;
			}
			default: {
				return scServices.assmntMgr.getResponse(pId, this.fSessKey, "val")||pDefaultVal||"";
			}
		}
	},

/** topazeMgr.setVarVal() - set an variable value. */
//   @param pId : variable id
//   @param pVal : variable value
	setVarVal : function(pId, pVal){
		scServices.assmntMgr.setCompletionStatus(pId, this.fSessKey, "attempt");
		scServices.assmntMgr.setResponse(pId, this.fSessKey, "val", pVal);
		scServices.assmntMgr.commit();
	},

/** topazeMgr.setUserVar() - set a user variable. */
//   @param pId : index id
//   @param pInput : input DOM node
	setUserVar : function(pId, pInput){
		this.setVarVal(pId,pInput.value);
		this.xHasEmptyRequiredIndex(this.fIndexRequiredNodes,this.fArcRoot);
		this.initArc();
	},

/** topazeMgr.xToFloat() - parseFloat wrapper. */
//   @param pX : input
//   @returns a float representation or 0 if input is NaN.
	xToFloat : function(pX){
		var vY;
		return isNaN(vY = parseFloat(pX))? 0 : vY;
	},
	
/** topazeMgr.xHasEmptyRequiredIndex() - teste si les userIndex passés en paramètre sont vides  et MAJ l'UI en conséquence */
	xHasEmptyRequiredIndex : function(pNodes,pArc){
		var a=0;
		for (var i in pNodes) {
			var vLnk = pNodes[i];
			if (vLnk.value!="") a++;
		}
		var vRequiredIndex = scPaLib.findNode("des:.required_index");
		if (a==pNodes.length) {
			pArc.style.visibility = "";
			if (vRequiredIndex) vRequiredIndex.style.display = "none";
		} else {
			pArc.style.visibility = "hidden";
			if (vRequiredIndex) vRequiredIndex.style.display = "";
		}
	},

	loadSortKey : "O"
}
scOnLoads[scOnLoads.length] = topazeMgr;

