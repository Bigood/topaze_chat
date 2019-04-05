<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" 
		xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive"
		xmlns:op="utc.fr:ics/opale3"
		xmlns:xalan="http://xml.apache.org/xalan"
		exclude-result-prefixes="sc sp xalan op">
	<xsl:output encoding="UTF-8" method="xml"/>
	
	<xsl:param name="pCurrentItem"/>
	<xsl:param name="pCurrentItemUri"/>
	
	<xsl:template match="op:listingTxt">
		<op:code>
			<xsl:variable name="vCommentCount" select="count(descendant::sc:textLeaf[@role='note'])"/>
			<xsl:if test="$vCommentCount>0"><xsl:comment>ATTENTION - Migration Opale 3.5 listing vers code : ce listing contenait <xsl:value-of select="$vCommentCount"/> commentaires qui ont été migrés en texte simple.</xsl:comment></xsl:if>
			<sc:code mimeType="text/plain"><xsl:apply-templates mode="para"/></sc:code>
		</op:code>
	</xsl:template>
	
	<xsl:template match="sc:para" mode="para"><xsl:apply-templates mode="codeText"/><xsl:if test="count(following-sibling::sc:para)>0"><xsl:text>
</xsl:text></xsl:if></xsl:template>
	<xsl:template match="node()" mode="para"/>
	
	<xsl:template match="sc:textLeaf[@role='note']" mode="codeText"><xsl:apply-templates mode="codeText"/></xsl:template>
	<xsl:template match="text()" mode="codeText"><xsl:value-of select="."/></xsl:template>
	<xsl:template match="*" mode="codeText"/>
	
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
	 	</xsl:copy>
	</xsl:template>
		
</xsl:stylesheet>