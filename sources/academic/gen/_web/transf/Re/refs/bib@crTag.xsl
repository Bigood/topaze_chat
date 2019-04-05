<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:op="utc.fr:ics/opale3" 
	xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" 
	xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" exclude-result-prefixes="sc sp">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:choose>
			<xsl:when test="op:bibM/sp:type='web'">
				<crossRef>
					<entry keyRef="bib_web" value="{getIdNode(..)}"/>
				</crossRef>
			</xsl:when>
			<xsl:otherwise>
				<crossRef>
					<entry keyRef="bib" value="{getIdNode(..)}"/>
				</crossRef>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>

