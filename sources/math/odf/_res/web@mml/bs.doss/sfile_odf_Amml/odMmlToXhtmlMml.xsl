<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:xalan="http://xml.apache.org/xalan"
	xmlns:math="http://www.w3.org/1998/Math/MathML"
	version="1.0"
	exclude-result-prefixes="xalan">
	
	<xsl:output method="xml" indent="no" omit-xml-declaration="yes" encoding="UTF-8"/>
	
	<xsl:param name="vComp"/>
				
	<xsl:template match="/*">
		<math:math>
			<xsl:apply-templates select="@*"/>
			<!--<mstyle displaystyle="true">-->
				<xsl:apply-templates select="node()"/>
			<!--</mstyle>-->
		</math:math>
	</xsl:template>
	
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>
		
</xsl:stylesheet>
