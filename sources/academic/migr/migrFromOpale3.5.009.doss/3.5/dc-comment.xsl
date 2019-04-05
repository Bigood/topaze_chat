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
	
	<xsl:template match="sp:dc[op:dc]">
		<xsl:comment>Une structure Dublin-Core non reconnue à partir de Opale 3.5 à été supprimé. Ci-dessous les contenus textuels résiduels:
			<xsl:copy>
				<xsl:apply-templates select="@*|node()" mode="nocomments"/>
			</xsl:copy>
		</xsl:comment>
	</xsl:template>
	
	<xsl:template match="@*|node()" mode="nocomments">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()" mode="nocomments"/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="comment()" mode="nocomments"/>
		
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
	 	</xsl:copy>
	</xsl:template>
		
</xsl:stylesheet>
