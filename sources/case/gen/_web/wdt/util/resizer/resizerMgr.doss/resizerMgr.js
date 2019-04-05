//Todo - Améliorer l'agrandissement sur un swf en inline fullescreen et incol -> à rendre plus fluide
//	   - Améliorer agrandissement d'une image dans le cas de inCol (permettre un rétrécissement en hauteur quand la fenetre est réduite en hauteur) -> cf tutorMgr dans mandra ...
var resizerMgr = {
	fPathResize : [],
	fTxtZne: null,
	fResZne : null,
	fResZneImg : null,
	fRatio : null,
	fTxtZneCls : "txtZne",
	fResZneCls : "resZne",
	fZneTop : "0"
}
/** resizerMgr.init. */
resizerMgr.init = function() {
	scCoLib.util.log("resizerMgr.init");
	this.fNavie = scCoLib.isIE && parseFloat(scCoLib.userAgent.substring(scCoLib.userAgent.indexOf("msie")+5)) < 11;
	this.fNavie6 = scCoLib.isIE && parseFloat(scCoLib.userAgent.substring(scCoLib.userAgent.indexOf("msie")+5)) < 7;
	this.fNavie7 = scCoLib.isIE && parseFloat(navigator.appVersion.split("MSIE")[1]) < 8;
	if (this.fNavie6) return;
	scOnLoads[scOnLoads.length] = this;
}
resizerMgr.onLoad = function() {		
	//Mis en commentaires pour compatibilité avec IE8 et FF3.6
	//try {
		this.xInitResourcesResizer(document.body,this.fPathResize.fOpts);
	/*}
	catch(e){
		scCoLib.util.logError("resizerMgr.onLoad::Error", e);
	}*/
}
/** resizerMgr.registerImages.
 * @param pPathResize scPaLib path vers le div qui contient l'image.
 * @param pOpts options de imageResizer.
 *           fullScreen : 0 -> si 1 avec resZne la ressource est centrée horizontalement et verticalement
 *           inLine : 0 -> si 1, la ressource et le texte sont centrés horizontalement et verticalement, si pas de texte comme fullScreen = 1
 *           inCol : 0 -> si 1, la ressource et le texte sont divisés en colonnes comme un texte illustré et centrés chacun verticalement, si pas de texte comme fullScreen = 1
 *           txtZneCls : "txtZne" -> classe pas défaut du texte
 *           resZneCls : "resZne" -> classe pas défaut de la ressource
 *           zneTop : 0 -> taille en pixel au dessus de resZne
 */
