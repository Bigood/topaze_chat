<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.utc.fr/ics/scenari/v3/core"
    xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:opa="kelis.fr:opa"
    xmlns:xalan="http://xml.apache.org/xalan" xmlns:redirect="http://xml.apache.org/xalan/redirect"
    extension-element-prefixes="xalan redirect">

    <xsl:output encoding="UTF-8" method="xml" />
    
	<xsl:template match="opa:assmntNode">
        <xsl:copy>
        	<xsl:if test="opa:nodeM">
        		<opa:assmntNodeM>
        			<xsl:if test="opa:nodeM/sp:title">
        				<xsl:copy-of select="opa:nodeM/sp:title" />
        			</xsl:if>
        			<xsl:if test="opa:nodeM/sp:sTitle">
        				<xsl:copy-of select="opa:nodeM/sp:sTitle" />
        			</xsl:if>
        			<xsl:if test="opa:nodeM/sp:info">
        				<xsl:copy-of select="opa:nodeM/sp:info" />
        			</xsl:if>
				</opa:assmntNodeM>
        	</xsl:if>
        	<xsl:apply-templates select="@*|node()"/>
        </xsl:copy>	
	</xsl:template>	
    
	<xsl:template match="opa:assmntNode/opa:nodeM"/>

    <xsl:template match="node() | @*">
        <xsl:copy>
            <xsl:apply-templates select="node() | @*" />
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>
