<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:redirect="com.scenari.xsldom.xalan.lib.Redirect" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" extension-element-prefixes="redirect" exclude-result-prefixes="sc xhtml " version="1.0">
	<xsl:output omit-xml-declaration="yes" indent="no" method="xml"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="treeContent">
		<xsl:if test="entry">
			<ul id="toc">
				<xsl:apply-templates/>
			</ul>
		</xsl:if>
	</xsl:template>
	<xsl:template match="entry">
		<xsl:variable name="vOutlineClasses" select="computeStrDialog(concat(@dialog, '/outlineClasses'))"/>
		<xsl:variable name="vClasses" select="if(contains($vOutlineClasses,'bkCnt_'),substring-before($vOutlineClasses,'bkCnt_'),$vOutlineClasses)"/>
		<xsl:variable name="vUrl" select="computeStrDialog(string(@dialog), 'act:')"/>
		<li>
			<div class="toc_sel_no toc_i toc_{if(entry,'b','l')} {$vClasses}">
				<a href="{$vUrl}?mode=html" target="_self" class="toc_lnk" id="{$vUrl}">
					<span>
						<xsl:value-of select="@title"/>
					</span>
				</a>
				<xsl:if test="entry">
					<a href="#" onclick="tocMgr.toggleItem(this); return false;" class="toc_tgle_o" style="display:none;">
						<img src="{computeStrAgent('pubres:/site/skin/img/toc/tgle_o.gif')}" alt=""/>
					</a>
				</xsl:if>
			</div>
			<xsl:if test="entry">
				<ul class="toc_sub toc_sub_o">
					<xsl:apply-templates/>
				</ul>
			</xsl:if>
		</li>
	</xsl:template>
	<xsl:template match="node()"/>
</xsl:stylesheet>