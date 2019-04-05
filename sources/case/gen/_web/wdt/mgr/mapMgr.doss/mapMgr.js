/**
 * Map manager.
 */
var mapMgr = {
	fMapRoot : null,
	fMapNodes : null,
	fHistMgr : null,
	fMapRootPath : "ide:map",
	fImgClass : "visualMap_img",
	fEnLnkClass : "enabled_entry",
	fDisLnkClass : "disabled_entry",
	init : function(){
		scOnLoads[scOnLoads.length] = this;
	},
	onLoad : function(){
		try {
			this.fMapRoot = scPaLib.findNode(this.fMapRootPath);
			this.fMapNodes = scPaLib.findNodes("des:area." + this.fEnLnkClass, this.fMapRoot);
			this.fImg = scPaLib.findNode("des:."+this.fImgClass);
			if(this.fImg) {
				var vCoords=[];
				if (!histMgr) return;
				this.fHistMgr = new histMgr;
				for (var i in this.fMapNodes) {
					var vLnk = this.fMapNodes[i];
					vCoords[i] = vLnk.coords.split(",");
					vLnk.setAttribute('data-maphighlight','{"strokeColor":"00be00"}');
					if (vLnk.className.indexOf("area")>0) this.fMapRoot.removeChild(vLnk);
					if (vLnk.className.indexOf("click")>0 && !this.fHistMgr.isInHistory(vLnk.href)){
						vLnk.href = "#";
						vLnk.onclick = function() {return false;}
						vLnk.setAttribute('data-maphighlight','{"strokeColor":"ff0000"}');
						vLnk.className = vLnk.className.replace(this.fEnLnkClass, this.fDisLnkClass);
					}
				}
				vResizeAreas = function() {
					var vRatio = resizerMgr.fRatio;
					for (var i in mapMgr.fMapNodes) {
						var vArea = mapMgr.fMapNodes[i];
						var vNewCoords = [];
						for(j = 0; j < vCoords[i].length; j++) vNewCoords[j] = vCoords[i][j]*vRatio;
						vArea.coords = vNewCoords.join(",");
					}
					scMapMgr.maphighlight(mapMgr.fImg, scMapMgr.extend({shadow:true}));
					// Modification des propriétés CSS de la div encadrant l'image et la map pour la faire fonctionner avec le resizeMgr
					scPaLib.findNode("des:div."+mapMgr.fImgClass).style.backgroundRepeat = "no-repeat";
					scPaLib.findNode("des:div."+mapMgr.fImgClass).style.backgroundSize = 100+"% auto";
				}
				setTimeout(vResizeAreas,500);		
				this.xAddEvent(window, 'resize', vResizeAreas, false);
			}
		} catch(e){
			scCoLib.util.logError("mapMgr.init::Error", e);
		}
	},
	xAddEvent: function(elt, event, fctn, capture) {
		return document.addEventListener ? elt.addEventListener(event, fctn, capture): elt.attachEvent ? elt.attachEvent('on' + event, fctn): false;
	},
	loadSortKey : "ZMapMgr"
}