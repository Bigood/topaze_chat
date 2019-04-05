<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.utc.fr/ics/scenari/v3/core"
    xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:op="utc.fr:ics/opale3" xmlns:opa="kelis.fr:opa" xmlns:redirect="com.scenari.xsldom.xalan.lib.Redirect" extension-element-prefixes="redirect">

	<xsl:output encoding="UTF-8" method="xml" indent="yes"/>

    <xsl:param name="pCurrentItemUri"/>
	<xsl:param name="pTraceFilePath"/>
	
	<xsl:template match="opa:autoIndex[sp:average]">
		<xsl:copy>
			<xsl:apply-templates select="node() | @*" />
		</xsl:copy>		
		<redirect:write file="{$pTraceFilePath}" append="true">
			<sc:listItem>
				<sc:para xml:space="preserve"><sc:objectLeaf role="indDisplay" sc:refUri="{$pCurrentItemUri}"/></sc:para>
			</sc:listItem>
		</redirect:write>
	</xsl:template>

	<xsl:template match="node() | @*">
		<xsl:copy>
			<xsl:apply-templates select="node() | @*" />
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
