<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:variable name="vUrl" select="getUrl(currentModel(), '')"/>
	<xsl:variable name="vTi" select="opa:nodeM/sp:title"/>
	<xsl:variable name="vId" select="getContent(currentModel(), 'id')"/>
	<xsl:template match="*">
		<xsl:if test="setEntryBuffer('stepsList',$vUrl)">
			<step title="{$vTi}" id="{$vId}" type="exp" followed="{si(getEntryBuffer('followedSteps',$vId)='true','true','false')}"/>
			<xsl:apply-templates select="sp:arc//sp:next | sp:arc//sp:otherwise"/>
		</xsl:if>
	</xsl:template>
	<xsl:template match="sp:arc//sp:next | sp:arc//sp:otherwise">
		<xsl:value-of select="getContent(gotoSubModel(), 'stepsList')" disable-output-escaping="yes"/>
	</xsl:template>
</xsl:stylesheet>