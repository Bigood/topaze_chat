<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:java="http://xml.apache.org/xslt/java" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:apply-templates select="opa:scormRootM"/>
	</xsl:template>
	<xsl:template match="opa:scormRootM">
		<xsl:value-of select="initBuffer('followedSteps', java:java.util.HashMap.new())"/>
		<xsl:if test="sp:steps">
			<xsl:for-each select="sp:steps/sp:step">
				<xsl:value-of select="execute(setEntryBuffer('followedSteps',getContent(gotoSubModel(.),'id'),'true'))"/>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>