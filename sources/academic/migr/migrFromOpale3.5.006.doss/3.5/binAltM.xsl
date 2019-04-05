<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" 
		xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive"
		xmlns:op="utc.fr:ics/opale3"
		xmlns:xalan="http://xml.apache.org/xalan"
		xmlns:sfm="http://www.utc.fr/ics/scenari/v3/filemeta"
		exclude-result-prefixes="sc sp xalan op">
	<xsl:output encoding="UTF-8" method="xml"/>
	
	<xsl:param name="pCurrentItem"/>
	<xsl:param name="pCurrentItemUri"/>
	
	<xsl:template match="op:binAltM">
		<op:binAltM>
			<xsl:attribute name="xmlns:sc">http://www.utc.fr/ics/scenari/v3/core</xsl:attribute>
      <xsl:attribute name="xmlns:sp">http://www.utc.fr/ics/scenari/v3/primitive</xsl:attribute>
      <xsl:attribute name="xmlns:op">utc.fr:ics/opale3</xsl:attribute>
			<xsl:if test="sp:title">
				<xsl:copy-of select="sp:title"/>
			</xsl:if>
			<xsl:if test="sp:info">
				<xsl:copy-of select="sp:info"/>
			</xsl:if>
			<xsl:if test="sp:desc">
				<xsl:copy-of select="sp:desc"/>
			</xsl:if>
			<xsl:if test="sp:alt">
				<sp:altStatic>
					<xsl:copy-of select="sp:alt/*"/>
				</sp:altStatic>
			</xsl:if>
		</op:binAltM>
	</xsl:template>
	
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
	 	</xsl:copy>
	</xsl:template>
		
</xsl:stylesheet>
