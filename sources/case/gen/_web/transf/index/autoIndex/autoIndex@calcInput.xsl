<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:variable name="vId" select="alphaHash(getIdNode(.))"/>
		<xsl:for-each select="//sp:input">
				<xsl:value-of select="getContent(gotoSubModel(.), 'calc')" disable-output-escaping="yes"/>
			topazeMgr.addIndexCalc("<xsl:value-of select="$vId"/>",<xsl:value-of select="getContent(gotoSubModel(.), 'val')" disable-output-escaping="yes"/>
				<xsl:if test="opa:inputM/sp:form">,[<xsl:apply-templates select="opa:inputM/sp:form/*" mode="form"/>]</xsl:if>);</xsl:for-each>
	</xsl:template>
	<xsl:template match="sp:rate" mode="form">{op:"r",vl:"<xsl:value-of select="text()"/>"}<xsl:if test="count(following-sibling::sp:*)">,</xsl:if></xsl:template>
	<xsl:template match="sp:translate" mode="form">{op:"t",vl:"<xsl:value-of select="text()"/>"}<xsl:if test="count(following-sibling::sp:*)">,</xsl:if></xsl:template>
	<xsl:template match="sp:map" mode="form">{op:"m",vl:"<xsl:value-of select="sp:val/text()"/>",mx:"<xsl:value-of select="sp:sup/text()"/>",mn:"<xsl:value-of select="sp:inf/text()"/>"}<xsl:if test="count(following-sibling::sp:*)">,</xsl:if></xsl:template>
	<xsl:template match="sp:limit" mode="form">{op:"l",vl:"<xsl:value-of select="sp:val/text()"/>",lm:"<xsl:value-of select="sp:map/text()"/>",mx:"<xsl:value-of select="sp:max/text()"/>",mn:"<xsl:value-of select="sp:min/text()"/>"}<xsl:if test="count(following-sibling::sp:*)">,</xsl:if></xsl:template>
</xsl:stylesheet>