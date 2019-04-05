<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:java="http://xml.apache.org/xslt/java" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp java opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:variable name="vId" select="alphaHash(getIdNode(..))"/>
	<xsl:template match="*">
		<a class="btnNav btnValid" title="￼Validez le quiz et affichez les résultats￼" href="{getUrl(currentModel(),'quizValid')}">
			<xsl:attribute name="onclick">
				<xsl:if test="opa:assmntNodeM/sp:attempts/sp:addScore = 'yes'">scServices.assmntMgr.setResponse('<xsl:value-of select="$vId"/>', '', 'addScore','true');scServices.assmntMgr.setResponse('<xsl:value-of select="$vId"/>', '', 'newScore','true');</xsl:if>scServices.assmntMgr.setResponse('<xsl:value-of select="$vId"/>', '', 'tryNum',scCoLib.toInt(scServices.assmntMgr.getResponse('<xsl:value-of select="$vId"/>', '', 'tryNum'))+1);scServices.assmntMgr.commit();</xsl:attribute>
			<span>￼Validez￼</span>
		</a>
	</xsl:template>
</xsl:stylesheet>