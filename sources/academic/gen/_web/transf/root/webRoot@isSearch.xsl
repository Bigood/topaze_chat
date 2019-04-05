<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:op="utc.fr:ics/opale3" exclude-result-prefixes="sc sp">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:if test="op:webRootM/sp:searchSettings/sp:searchEngine='treeResults' or op:webRootM/sp:searchSettings/sp:searchEngine='listResults'">
			<optScSearch searchType="{returnFirst(op:webRootM/sp:searchSettings/sp:searchEngine,'treeResults')}">
				<div class="searchFra">
				</div>
				<div class="searchResults">
				</div>
				<script type="text/JavaScript">
					<xsl:value-of select="getContent(rootModel(),'initSearchMgr')" disable-output-escaping="yes"/>
				</script>
			</optScSearch>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>