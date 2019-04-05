<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:java="http://xml.apache.org/xslt/java" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xalan="http://xml.apache.org/xalan" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa java xalan">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:if test="opa:coachM/sp:val">
			<div id="coachBk">
				<xsl:value-of select="getContent(gotoSubModel(sp:index), 'calcVal')" disable-output-escaping="yes"/>
				<script type="text/javascript">
tplMgr.fCoachVals = new Object();
tplMgr.fCoachIndexVal = <xsl:value-of select="getContent(gotoSubModel(sp:index),'val')"/>;
<xsl:for-each select="opa:coachM/sp:val">
tplMgr.fCoachVals["<xsl:value-of select="getUrl(gotoSubModel(sp:img),'coach')"/>"]="<xsl:value-of select="sp:min"/>,<xsl:value-of select="sp:max"/>";
					</xsl:for-each>
				</script>
				<xsl:for-each select="opa:coachM/sp:val">
					<xsl:copy-of select="parseXml(getContent(gotoSubModel(sp:img),'credits'))"/>
				</xsl:for-each>
			</div>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>