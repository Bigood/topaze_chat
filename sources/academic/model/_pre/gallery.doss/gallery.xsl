<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xul="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" version="1.0">

	<xsl:output method="xml" indent="no"/>

	<xsl:template match="*">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="sp:img"><xsl:if test="@sc:refUri"><xul:itemimage flex="1" refUri="{@sc:refUri}" scaleproportionnal="true" transform="transform=img2img&amp;outType=PNG&amp;sizeRules=Px(ScSCS(fontPt'10')Bounds(maxW'360'maxH'160'))"/></xsl:if></xsl:template>
	<xsl:template match="text()"/>
</xsl:stylesheet>