resizerMgr.registerResources = function(pPathResize,pOpts) {
	var vResResizer = new Object;
	vResResizer.fPath = pPathResize;
	vResResizer.fOpts = (typeof pOpts == "undefined" ? {fullScreen:0,inLine:0,inCol:0,txtZneCls:this.fTxtZneCls,resZneCls:this.fResZneCls,zneTop:this.fZneTop} : pOpts);
	vResResizer.fOpts.fullScreen = (typeof vResResizer.fOpts.fullScreen == "undefined" ? 0 : vResResizer.fOpts.fullScreen);
	vResResizer.fOpts.inLine = (typeof vResResizer.fOpts.inLine == "undefined" ? 0 : vResResizer.fOpts.inLine);
	vResResizer.fOpts.inCol = (typeof vResResizer.fOpts.inCol == "undefined" ? 0 : vResResizer.fOpts.inCol);
	vResResizer.fOpts.txtZneCls = (typeof vResResizer.fOpts.txtZneCls == "undefined" ? this.fTxtZneCls : vResResizer.fOpts.txtZneCls);
	vResResizer.fOpts.resZneCls = (typeof vResResizer.fOpts.resZneCls == "undefined" ? this.fResZneCls : vResResizer.fOpts.resZneCls);	
	vResResizer.fOpts.zneTop = (typeof vResResizer.fOpts.zneTop == "undefined" ? this.fZneTop : vResResizer.fOpts.zneTop);
	this.fPathResize[this.fPathResize.length] = vResResizer;
}
resizerMgr.xInitResourcesResizer = function(pCo,pOpts) {
	for(var i in this.fPathResize) {
		var vResourcesResizer = scPaLib.findNodes(this.fPathResize[i].fPath, pCo);
		for(var j in vResourcesResizer) this.xInitResourceResizer(vResourcesResizer[j],this.fPathResize[i].fOpts);
	}	
}
resizerMgr.xInitResourceResizer = function(pCo,pOpts) {	
	this.fTxtZne = scPaLib.findNode("des:."+pOpts.txtZneCls,pCo);
	this.fResZne = scPaLib.findNode("des:."+pOpts.resZneCls,pCo);
	//Possible problème sur ie avec la définition de resZne - a voir
	this.fResZneImg = scPaLib.findNode("des:img",this.fResZne);
	this.fResZneObj = scPaLib.findNode("des:object",this.fResZne);
	this.fRes = this.fResZneImg ? this.fResZneImg : this.fResZneObj;
	this.fResWidth = this.fRes.offsetWidth;
	this.fResHeight = this.fRes.offsetHeight;
	if (pOpts.inLine == 1 || pOpts.fullScreen == 1) this.xInLineResizer(pCo,pOpts);
	else if (pOpts.inCol == 1) this.xInColResizer(pCo,pOpts);
	else this.xInContentResizer(pCo,pOpts);
}
resizerMgr.xInLineResizer = function(pCo,pOpts){
	var vResWidth = this.fResWidth;
	var vResHeight = this.fResHeight;
	var vTxtZne = this.fTxtZne;
	var vResize = function() {
		var vCoWidth = pCo.innerHeight ? pCo.innerWidth : pCo.clientWidth;
		var vCoHeight = pCo.innerWidth ? pCo.innerHeight : pCo.clientHeight;
		// MAEN - Suppression du redimensionnement par rapport aux marges du tplCo avec le tplMain (ne marche que pour la position absolue)
		// vCoWidth = vCoWidth - (scCoLib.toInt(pCo.offsetLeft) + scCoLib.toInt(pCo.offsetRight));
		// vCoHeight = (vTxtZne && vTxtZne.innerHTML != "" ? vCoHeight-vTxtZne.offsetHeight : vCoHeight) - (scCoLib.toInt(pCo.offsetTop) + scCoLib.toInt(pCo.offsetBottom) + scCoLib.toInt(pOpts.zneTop));
		var vImgRatio = vResWidth/vResHeight;
		var vH = vResHeight + scCoLib.toInt(pOpts.zneTop) > vCoHeight ? (vTxtZne && vTxtZne.innerHTML != "" ? vCoHeight-vTxtZne.offsetHeight : vCoHeight) : vResHeight;
		var vW = vH*vImgRatio > vCoWidth ? vCoWidth : vH*vImgRatio;		
		resizerMgr.fRes.width = vW;
		resizerMgr.fRes.height = vH;
		resizerMgr.fRatio = vW/vResWidth;
	}
	vResize();
	this.xAddEvent(window, 'resize', vResize, false);
	this.xCenterResZne(pCo,pOpts);
}
//A améliorer pour permettre le choix de la taille en options
resizerMgr.xInColResizer = function(pCo,pOpts){	
	if (this.fTxtZne.innerHTML != "") {
		var vResWidth = this.fResWidth;
		var vResHeight = this.fResHeight;
		var vTxtZne = this.fTxtZne;
		var vResZne = this.fResZne;
		vTxtZne.style.left = "50%";
		vTxtZne.style.width = "50%";
		vTxtZne.style.overflowX = "hidden";
		vTxtZne.style.overflowY = "auto";
		vTxtZne.style.position = "absolute";
		vTxtZne.style.paddingLeft = "10px";	
		vResZne.style.width = "50%";
		vResZne.style.position = "absolute";
		vResZne.style.textAlign = "center";
		pCo.style.overflow = "hidden";				
		var vResize = function() {
			var vCoWidth = pCo.innerHeight ? pCo.innerWidth : pCo.clientWidth;
			var vCoHeight = pCo.innerWidth ? pCo.innerHeight : pCo.clientHeight;
			// MAEN - Suppression du redimensionnement par rapport aux marges du tplCo avec le tplMain (ne marche que pour la position absolue)
			// vCoWidth = vCoWidth - (scCoLib.toInt(pCo.offsetLeft) + scCoLib.toInt(pCo.offsetRight));
			// vCoHeight = vCoHeight - (scCoLib.toInt(pCo.offsetTop) + scCoLib.toInt(pCo.offsetBottom) + scCoLib.toInt(pOpts.zneTop));
			var vTxtZneHeight = vTxtZne.innerWidth ? vTxtZne.innerHeight : vTxtZne.offsetHeight;
			var vTxtZneWidth = vTxtZne.innerHeight ? vTxtZne.innerWidth : vTxtZne.offsetWidth;
			var x = Math.ceil((vCoHeight - vTxtZneHeight) / 2);
			vTxtZne.style.top = vTxtZneHeight > vCoHeight ? pOpts.zneTop + "px" :  x < pOpts.zneTop ? pOpts.zneTop : x + "px";
			vTxtZne.style.bottom = vTxtZneHeight > vCoHeight ? 0 : "auto";	
			var vResZneWidth = vResZne.innerHeight ? vResZne.innerWidth : vResZne.offsetWidth;
			var vW = vResWidth > (vCoWidth-vTxtZneWidth) ? (vCoWidth-vTxtZneWidth) : vResWidth;
			var vH = (vResHeight*vW)/vResWidth;			
			resizerMgr.fRes.width = vW;
			resizerMgr.fRes.height = vH;
			resizerMgr.fRatio = vW/vResWidth;
			var y = Math.ceil((vCoHeight - (vH)) / 2);
			vResZne.style.top = y < pOpts.zneTop ? pOpts.zneTop : y + "px";
		}
		vResize();
		this.xAddEvent(window, 'resize', vResize, false);
	} else this.xInLineResizer(pCo,pOpts);
}
resizerMgr.xInContentResizer = function(pCo,pOpts){
	var vRszImg = scPaLib.findNode("des:img", pCo);
	var vRszObj = scPaLib.findNode("des:object", pCo);
	if (vRszImg) {
		vRszImg.style.maxWidth = vRszImg.getAttribute("width") + "px";
		vRszImg.style.maxHeight = vRszImg.getAttribute("height") + "px";
		if (this.fNavie7) vRszImg.style.width = "100%";
		else vRszImg.setAttribute("width","100%");
		if (this.fNavie7) vRszImg.style.height = "100%";
		else if (this.fNavie) vRszImg.setAttribute("height","100%");
		else vRszImg.setAttribute("height","auto");
	} else if(vRszObj) {
		var vRszObjWidth = vRszObj.width;
		var vRszObjHeight = vRszObj.height;
		var vRszObjResizer = function() {				
			var vCoWidth = pCo.innerHeight ? pCo.innerWidth : pCo.clientWidth;
			vRszObj.width = vRszObjWidth > vCoWidth ? vCoWidth : vRszObjWidth;
			vRszObj.height = vRszObjWidth > vCoWidth ? (vCoWidth*vRszObjHeight)/vRszObjWidth : vRszObjHeight;
		}
		this.xAddEvent(window, 'load', vRszObjResizer, false);
		this.xAddEvent(window, 'resize', vRszObjResizer, false);
	}
}
resizerMgr.xCenterResZne = function(pCo,pOpts){	
	var vTxtZne = this.fTxtZne;
	var vResZne = this.fResZne;
	if (vResZne) vResZne.style.position = "absolute";
	if (vTxtZne) vTxtZne.style.position = "absolute";
	vResZne.style.left = "50%";	
	var vAlign = function() {				
		var vResZneWidth = resizerMgr.fRes.innerHeight ? resizerMgr.fRes.innerWidth : resizerMgr.fRes.offsetWidth;
		var vCoHeight = pCo.innerWidth ? pCo.innerHeight : pCo.clientHeight;
		var vResZneHeight = resizerMgr.fRes.innerWidth ? resizerMgr.fRes.innerHeight : resizerMgr.fRes.clientHeight;
		var vTxtZneHeight = vTxtZne && vTxtZne.innerHTML != "" ? (vTxtZne.innerWidth ? vTxtZne.innerHeight : vTxtZne.clientHeight) : 0;
		var y = Math.ceil((vCoHeight - (vResZneHeight+vTxtZneHeight)) / 2);
		vResZne.style.marginLeft = "-" + vResZneWidth/2 + "px";
		vResZne.style.top = y < pOpts.zneTop ? pOpts.zneTop : y + "px";
		if (vTxtZne) vTxtZne.style.top = scCoLib.toInt(resizerMgr.fRes.height) + scCoLib.toInt(vResZne.offsetTop) + scCoLib.toInt(pOpts.zneTop) + "px";
	}
	vAlign();
	this.xAddEvent(window, 'resize', vAlign, false);
}
resizerMgr.xAddEvent = function(elt, event, fctn, capture) {
	return document.addEventListener ? elt.addEventListener(event, fctn, capture): elt.attachEvent ? elt.attachEvent('on' + event, fctn): false;
}