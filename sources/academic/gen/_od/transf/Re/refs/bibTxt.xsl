<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:op="utc.fr:ics/opale3" xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:scod="scenari.eu:openDocumentExtension:1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" exclude-result-prefixes="op scod sp office xlink text sc">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="op:bibTxt">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="sc:para[not(@role) or @role='']">
		<text:p text:style-name="txtBibPara">
			<text:span text:style-name="txtBibRef">
				<xsl:text>[</xsl:text>
				<xsl:value-of select="ancestor::op:bibM/sp:id"/>
				<xsl:text>] </xsl:text>
			</text:span>
			<xsl:apply-templates/>
		</text:p>
	</xsl:template>
	<xsl:template match="sc:uLink[@role='url']">
		<text:a xlink:type="simple">
			<xsl:attribute name="xlink:href">
				<xsl:value-of select="@url"/>
			</xsl:attribute>
			<text:span text:style-name="txtBibUrl">
				<xsl:apply-templates/>
			</text:span>
		</text:a>
	</xsl:template>
	<xsl:template match="sc:textLeaf[@role='title']">
		<text:span text:style-name="txtBibTitle">
			<xsl:apply-templates/>
		</text:span>
	</xsl:template>
	<xsl:template match="sc:textLeaf[@role='auth']">
		<text:span text:style-name="txtBibAuth">
			<xsl:apply-templates/>
		</text:span>
	</xsl:template>
	<xsl:template match="sc:textLeaf[@role='date']">
		<text:span text:style-name="txtBibDate">
			<xsl:apply-templates/>
		</text:span>
	</xsl:template>
	<xsl:template match="sc:textLeaf[@role='ed']">
		<text:span text:style-name="txtBibEd">
			<xsl:apply-templates/>
		</text:span>
	</xsl:template>
	<xsl:template match="text()">
		<xsl:copy-of select="."/>
	</xsl:template>
	<xsl:template match="*"/>
</xsl:stylesheet>