<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.utc.fr/ics/scenari/v3/core"
    xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:op="utc.fr:ics/opale3">

	<xsl:output encoding="UTF-8" method="xml" indent="yes" />
	
	<xsl:template match="sp:form | sp:img | sp:tab | sp:graph | sp:vid | sp:zoom">
		<xsl:choose>
			<xsl:when test="parent::op:txtRes | parent::op:gallery | parent::op:label | parent::op:labelImg">
				<xsl:copy>
					<xsl:apply-templates select="node() | @*" />
				</xsl:copy>
			</xsl:when>
			<xsl:when test="ancestor::op:res">
				<sp:res sc:refUri="{@sc:refUri}">
					<op:resInfoM>
						<xsl:call-template name="ressource"/>
					</op:resInfoM>
				</sp:res>
			</xsl:when>
			<xsl:when test="ancestor::op:altRes">
				<sp:staticRes sc:refUri="{@sc:refUri}">
					<op:indexM>
						<xsl:call-template name="index"/>
					</op:indexM>
				</sp:staticRes>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

		<xsl:template name="ressource">
			<xsl:if test="name()='sp:zoom' or name()='sp:vid'">
			<sp:pubMode>
				<xsl:choose>
					<xsl:when test="name()='sp:zoom'">zoom</xsl:when>
					<xsl:when test="name()='sp:vid'">embeded</xsl:when>
				</xsl:choose>
			</sp:pubMode>
		</xsl:if>
		<xsl:if test="name()='sp:form' or name()='sp:img' or name()='sp:tab' or name()='sp:graph' or name()='sp:vid'">
			<xsl:call-template name="index"/>
		</xsl:if>
		<xsl:if test=".//sp:webInstruct or .//sp:odInstruct">
			<sp:instruct>
				<xsl:copy-of select="op:instructionM"/>
			</sp:instruct>
		</xsl:if>
	</xsl:template>

	<xsl:template name="index">
		<xsl:choose>
			<xsl:when test="name()='sp:img'"><sp:index>img</sp:index></xsl:when>
			<xsl:when test="name()='sp:tab'"><sp:index>tab</sp:index></xsl:when>
			<xsl:when test="name()='sp:graph'"><sp:index>graph</sp:index></xsl:when>
			<xsl:when test="name()='sp:form'"><sp:index>form</sp:index></xsl:when>
			<xsl:when test="name()='sp:vid'"><sp:index>anim</sp:index></xsl:when>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="node() | @*">
		<xsl:copy>
			<xsl:apply-templates select="node() | @*" />
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
