<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:op="utc.fr:ics/opale3" exclude-result-prefixes="sc sp op">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
	<xsl:param name="vDialog"/>
	<xsl:param name="vAgent"/>
	<xsl:template match="*">
		<xsl:for-each select="sc:question">
			<div class="ssBk">
				<div class="bkBase bkQuestion">
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