<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" exclude-result-prefixes="sc">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="progressStatus">
		<div class="evalCounterSeen"><xsl:value-of select="@seen"/></div><div class="evalCounterOver">/</div><div class="evalCounterTotal"><xsl:value-of select="@total"/></div>
	</xsl:template>
</xsl:stylesheet>
