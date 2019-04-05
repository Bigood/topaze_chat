<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" xmlns:java="http://xml.apache.org/xslt/java" exclude-result-prefixes="sc sp opa java">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:variable name="vId" select="alphaHash(getIdNode(.))"/>
		topazeMgr.addIndexFunc("<xsl:value-of select="$vId"/>",function(){try{<xsl:value-of select="getContent(gotoSubModel(sp:js), 'calc')" disable-output-escaping="yes"/>}catch(e){throw new Error("erreur interne : "+e)}},"<xsl:value-of select="java:getSrcUri(srcFileAgent())"/>");
	</xsl:template>
</xsl:stylesheet>