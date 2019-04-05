<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  xmlns:java="http://xml.apache.org/xslt/java"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  exclude-result-prefixes="java" version="1.0">
  <xsl:output encoding="UTF-8" method="xml" indent="yes"/>
  <xsl:param name="vDialog"/>
  <xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:value-of select="getContent(rootModel(), 'manifest')" disable-output-escaping="yes"/>     
	</xsl:template>
</xsl:stylesheet>
