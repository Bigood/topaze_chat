<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:apply-templates select="opa:scormRootM"/>
	</xsl:template>
	<xsl:template match="opa:scormRootM">
		<script type="text/JavaScript">
			scServices.scormTopaze.register("<xsl:value-of select="getContent(gotoSubModel(sp:globalIndex),'id')"/>","globalIndex","<xsl:value-of select="getContent(gotoSubModel(sp:globalIndex),'type')"/>");
			<xsl:for-each select="sp:indexes/sp:index">scServices.scormTopaze.register("<xsl:value-of select="getContent(gotoSubModel(.),'id')"/>","index","<xsl:value-of select="getContent(gotoSubModel(.),'type')"/>");</xsl:for-each>
			
			<xsl:if test="sp:timeBeforeStopChrono">
				scServices.scormTopaze.fTimeBeforeStopChronoUser= <xsl:value-of select="sp:timeBeforeStopChrono"/>;
			</xsl:if>
			<xsl:choose>
				<xsl:when test="sp:routes = 'yes'">
						scServices.scormTopaze.register();
				</xsl:when>
				<xsl:otherwise>
					<xsl:for-each select="sp:steps/sp:step">scServices.scormTopaze.register("<xsl:value-of select="getContent(gotoSubModel(.),'id')"/>","step","<xsl:value-of select="getUrl(gotoSubModel(.))"/>");</xsl:for-each>
				</xsl:otherwise>
			</xsl:choose>
		</script>
	</xsl:template>
</xsl:stylesheet>