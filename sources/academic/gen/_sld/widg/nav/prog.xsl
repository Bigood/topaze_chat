<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:redirect="com.scenari.xsldom.xalan.lib.Redirect" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:java="http://xml.apache.org/xslt/java" extension-element-prefixes="redirect" exclude-result-prefixes="sc xhtml java" version="1.0">
	<xsl:output omit-xml-declaration="yes" indent="no" method="xml"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:variable name="vBufJs" select="java:java.lang.StringBuffer.new()"/>
	<xsl:template match="treeContent">
		<xsl:if test="entry">
			<xsl:apply-templates/>
			<progMgrInit>
				<script type="text/javascript">
					<xsl:value-of select="java:toString($vBufJs)"/>
				</script>
			</progMgrInit>
		</xsl:if>
	</xsl:template>
	<xsl:template match="entry">
		<xsl:variable name="vOutlineClasses" select="computeStrDialog(concat(@dialog, '/outlineClasses'))"/>
		<xsl:variable name="vNbBk" select="if(contains($vOutlineClasses,'bkCnt_'),substring-after($vOutlineClasses,'bkCnt_'),'0')"/>
		<xsl:variable name="vUrl" select="computeStrDialog(string(@dialog), 'act:')"/>
		<xsl:value-of select="execute(java:append($vBufJs, concat('progMgr.addBlockCount(''',$vUrl,''',',$vNbBk,');')))"/>
		<xsl:if test="entry">
			<xsl:apply-templates/>
		</xsl:if>
	</xsl:template>
	<xsl:template match="node()"/>
</xsl:stylesheet>