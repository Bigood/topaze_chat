<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.utc.fr/ics/scenari/v3/core"
    xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:opa="kelis.fr:opa"
    xmlns:xalan="http://xml.apache.org/xalan" xmlns:redirect="http://xml.apache.org/xalan/redirect"
    extension-element-prefixes="xalan redirect">

    <xsl:output encoding="UTF-8" method="xml" />
	
	<xsl:param name="pWspPath"/>
	
	<!-- ### 
		# Retourne le local-name() du modèle fils (internalisé ou externalisé)
		### -->
	<xsl:template name="tGetSubModelType">
		<xsl:choose>
			<xsl:when test="//sp:left/@sc:refUri"><!-- item externalisé -->
				<xsl:value-of select="local-name(document(concat($pWspPath,'/',//sp:left/@sc:refUri))/*/*[1])"/>
			</xsl:when>
			<xsl:otherwise><!-- item internalisé -->
				<xsl:value-of select="local-name(*[1])"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>    
	
	<xsl:template match="opa:chooseArc//opa:condM">
		<xsl:variable name="vSubModelType"><xsl:call-template name="tGetSubModelType"/></xsl:variable>
		<xsl:choose>
			<xsl:when test="substring-after(descendant::sp:left/@sc:refUri, '.') = 'node' and ($vSubModelType='expNode' or $vSubModelType='heavyNode')">
				<opa:condSimpleM>
					<xsl:copy-of select="sp:left"/>
					<sp:right>
						<xsl:if test="sp:op='='">
							<xsl:value-of select="sp:right"/>
						</xsl:if>
					</sp:right>
				</opa:condSimpleM>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy>
					<xsl:apply-templates select="@*|node()"/>
				</xsl:copy>
			</xsl:otherwise>
		</xsl:choose>			
	</xsl:template>

    <xsl:template match="node() | @*">
        <xsl:copy>
            <xsl:apply-templates select="node() | @*" />
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>
