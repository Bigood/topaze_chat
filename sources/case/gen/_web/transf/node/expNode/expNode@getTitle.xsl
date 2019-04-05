<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:variable name="vUrl" select="getUrl(currentModel(), '')"/>
	<xsl:template match="*">
		<xsl:if test="opa:nodeM/sp:title">
			<xsl:value-of select="opa:nodeM/sp:title" disable-output-escaping="yes"/>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>