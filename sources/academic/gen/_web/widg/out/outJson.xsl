<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:redirect="com.scenari.xsldom.xalan.lib.Redirect" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:java="http://xml.apache.org/xslt/java" extension-element-prefixes="redirect" exclude-result-prefixes="sc java xhtml" version="1.0">
	<xsl:output omit-xml-declaration="yes" indent="no" method="xml"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="treeContent">{menu:{"children":[<xsl:apply-templates/>]}}</xsl:template>
	<xsl:template match="entry">
		<xsl:variable name="vClass" select="computeStrDialog(concat(@dialog, '/outlineClasses'))"/>
		<xsl:variable name="vUrl" select="substring(computeStrDialog(string(@dialog), 'actUri:'),2)"/>
		<xsl:variable name="vSubUrl" select="substring(computeStrDialog(string(entry[1]/@dialog), 'actUri:'),2)"/>
		<xsl:variable name="vIsFolder" select="$vSubUrl = $vUrl"/>
		<xsl:variable name="vPageDialog" select="dialog(string(@dialog))"/>
		<xsl:variable name="vSource" select="returnFirst(root,'unknown')"/>{"url":"<xsl:value-of select="if($vIsFolder,'null',$vUrl)"/>","label":"<xsl:value-of select="escapeJs(@title)"/>","source":"<xsl:value-of select="escapeJs($vSource)"/>","className":"<xsl:value-of select="escapeJs($vClass)"/>","id":"<xsl:value-of select="alphaHash(codeAgent(agent('//', $vPageDialog)))"/>"<xsl:if test="entry">,"children":[<xsl:for-each select="entry">
				<xsl:apply-templates select="."/>
			</xsl:for-each>]</xsl:if>}<xsl:if test="following-sibling::entry">,</xsl:if></xsl:template>
	<xsl:template match="node()"/>
</xsl:stylesheet>