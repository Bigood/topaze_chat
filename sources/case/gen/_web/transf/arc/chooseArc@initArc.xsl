<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:java="http://xml.apache.org/xslt/java" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:value-of select="initBuffer('indexStack', java:java.util.HashSet.new())"/>
		<script type="text/JavaScript">
			<xsl:for-each select="sp:next">
				<xsl:choose>
					<xsl:when test="opa:arcLnkCondM/sp:cond/opa:condM">
						<xsl:value-of select="getContent(gotoSubModel(opa:arcLnkCondM/sp:cond/opa:condM/sp:left), 'calc')" disable-output-escaping="yes"/>
                        topazeMgr.addArcCnd({id:<xsl:value-of select="count(preceding-sibling::sp:next)"/>,pl:<xsl:value-of select="getContent(gotoSubModel(opa:arcLnkCondM/sp:cond/opa:condM/sp:left), 'initArc')" disable-output-escaping="yes"/>,op:"<xsl:value-of select="opa:arcLnkCondM/sp:cond/opa:condM/sp:op"/>",vl:"<xsl:value-of select="opa:arcLnkCondM/sp:cond/opa:condM/sp:right"/>"});
                    </xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="getContent(gotoSubModel(opa:arcLnkCondM/sp:cond/opa:condSimpleM/sp:left), 'calc')" disable-output-escaping="yes"/>
                        topazeMgr.addArcCnd({id:<xsl:value-of select="count(preceding-sibling::sp:next)"/>,pl:<xsl:value-of select="getContent(gotoSubModel(opa:arcLnkCondM/sp:cond/opa:condSimpleM/sp:left), 'initArcStatus')" disable-output-escaping="yes"/>,op:"=",vl:"<xsl:value-of select="opa:arcLnkCondM/sp:cond/opa:condSimpleM/sp:right"/>"});
                    </xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
			<xsl:for-each select="sp:otherwise">
                topazeMgr.addArcCnd({id:<xsl:value-of select="count(preceding-sibling::sp:next)"/>});</xsl:for-each>
            topazeMgr.initArc = topazeMgr.initArcChoose;</script>
		<xsl:value-of select="initBuffer('indexStack')"/>
	</xsl:template>
</xsl:stylesheet>