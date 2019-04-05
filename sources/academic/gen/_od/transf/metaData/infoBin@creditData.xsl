<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" 
	xmlns:op="utc.fr:ics/opale3"
	exclude-result-prefixes="sc sp op">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	
	<xsl:template match="op:infoBin">
		<xsl:apply-templates select="*"/>
	</xsl:template>
	
	<xsl:template match="sp:cc"><xsl:text>http://creativecommons.org/licenses/</xsl:text><xsl:value-of select="."/><xsl:text>/2.0/fr/</xsl:text></xsl:template>
	
	<xsl:template match="sp:cpyrgt"><xsl:if test="preceding-sibling::sp:cc"><xsl:text>, </xsl:text></xsl:if><xsl:value-of select="normalize-space(.)"/></xsl:template>
		
	<xsl:template match="*"/>
	
</xsl:stylesheet>
