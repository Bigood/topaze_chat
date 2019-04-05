<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:apply-templates select="opa:scormRootM"/>
	</xsl:template>
	<xsl:template match="opa:scormRootM">
		<indexes>
			<xsl:if test="sp:globalIndex">
				<globalIndex id="{getContent(gotoSubModel(sp:globalIndex),'id')}" title="{getFullTitleText(gotoSubModel(sp:globalIndex))}" type="{si(getContent(gotoSubModel(.),'type') = 'iu','userindex','autoindex')}"/>
			</xsl:if>
			<xsl:for-each select="sp:indexes/sp:index">
				<xsl:if test="getContent(gotoSubModel(.),'id') != getContent(gotoSubModel(preceding-sibling::sp:index),'id')">
					<index id="{getContent(gotoSubModel(.),'id')}" title="{getFullTitleText(gotoSubModel(.))}" type="{si(getContent(gotoSubModel(.),'type') = 'iu','userindex','autoindex')}"/>
				</xsl:if>
			</xsl:for-each>
		</indexes>
	</xsl:template>
</xsl:stylesheet>