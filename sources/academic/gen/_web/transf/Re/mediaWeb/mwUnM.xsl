<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:of="utc.fr:ics/opale3" exclude-result-prefixes="sc sp xhtml">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:if test="sp:align and sp:align != 'auto'">
			<addAttribute name="style" filter="textOnly">text-align:<xsl:value-of select="sp:align"/>;</addAttribute>
		</xsl:if>
		<xsl:apply-templates select="parseXml(concat('&lt;root&gt;',sp:frag/text(),'&lt;/root&gt;'))/root/*" mode="copy"/>
	</xsl:template>
	<!-- mode copy : copy nodes without namespaces -->
	<xsl:template match="*" mode="copy">
		<xsl:element name="{local-name()}">
			<xsl:apply-templates select="@* | node()" mode="copy"/>
		</xsl:element>
	</xsl:template>
	<xsl:template match="@*" mode="copy">
		<xsl:attribute name="{local-name()}">
			<xsl:value-of select="."/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="text() | comment() | processing-instruction()" mode="copy">
		<xsl:copy/>
	</xsl:template>
</xsl:stylesheet>