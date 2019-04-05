<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:java="http://xml.apache.org/xslt/java" xmlns:opa="kelis.fr:opa" xmlns:op="utc.fr:ics/opale3" exclude-result-prefixes="sc sp java opa op">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="op:applet">
		<xsl:variable name="vId" select="alphaHash(getIdNode(.))"/>
		<applet code="{sp:library/op:libraryM/sp:code}" archive="{getUrl(gotoSubModel(sp:library),'url')}" width="{returnFirst(op:appletM/sp:width,'300')}" height="{returnFirst(op:appletM/sp:height,'200')}" mayscript="true">
			<param value="{$vId}" name="id"/>
			<xsl:if test="sp:statParamText or sp:statParamRes">
				<param value="{concat(normalize-space(concatExpr(//sp:statParamText/op:statParamTextM/sp:name,concat(text(),' '))),' ',normalize-space(concatExpr(//sp:statParamRes/op:statParamResM/sp:name,concat(text(),' '))))}" name="static-params"/>
			</xsl:if>
			<xsl:if test="sp:dynParam">
				<param value="{normalize-space(concatExpr(//sp:dynParam/opa:dynParamM/sp:name,concat(text(),' ')))}" name="dynamic-params"/>
			</xsl:if>
			<xsl:apply-templates/>
		</applet>
	</xsl:template>
	<xsl:template match="sp:statParamText">
		<param value="{op:statParamTextM/sp:value}" name="{op:statParamTextM/sp:name}"/>
	</xsl:template>
	<xsl:template match="sp:statParamRes">
		<param value="{getUrl(gotoSubModel(op:statParamResM/sp:res),'url')}" name="{op:statParamResM/sp:name}"/>
	</xsl:template>
	<xsl:template match="sp:dynParam">
		<xsl:variable name="vParamId" select="getContent(gotoSubModel(),'id')"/>
		<xsl:variable name="vParamType" select="getContent(gotoSubModel(),'type')"/>
		<param value="{$vParamId}" name="{opa:dynParamM/sp:name}-id"/>
		<param value="{$vParamType}" name="{opa:dynParamM/sp:name}-type"/>
	</xsl:template>
	<xsl:template match="*"/>
</xsl:stylesheet>