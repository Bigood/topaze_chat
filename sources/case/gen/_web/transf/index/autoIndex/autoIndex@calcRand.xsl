<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" xmlns:java="http://xml.apache.org/xslt/java" exclude-result-prefixes="sc sp opa java">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:variable name="vId" select="alphaHash(getIdNode(.))"/>
		<xsl:variable name="vPersistance" select="returnFirst(//sp:random/opa:auroIndexRandom/sp:persistance, 'none')"/>
		<xsl:variable name="vMin" select="returnFirst(//sp:random/opa:auroIndexRandom/sp:min, 0)"/>
		<xsl:variable name="vMax" select="returnFirst(//sp:random/opa:auroIndexRandom/sp:max, 1)"/>
		topazeMgr.addIndexFunc("<xsl:value-of select="$vId"/>",function(){try{<xsl:choose>
			<xsl:when test="$vPersistance='page'">if (!topazeMgr.<xsl:value-of select="$vId"/>) topazeMgr.<xsl:value-of select="$vId"/> = Math.floor(Math.random() * (<xsl:value-of select="$vMax"/> - <xsl:value-of select="$vMin"/> + 1)) + <xsl:value-of select="$vMin"/>; return topazeMgr.<xsl:value-of select="$vId"/>;</xsl:when>
			<xsl:when test="$vPersistance='session'">var vVal = topazeMgr.getIndexVal("<xsl:value-of select="$vId"/>","u"); if (!vVal) {vVal = Math.floor(Math.random() * (<xsl:value-of select="$vMax"/> - <xsl:value-of select="$vMin"/> + 1)) + <xsl:value-of select="$vMin"/>; topazeMgr.setIndexVal("<xsl:value-of select="$vId"/>", vVal);} return vVal;</xsl:when>
			<xsl:otherwise>return Math.floor(Math.random() * (<xsl:value-of select="$vMax"/> - <xsl:value-of select="$vMin"/> + 1)) + <xsl:value-of select="$vMin"/>;</xsl:otherwise>
		</xsl:choose>}catch(e){throw new Error("erreur interne : "+e)}},"<xsl:value-of select="java:getSrcUri(srcFileAgent())"/>");
	</xsl:template>
</xsl:stylesheet>