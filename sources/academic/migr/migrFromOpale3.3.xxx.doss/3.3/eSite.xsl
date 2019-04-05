<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.utc.fr/ics/scenari/v3/core"
    xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:op="utc.fr:ics/opale3">

	<xsl:output encoding="UTF-8" method="xml" indent="yes" />

	<xsl:template match="op:sizeM">
		<xsl:copy>
			<xsl:choose>
				<xsl:when test="sp:size/text()='L'">
					<sp:height>350</sp:height>
				</xsl:when>
				<xsl:otherwise>
					<sp:width>500</sp:width>
					<sp:height>150</sp:height>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="node() | @*">
		<xsl:copy>
			<xsl:apply-templates select="node() | @*" />
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
