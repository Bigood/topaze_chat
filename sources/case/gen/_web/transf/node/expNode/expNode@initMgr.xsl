<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:java="http://xml.apache.org/xslt/java" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" exclude-result-prefixes="sc sp java">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:variable name="vId" select="alphaHash(getIdNode(..))"/>
	<xsl:template match="*">
		<script type="text/JavaScript">
			topazeMgr.fNodeId = "<xsl:value-of select="$vId"/>";
			topazeMgr.fNodeType = "exp";
		</script>
	</xsl:template>
</xsl:stylesheet>