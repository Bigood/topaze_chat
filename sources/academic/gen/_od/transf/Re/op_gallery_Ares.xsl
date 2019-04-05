<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                    xmlns:sc="http://www.utc.fr/ics/scenari/v3/core" 
                    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                    xmlns:sp="http://www.utc.fr/ics/scenari/v3/primitive" 
                    xmlns:op="utc.fr:ics/opale3"
                    xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
					xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"
                    xmlns:scodPp="scenari.eu:openDocumentExtension.postprocessing:1.0"
                    exclude-result-prefixes="sc sp op text draw scodPp">
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes" />

    <xsl:param name="vDialog" />
    <xsl:param name="vAgent" />
        
    <xsl:template match="op:gallery">
        <scodPp:ifNotNull>
            <text:p text:style-name="galleryImgList">
                <xsl:for-each select="sp:img">
                  <xsl:if test="not(op:filter/sp:exclude[text()='paper'])">
                      <xsl:variable name="vPathAgentContent" select="concat('@', getIdFromPath(@sc:refUri), '_Agal')"/>
                      <!--text:tab/-->
                       <draw:frame draw:style-name="galleryImgBox_20__3e__20_frame" draw:name="WFlowArea_galleryImgBox" text:anchor-type="as-char" svg:width="4.500cm">
                          <draw:text-box fo:min-height="3.500cm">
                              <xsl:value-of select="computeStrAgent(concat($vPathAgentContent, '/getContent'))" disable-output-escaping="yes"/>
                          </draw:text-box>
                      </draw:frame>
                  </xsl:if>
                </xsl:for-each>
           </text:p>
        </scodPp:ifNotNull>
    </xsl:template>
        
    <xsl:template match="*"/>
    
</xsl:stylesheet>
