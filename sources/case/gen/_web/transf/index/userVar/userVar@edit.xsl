<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<script type="text/JavaScript">document.write('&lt;input class="userIndex indexRequired_<xsl:value-of select="returnFirst(opa:userVarM/sp:requiredInput,'no')"/>" type="text" onfocus="" onkeyup="topazeMgr.setUserVar(\'<xsl:value-of select="alphaHash(getIdNode(.))"/>\',this);" value="'+topazeMgr.getVarVal("<xsl:value-of select="alphaHash(getIdNode(.))"/>").replace(/"/g,'&amp;quot;').replace(/&lt;/g,'&amp;lt;')+'"/&amp;gt;');</script>
	</xsl:template>
</xsl:stylesheet>