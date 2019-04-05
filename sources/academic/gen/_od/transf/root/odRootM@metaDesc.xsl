<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" 
	xmlns:op="utc.fr:ics/opale3"
	exclude-result-prefixes="sc sp op">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	
	<xsl:template match="op:odRootM">
		<xsl:text>￼Construit par la solution SCENARI (http://scenari-platform.org)
Chaine éditoriale Opale￼</xsl:text>
		<xsl:apply-templates select="*"/>
	</xsl:template>
	
	<xsl:template match="sp:version">
- ￼Version￼	: <xsl:value-of select="."/></xsl:template>
		
	<xsl:template match="sp:date">
- ￼Date￼		: <xsl:value-of select="."/></xsl:template>
	
	<xsl:template match="sp:auth">
- ￼Copyright￼	: <xsl:value-of select="normalize-space(.)"/></xsl:template>
		
	<xsl:template match="*"/>
	
</xsl:stylesheet>

