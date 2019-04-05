<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<script type="text/JavaScript">document.write('&lt;input class="userIndex indexRequired_<xsl:value-of select="returnFirst(opa:userIndexM/sp:requiredInput,'no')"/>" type="text" onfocus="if(this.value.search(\'^[0-9.]*$\') != -1)this.fVal=this.value;" onkeyup="topazeMgr.setUserIndex(\'<xsl:value-of select="alphaHash(getIdNode(.))"/>\',this);" value="'+topazeMgr.getIndexVal("<xsl:value-of select="alphaHash(getIdNode(.))"/>")+'"/&gt;');</script>
	</xsl:template>
</xsl:stylesheet>