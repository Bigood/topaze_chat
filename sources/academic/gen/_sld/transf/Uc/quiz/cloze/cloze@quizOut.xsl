<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:op="utc.fr:ics/opale3" exclude-result-prefixes="sc sp op">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:variable name="vShortQuest" select="count(sc:question/op:res/sp:*)=1 and count(sc:question/op:res/sp:txt) = 1 and count(sc:question/op:res/sp:txt/op:txt/sc:para) &lt;= 2"/>
		<xsl:choose>
			<xsl:when test="$vShortQuest">
				<div class="ssBk">
					<div class="bkBase bkCorrections">
						<div class="bkBase_co ">
							<div class="ssBkCoParent">
								<div class="ssBkCo">
									<xsl:for-each select="sc:question">
										<div class="stepQuestion">
											<xsl:value-of select="getContent(gotoSubModel(.),'')" disable-output-escaping="yes"/>
										</div>
									</xsl:for-each>
									<xsl:for-each select="sc:gapText">
										<div class="stepGapText gapTextShow">
											<xsl:value-of select="getContent(gotoSubModel(.),'')" disable-output-escaping="yes"/>
										</div>
									</xsl:for-each>
								</div>
							</div>
						</div>
					</div>
				</div>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="sc:gapText">
					<div class="ssBk">
						<div class="bkBase bkGapText bkCorrections">
							<div class="bkBase_co ">
								<div class="ssBkCoParent">
									<div class="ssBkCo">
										<div class="gapTextShow">
											<xsl:value-of select="getContent(gotoSubModel(.),'')" disable-output-escaping="yes"/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:for-each select="sc:globalExplanation">
			<div class="ssBk">
				<div class="bkBase bkExplanations">
					<div class="bkBase_co ">
						<div class="ssBkCoParent">
							<div class="ssBkCo">
								<xsl:value-of select="getContent(gotoSubModel(.),'')" disable-output-escaping="yes"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>