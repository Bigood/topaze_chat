<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" xmlns:java="http://xml.apache.org/xslt/java" exclude-result-prefixes="sc sp opa java">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:value-of select="execute(initBuffer('stepsList',java:java.util.HashSet.new()))"/>
		<xsl:value-of select="getContent(gotoSubModel(sp:start), 'stepsList')" disable-output-escaping="yes"/>
		<xsl:value-of select="execute(initBuffer('stepsList'))"/>
	</xsl:template>
</xsl:stylesheet>