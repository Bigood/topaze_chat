<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" 
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
		xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" 
		xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive"
		xmlns:op="utc.fr:ics/opale3"
		xmlns:xalan="http://xml.apache.org/xalan"
		exclude-result-prefixes="xalan">
	<xsl:output encoding="UTF-8" method="xml"/>
	
	<xsl:param name="pWspPath"/>
	<xsl:param name="pTraceFilePath"/>

	<xsl:include href="assmntNodeM.xsl"/>
	<xsl:include href="arcLnkCondM.xsl"/>
	<xsl:include href="expNode.xsl"/>

</xsl:stylesheet>
