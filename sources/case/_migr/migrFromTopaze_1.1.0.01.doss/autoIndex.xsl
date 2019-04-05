<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.utc.fr/ics/scenari/v3/core"
    xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:opa="kelis.fr:opa">

	<xsl:output encoding="UTF-8" method="xml" indent="yes" />

	<xsl:template match="opa:autoIndex">
		<xsl:copy>
			<xsl:apply-templates select="@*"/>
			<xsl:apply-templates select="opa:autoIndexM"/>
			<xsl:element name="sp:{si(opa:autoIndexM/sp:method,opa:autoIndexM/sp:method,'sum')}">
				<opa:autoIndexInput>
					<xsl:apply-templates select="sp:input"/>
				</opa:autoIndexInput>
			</xsl:element>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="opa:autoIndexM/sp:method"/>

	<xsl:template match="node() | @*">
		<xsl:copy>
			<xsl:apply-templates select="node() | @*" />
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
