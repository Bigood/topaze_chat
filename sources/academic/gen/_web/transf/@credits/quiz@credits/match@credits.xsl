<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:op="utc.fr:ics/opale3" xmlns:java="http://xml.apache.org/xslt/java" exclude-result-prefixes="sc sp op java">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<div class="credits">
			<hx class="credits_ti">
				<span>
					<xsl:value-of select="if(op:exeM/sp:title,concat('￼Exercice : ￼',op:exeM/sp:title),'￼Exercice￼')"/>
				</span>
			</hx>
			<div class="credits_co">
				<xsl:value-of select="getContent(gotoMeta(),'')" disable-output-escaping="yes"/>
				<xsl:for-each select="sc:question">
					<xsl:value-of select="getContent( gotoSubModel(),'credits')" disable-output-escaping="yes"/>
				</xsl:for-each>
				<xsl:for-each select="//sc:target">
					<xsl:value-of select="getContent( gotoSubModel(),'credits')" disable-output-escaping="yes"/>
				</xsl:for-each>
				<xsl:for-each select="//sc:label">
					<xsl:value-of select="getContent( gotoSubModel(),'credits')" disable-output-escaping="yes"/>
				</xsl:for-each>
				<xsl:for-each select="sc:globalExplanation">
					<xsl:value-of select="getContent( gotoSubModel(),'credits')" disable-output-escaping="yes"/>
				</xsl:for-each>
			</div>
		</div>
	</xsl:template>
</xsl:stylesheet>