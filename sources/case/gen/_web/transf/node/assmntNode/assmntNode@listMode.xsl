<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:if test="opa:assmntNodeM/sp:quizView">
			<script type="text/javascript">
		tplMgr.fQuizzMode = "<xsl:value-of select="opa:assmntNodeM/sp:quizView"/>";
			</script>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>