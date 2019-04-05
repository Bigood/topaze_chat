<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:java="http://xml.apache.org/xslt/java" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp java opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:value-of select="execute(initBuffer('hasRefs',java:java.util.HashSet.new()))"/>
		<xsl:variable name="hasRefs"><xsl:value-of select="getContent(gotoSubModel(sp:start), 'hasRefs')" disable-output-escaping="yes"/></xsl:variable>
		<xsl:value-of select="contains($hasRefs,'1')"/>
		<xsl:value-of select="execute(initBuffer('hasRefs'))"/>
	</xsl:template>
</xsl:stylesheet>