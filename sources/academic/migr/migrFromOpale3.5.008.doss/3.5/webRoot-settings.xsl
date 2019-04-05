<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" 
		xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive"
		xmlns:op="utc.fr:ics/opale3"
		xmlns:xalan="http://xml.apache.org/xalan"
		xmlns:sfm="http://www.utc.fr/ics/scenari/v3/filemeta"
		exclude-result-prefixes="sc sp xalan op">
	<xsl:output encoding="UTF-8" method="xml"/>
	
	<xsl:param name="pCurrentItem"/>
	<xsl:param name="pCurrentItemUri"/>
	
	<xsl:template match="op:webRootM/sp:settings/sp:solution">
		<sp:solPractUc>
			<xsl:apply-templates select="@*|node()"/>
		</sp:solPractUc>
		<sp:solQuiz>
			<xsl:apply-templates select="@*|node()"/>
		</sp:solQuiz>
	</xsl:template>
	
	<xsl:template match="op:webRootM/sp:settings/sp:autoEvalSol">
		<sp:solAssmntUa>
			<xsl:apply-templates select="@*|node()"/>
		</sp:solAssmntUa>
	</xsl:template>
	
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
	 	</xsl:copy>
	</xsl:template>
		
</xsl:stylesheet>
