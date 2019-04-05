<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xalan="http://xml.apache.org/xalan" xmlns:java="http://xml.apache.org/xslt/java" xmlns:opa="kelis.fr:opa" exclude-result-prefixes="sc sp java opa">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>

	<xsl:template match="*">
		<xsl:variable name="vRes">
			<resources>
				<xsl:for-each select="xalan:nodeset(java:keySet(getEntryBuffer('resources')))">
					<xsl:sort select="getEntryBuffer('resources', string(.))"/>
					<xsl:variable name="vUrl" select="substring-before(getEntryBuffer('resources', string(.)),'§')"/>
					<resource url="{if(contains($vUrl,'.odg'),translate($vUrl,'.odg','.png'),$vUrl)}" title="{substring-before(string(.),'§')}" parentstep="{substring-before(substring-after(string(.),'§'),'§')}" parenttitle="{substring-after(substring-after(string(.),'§'),'§')}">
						<xsl:value-of select="substring-after(getEntryBuffer('resources', string(.)),'§')"/>
					</resource>
				</xsl:for-each>
			</resources>
		</xsl:variable>
		<dl>
			<xsl:for-each select="xalan:nodeset($vRes)/*/resource[not(preceding-sibling::*/@url = @url)]">
				<xsl:if test="normalize-space(parseXml(.))">
					<xsl:variable name="vIsImage" select="contains(@url,'png') or contains(@url,'jpg') or contains(@url,'gif')"/>
					<dt class="idxEntryTi disabled_entry">
						<div class="resCredits">
							<a class="resCreditsLnk {if($vIsImage,'imgZoomNoTi imgZoom','')}" target="_blank" title="￼Cliquez pour visualiser la ressource (nouvelle fenêtre)￼">
								<xsl:attribute name="href">
									<xsl:value-of select="@url"/>
								</xsl:attribute>
								<span>
									<xsl:value-of select="@title"/>
								</span>
							</a>
							<div class="idxEntryCo">
								<div class="resCredits_co">
									<xsl:copy-of select="parseXml(.)"/>
								</div>
							</div>
						</div>
					</dt>
					<dd class="idxFra disabled_entry">
						<div class="idxEntryCallers">
							<a href="#" class="idxEntryCallers_closed" onkeyup="scDynUiMgr.handleBtnKeyUp(event);" onclick="scDynUiMgr.collBlkToggle(this,scPaLib.findNode('chl:div',this.parentNode),'idxEntryCallers_open','idxEntryCallers_closed');return false;" title="Cliquez ici pour voir les référents...">
								<span class="idxEntryCallers_ti ">
									<span class="idxEntryCallers_tiIn ">Référents</span>
								</span>
							</a>
							<div class="idxEntryCallers_co  collBlk_closed" style="display:none;">
								<xsl:call-template name="callers"/>
								<xsl:call-template name="followers">
									<xsl:with-param name="pUrl" select="@url"/>
								</xsl:call-template>
							</div>
						</div>
					</dd>
				</xsl:if>
			</xsl:for-each>
		</dl>
	</xsl:template>
		
	<xsl:template name="followers">
		<xsl:param name="pUrl" />
		<xsl:for-each select="following-sibling::*[@url = $pUrl]">
			<xsl:call-template name="callers"/>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="callers">
		<div class="idxEntryCaller">
			<span class="stackSep"> &gt; </span>
			<a class="idxEntryCallerLnk " href="{@parentstep}" target="_self">
				<span>
					<xsl:value-of select="if(normalize-space(@parenttitle),@parenttitle,'Accueil')"/>
				</span>
			</a>
		</div>
	</xsl:template>
</xsl:stylesheet>