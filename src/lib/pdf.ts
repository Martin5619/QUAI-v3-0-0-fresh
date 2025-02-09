import PDFParser from 'pdf2json'

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        console.log('[PDF_v2414] Starting content extraction')
        
        // Extract meaningful text content, ignoring metadata
        const text = pdfData.Pages
          .map((page: any, pageIndex: number) => {
            console.log(`[PDF_v2414] Processing page ${pageIndex + 1}`)
            
            // Log raw texts before filtering
            const rawTexts = page.Texts.map((text: any) => 
              text.R.map((r: any) => decodeURIComponent(r.T)).join('')
            )
            console.log(`[PDF_v2414] Raw texts found on page ${pageIndex + 1}:`, rawTexts.length)
            
            // Filter out metadata and focus on actual content
            const contentTexts = page.Texts.filter((text: any) => {
              const content = text.R.map((r: any) => decodeURIComponent(r.T)).join('')
              // Filter out common metadata patterns
              const isMetadata = content.match(/^(Font|Type|\/|Created|Modified|Producer|Creator)/i)
              if (isMetadata) {
                console.log(`[PDF_v2414] Filtered metadata: "${content}"`)
              }
              return !isMetadata
            })

            const pageContent = contentTexts
              .map((text: any) => text.R.map((r: any) => decodeURIComponent(r.T)).join(''))
              .join(' ')
            
            console.log(`[PDF_v2414] Extracted content length for page ${pageIndex + 1}:`, pageContent.length)
            return pageContent
          })
          .filter(Boolean) // Remove empty pages
          .join('\n\n')
          .trim()
        
        console.log('[PDF_v2414] Final content length:', text.length)
        
        if (!text) {
          console.error('[PDF_v2414] No content extracted after processing')
          reject(new Error('no_content_extracted_v2414'))
        }
        
        resolve(text)
      } catch (error) {
        console.error('[PDF_v2414] Error processing PDF:', error)
        reject(new Error('pdf_processing_error_v2414'))
      }
    })

    pdfParser.on('pdfParser_dataError', (error: any) => {
      console.error('[PDF_v2414] Parser error:', error)
      reject(new Error('pdf_parser_error_v2414'))
    })

    pdfParser.parseBuffer(buffer)
  })
}
