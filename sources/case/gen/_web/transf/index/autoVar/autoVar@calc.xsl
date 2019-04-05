<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:java="http://xml.apache.org/xslt/java" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp java opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:variable name="vId" select="alphaHash(getIdNode(.))"/>
		<xsl:if test="setEntryBuffer('indexStack', $vId)">
			topazeMgr.fIndexVarCalc["<xsl:value-of select="$vId"/>"] = {};
			topazeMgr.fIndexVarCalc["<xsl:value-of select="$vId"/>"].getCalc = function() {topazeMgr.initVar("<xsl:value-of select="$vId"/>");
			topazeMgr.addVarFunc("<xsl:value-of select="$vId"/>",function(){try{<xsl:value-of select="getContent(gotoSubModel(sp:js), 'calc')" disable-output-escaping="yes"/>}catch(e){throw new Error("erreur interne : "+e)}},"<xsl:value-of select="java:getSrcUri(srcFileAgent())"/>");
};
topazeMgr.fIndexVarCalc["<xsl:value-of select="$vId"/>"].getCalc();
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>