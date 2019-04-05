<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:variable name="vId" select="alphaHash(getIdNode(.))"/>
		<xsl:if test="setEntryBuffer('indexStack', $vId)">
			topazeMgr.fIndexVarCalc["<xsl:value-of select="$vId"/>"] = {};
			topazeMgr.fIndexVarCalc["<xsl:value-of select="$vId"/>"].getCalc = function() {topazeMgr.initIndex("<xsl:value-of select="$vId"/>","<xsl:value-of select="local-name(opa:autoIndexM/following-sibling::sp:*)"/>");<xsl:choose>
				<xsl:when test="sp:random">
					<xsl:value-of select="getContent(currentModel(), 'calcRand')" disable-output-escaping="yes"/>
				</xsl:when>
				<xsl:when test="sp:js">
					<xsl:value-of select="getContent(currentModel(), 'calcJs')" disable-output-escaping="yes"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="getContent(currentModel(), 'calcInput')" disable-output-escaping="yes"/>
				</xsl:otherwise>
			</xsl:choose>
};
topazeMgr.fIndexVarCalc["<xsl:value-of select="$vId"/>"].getCalc();
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>