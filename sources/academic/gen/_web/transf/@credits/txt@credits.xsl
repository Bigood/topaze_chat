<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" exclude-result-prefixes="sc sp">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>

	<xsl:template match="*">
		<xsl:apply-templates mode="in"/>
	</xsl:template>
	<xsl:template match="sc:uLink[@role='docLnk']" mode="in">
		<xsl:value-of select="getContent(gotoSubModel(),'credits')" disable-output-escaping="yes"/>
	</xsl:template>
	<xsl:template match="sc:uLink[@role='resLnk']" mode="in">
		<xsl:value-of select="getContent(gotoSubModel(),'credits')" disable-output-escaping="yes"/>
	</xsl:template>
	<xsl:template match="sc:inlineImg[@role='form']" mode="in">
		<xsl:value-of select="getContent(gotoSubModel(),'credits')" disable-output-escaping="yes"/>
	</xsl:template>
	<xsl:template match="sc:inlineImg[@role='ico']" mode="in">
		<xsl:value-of select="getContent(gotoSubModel(),'credits')" disable-output-escaping="yes"/>
	</xsl:template>
	<xsl:template match="*" mode="in">
		<xsl:apply-templates mode="in"/>
	</xsl:template>
	<xsl:template match="text()" mode="in"/>
</xsl:stylesheet>