<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" 
		xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive"
		xmlns:op="utc.fr:ics/opale3"
		xmlns:xalan="http://xml.apache.org/xalan"
		exclude-result-prefixes="sc sp xalan op">
	<xsl:output encoding="UTF-8" method="xml"/>
	
	<xsl:param name="pCurrentItem"/>
	<xsl:param name="pCurrentItemUri"/>
	
	
	<xsl:template match="op:binM">
		<op:imgM>
			<xsl:apply-templates select="@*|node()"/>		
			<xsl:if test="sp:altTxt or sp:desc">
				<sp:alt>
					<xsl:if test="sp:altTxt">
						<sp:altTxt>
							<xsl:value-of select="sp:altTxt"/>
						</sp:altTxt>
					</xsl:if>
					<xsl:if test="sp:desc">
						<sp:desc>
							<xsl:copy-of select="sp:desc/*"/>
						</sp:desc>
					</xsl:if>
				</sp:alt>
			</xsl:if>
		</op:imgM>
	</xsl:template>

	<xsl:template match="sp:altTxt | sp:desc"/>	
	
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
	 	</xsl:copy>
	</xsl:template>
		
</xsl:stylesheet>
