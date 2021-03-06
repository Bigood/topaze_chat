<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">topazeMgr.getIndexVal("<xsl:value-of select="alphaHash(getIdNode(.))"/>","a"<xsl:if test="local-name(opa:autoIndexM/following-sibling::sp:*) = 'average' and contains(typeAgent(concat('@',gotoSubModel(//sp:input))),'Node')">,"<xsl:value-of select="count(//sp:input)"/>"</xsl:if>)</xsl:template>
</xsl:stylesheet>