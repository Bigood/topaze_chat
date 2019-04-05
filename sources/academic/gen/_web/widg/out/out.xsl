<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:redirect="com.scenari.xsldom.xalan.lib.Redirect" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" extension-element-prefixes="redirect" exclude-result-prefixes="sc xhtml" version="1.0">
	<xsl:output omit-xml-declaration="yes" indent="no" method="xml"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="treeContent">
		<ul class="mnu mnu_static  mnu_sch_no">
			<xsl:apply-templates/>
		</ul>
		<script type="text/javascript">scServices.totalPages = <xsl:value-of select="count(//entry[matchesRegex(computeStrDialog(string(@dialog), 'act:'), '.*html$')])"/>;</script>
	</xsl:template>
	<xsl:template match="entry">
		<xsl:variable name="vOutlineClasses" select="computeStrDialog(concat(@dialog, '/outlineClasses'))"/>
		<xsl:variable name="vUrl" select="computeStrDialog(string(@dialog), 'act:')"/>
		<xsl:variable name="vDepth" select="count(ancestor::entry)"/>
		<xsl:if test="$vOutlineClasses != 'hidden'">
			<li class="mnu_sel_{if(@position = 'current', 'yes', 'no')} mnu_{if(entry,'b','l')} mnu_dpt_{$vDepth} {$vOutlineClasses}">
				<div class="mnuLbl mnu_sel_{if(@position = 'current', 'yes', 'no')} mnu_{if(entry,'b','l')}{if(entry and not(descendant::entry/@position='current' or @position='current'),' mnu_b_c','')} mnu_dpt_{$vDepth} {$vOutlineClasses} mnu_sch_no" id="{$vUrl}">
					<xsl:variable name="vSubUrl" select="computeStrDialog(string(entry[1]/@dialog), 'act:')"/>
					<xsl:choose>
						<xsl:when test="@position = 'current' or (@position = 'parent' or @position = 'ancestor') and $vSubUrl = $vUrl">
							<span class="mnu_i">
								<span class="mnu_sch">
									<span>
										<span class="mnu_cursor"/>
										<xsl:value-of select="@title"/>
									</span>
								</span>
							</span>
						</xsl:when>
						<xsl:otherwise>
							<a href="{$vUrl}" target="_self" class="mnu_i mnu_lnk">
								<span class="mnu_sch">
									<span>
										<span class="mnu_cursor"/>
										<xsl:value-of select="@title"/>
									</span>
								</span>
							</a>
						</xsl:otherwise>
					</xsl:choose>
				</div>
				<xsl:if test="entry and (descendant::entry/@position='current' or @position='current')">
					<ul class="mnu_sub mnu_sub_o">
						<xsl:apply-templates/>
					</ul>
				</xsl:if>
			</li>
		</xsl:if>
	</xsl:template>
	<xsl:template match="node()"/>
</xsl:stylesheet>