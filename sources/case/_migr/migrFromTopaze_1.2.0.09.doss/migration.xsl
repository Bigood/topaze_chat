<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.utc.fr/ics/scenari/v3/core"
    xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:op="utc.fr:ics/opale3" xmlns:opa="kelis.fr:opa">

	<xsl:output encoding="UTF-8" method="xml" indent="yes"/>
	
	<xsl:template match="opa:applet">
		<op:applet>
			<xsl:if test="opa:appletM">
				<op:appletM>
					<xsl:apply-templates select="opa:appletM/*"/>
				</op:appletM>
			</xsl:if>
			<xsl:for-each select="sp:statParam">
				<sp:statParamText>
					<op:statParamTextM>
						<xsl:apply-templates select="opa:statParamM/*"/>
					</op:statParamTextM>
				</sp:statParamText>
			</xsl:for-each>
			<xsl:apply-templates select="sp:dynParam"/>
			<xsl:if test="sp:library">
				<sp:library sc:refUri="{sp:library/@sc:refUri}">
					<op:libraryM>
						<xsl:apply-templates select="sp:library/opa:libraryM/*"/>
					</op:libraryM>
				</sp:library>
			</xsl:if>
		</op:applet>
	</xsl:template>

	<xsl:template match="node() | @*">
		<xsl:copy>
			<xsl:apply-templates select="node() | @*" />
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
