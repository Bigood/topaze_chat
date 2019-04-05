<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.utc.fr/ics/scenari/v3/core"
    xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:op="utc.fr:ics/opale3" xmlns:opa="kelis.fr:opa">

	<xsl:output encoding="UTF-8" method="xml" indent="yes"/>
	
	<xsl:template match="opa:caseM/sp:intro/opa:rTxt">
		<op:res>
			<sp:txt>
				<op:txt>
					<xsl:apply-templates select="@*|node()"/>
				</op:txt>
			</sp:txt>
		</op:res>			
	</xsl:template>

	<xsl:template match="node() | @*">
		<xsl:copy>
			<xsl:apply-templates select="node() | @*" />
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
