<?xml version="1.0" encoding="UTF-8"?>
<!-- ATTENTION - NE PAS INDENTER ! NE PAS MODIFIER AVEC L'EDITEUR DE SCENARI.-->
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:for-each select="descendant::sc:objectLeaf[containWord('input inputVar',@role)]">
			<xsl:value-of select="getContent(gotoSubModel(.), 'calc')" disable-output-escaping="yes"/>
		</xsl:for-each>
		<xsl:apply-templates mode="bk"/>
	</xsl:template>
	<xsl:template match="sc:para" mode="bk">
		<xsl:apply-templates mode="in"/>
		<xsl:text>
		</xsl:text>
	</xsl:template>
	<xsl:template match="sc:textLeaf[@role='comment']" mode="in"/>
	<xsl:template match="sc:objectLeaf[@role='input']" mode="in">
		<xsl:variable name="vId" select="getContent(gotoSubModel(.), 'id')"/>
		<xsl:choose>
			<xsl:when test="boolean(opa:jsInputM/sp:return) and containWord('tryNum scoreSum',opa:jsInputM/sp:return)">scCoLib.toInt(scServices.assmntMgr.getResponse('<xsl:value-of select="$vId"/>', '', '<xsl:value-of select="opa:jsInputM/sp:return"/>'))</xsl:when>
			<xsl:when test="opa:jsInputM/sp:return = 'seen'">topazeMgr.isNodeVisited('<xsl:value-of select="$vId"/>')</xsl:when>
			<xsl:when test="opa:jsInputM/sp:return = 'finished'">topazeMgr.isNodeFinished('<xsl:value-of select="$vId"/>')</xsl:when>
			<xsl:when test="opa:jsInputM/sp:return = 'score'">topazeMgr.getScore('<xsl:value-of select="$vId"/>')</xsl:when>
			<xsl:when test="opa:jsInputM/sp:return = 'scoreMax'">topazeMgr.getScoreMax('<xsl:value-of select="$vId"/>')</xsl:when>
			<xsl:when test="opa:jsInputM/sp:return = 'scoreMin'">topazeMgr.getScoreMin('<xsl:value-of select="$vId"/>')</xsl:when>
			<xsl:when test="opa:jsInputM/sp:return = 'maxPts'">scCoLib.toInt(scServices.assmntMgr.getMaxPts('<xsl:value-of select="$vId"/>', ''))</xsl:when>
			<xsl:when test="opa:jsInputM/sp:return = 'minPts'">scCoLib.toInt(scServices.assmntMgr.getMinPts('<xsl:value-of select="$vId"/>', ''))</xsl:when>
			<xsl:when test="opa:jsInputM/sp:return = 'id'"><xsl:value-of select="$vId"/></xsl:when>
			<xsl:otherwise><xsl:value-of select="getContent(gotoSubModel(.), 'val')" disable-output-escaping="yes"/></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="sc:objectLeaf[@role='inputVar']" mode="in">
		<xsl:value-of select="getContent(gotoSubModel(.), 'val')" disable-output-escaping="yes"/>
	</xsl:template>
	<xsl:template match="*" mode="bk"/>
	<xsl:template match="text()" mode="bk"/>
	<xsl:template match="*" mode="in"/>
	<xsl:template match="text()" mode="in">
		<xsl:copy-of select="."/>
	</xsl:template>
</xsl:stylesheet>
