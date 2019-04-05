<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sm="http://www.utc.fr/ics/scenari/v3/modeling" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:xalan="http://xml.apache.org/xalan" xmlns:java="http://xml.apache.org/xslt/java" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sm sc sp xalan java opa">
	<xsl:output method="xml" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vAgent"/>
	<xsl:param name="vDialog"/>
	<xsl:variable select="parseXml(resultatAgent(concat('@', getIdFromPath(sp:image/@sc:refUri), '_Anav/props')))/props/image" name="vImgProps"/>
	<xsl:variable select="resultatDialogue(concat('@', getIdFromPath(sp:image/@sc:refUri), '_Anav'), 'act:')" name="vImgUri"/>
	<xsl:variable select="$vImgProps/@transformedWidth div $vImgProps/@nativeWidth" name="vRatio"/>
	<xsl:template match="opa:visualMap">
		<xsl:apply-templates select="sp:image"/>
		<map id="map" name="map">
			<xsl:apply-templates select="sp:area"/>
		</map>
		<xsl:value-of select="initBuffer('indexStack', java:java.util.HashSet.new())"/>
		<script type="text/JavaScript">
			<xsl:for-each select="sp:area">
				<xsl:choose>
					<xsl:when test="descendant::opa:visualMapLnkCondM/sp:cond">
						<xsl:choose>
							<xsl:when test="descendant::opa:visualMapLnkCondM/sp:cond/opa:condM">
								<xsl:value-of select="getContent(gotoSubModel(descendant::opa:visualMapLnkCondM/sp:cond/opa:condM/sp:left), 'calc')" disable-output-escaping="yes"/>
	topazeMgr.addArcCnd({id:<xsl:value-of select="count(preceding-sibling::sp:area)"/>,pl:<xsl:value-of select="getContent(gotoSubModel(descendant::opa:visualMapLnkCondM/sp:cond/opa:condM/sp:left), 'initArc')" disable-output-escaping="yes"/>,op:"<xsl:value-of select="descendant::opa:visualMapLnkCondM/sp:cond/opa:condM/sp:op"/>",vl:"<xsl:value-of select="descendant::opa:visualMapLnkCondM/sp:cond/opa:condM/sp:right"/>"});
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="getContent(gotoSubModel(descendant::opa:visualMapLnkCondM/sp:cond/opa:condSimpleM/sp:left), 'calc')" disable-output-escaping="yes"/>
	topazeMgr.addArcCnd({id:<xsl:value-of select="count(preceding-sibling::sp:area)"/>,pl:<xsl:value-of select="getContent(gotoSubModel(descendant::opa:visualMapLnkCondM/sp:cond/opa:condSimpleM/sp:left), 'initArcStatus')" disable-output-escaping="yes"/>,op:"=",vl:"<xsl:value-of select="descendant::opa:visualMapLnkCondM/sp:cond/opa:condSimpleM/sp:right"/>"});
							</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise>topazeMgr.addArcCnd({id:<xsl:value-of select="count(preceding-sibling::sp:area)"/>});</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
topazeMgr.initArc = topazeMgr.initArcChoose;
		</script>
		<xsl:value-of select="initBuffer('indexStack')"/>
	</xsl:template>
	<xsl:template match="sp:image">
		<img src="{$vImgUri}" usemap="#map" height="{$vImgProps/@transformedHeight}" width="{$vImgProps/@transformedWidth}" class="visualMap_img" alt=""/>
		<xsl:copy-of select="parseXml(getContent(gotoSubModel(),'credits'))"/>
	</xsl:template>
	<xsl:template match="sp:area">
		<xsl:variable name="vTxt" select="getContent(gotoSubModel(),'txt')"/>
		<xsl:variable name="vLnk" select="getUrl(gotoSubModel(),'lnk')"/>
		<xsl:variable name="vClick" select="getContent(gotoSubModel(),'noClick')"/>
		<xsl:variable name="vCoords" select="java:eu.scenari.modeling.util.Math.coordsRound(java:eu.scenari.modeling.util.Math.coordsRatio(opa:areaMeta/sp:coords/text(),$vRatio))"/>
		<xsl:choose>
			<xsl:when test="$vTxt">
				<scTooltip trigger="onmouseover" class="scMapTooltip">
					<scTooltipContent>
						<div>
							<xsl:value-of select="$vTxt" disable-output-escaping="yes"/>
						</div>
					</scTooltipContent>
					<area class="enabled_entry {$vClick}" shape="{opa:areaMeta/sp:shape}" coords="{$vCoords}" target="mainFrame" href="{$vLnk}"/>
				</scTooltip>
			</xsl:when>
			<xsl:otherwise>
				<area class="enabled_entry {$vClick}" shape="{opa:areaMeta/sp:shape}" coords="{$vCoords}" target="mainFrame" href="{$vLnk}"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>