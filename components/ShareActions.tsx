'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import CopyButton from './CopyButton';

interface ShareActionsProps {
  content: string;
  filename: string;
}

export default function ShareActions({ content, filename }: ShareActionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Create PDF with A4 size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true, // Enable compression
      });

      // Page settings
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      let yPosition = margin;

      // Helper function to check if we need a new page
      const checkPageBreak = (neededHeight: number) => {
        if (yPosition + neededHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
      };

      // Helper function to add text with markdown rendering
      const addText = (text: string, fontSize: number, baseStyle: string, lineSpacing = 1.5) => {
        pdf.setFontSize(fontSize);
        const lineHeight = fontSize * 0.5 * lineSpacing;
        
        // Parse inline markdown and render with proper styling
        const renderInlineMarkdown = (line: string, x: number, y: number) => {
          let currentX = x;
          const parts: Array<{text: string, style: string, isCode: boolean}> = [];
          
          // Regex to match markdown patterns
          const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|[^*`]+)/g;
          const matches = line.match(regex) || [line];
          
          for (const match of matches) {
            if (match.startsWith('**') && match.endsWith('**')) {
              // Bold
              parts.push({text: match.slice(2, -2), style: 'bold', isCode: false});
            } else if (match.startsWith('*') && match.endsWith('*') && !match.startsWith('**')) {
              // Italic
              parts.push({text: match.slice(1, -1), style: 'italic', isCode: false});
            } else if (match.startsWith('`') && match.endsWith('`')) {
              // Code
              parts.push({text: match.slice(1, -1), style: 'normal', isCode: true});
            } else {
              // Normal text
              parts.push({text: match, style: baseStyle, isCode: false});
            }
          }
          
          // Render each part with appropriate styling
          for (const part of parts) {
            if (part.isCode) {
              // Code block styling
              pdf.setFont('courier', 'normal');
              pdf.setFillColor(245, 245, 245);
              const textWidth = pdf.getTextWidth(part.text);
              pdf.rect(currentX - 1, y - fontSize * 0.35, textWidth + 2, fontSize * 0.5, 'F');
              pdf.setTextColor(60, 60, 60);
              pdf.text(part.text, currentX, y);
              currentX += textWidth + 1;
              pdf.setTextColor(0, 0, 0);
            } else {
              pdf.setFont('helvetica', part.style);
              pdf.text(part.text, currentX, y);
              currentX += pdf.getTextWidth(part.text);
            }
          }
        };
        
        // Word wrap and render
        const words = text.split(' ');
        let currentLine = '';
        const lines: string[] = [];
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          // Approximate width check (rough estimation)
          if (pdf.getTextWidth(testLine) > contentWidth - 5) {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
        
        checkPageBreak(lineHeight * lines.length);
        
        for (const line of lines) {
          renderInlineMarkdown(line, margin, yPosition);
          yPosition += lineHeight;
        }
      };

      // Parse and render markdown content
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.startsWith('# ')) {
          yPosition += 3;
          addText(line.substring(2), 18, 'bold', 1.3);
          yPosition += 2;
        } else if (line.startsWith('## ')) {
          yPosition += 2;
          addText(line.substring(3), 14, 'bold', 1.3);
          yPosition += 1;
        } else if (line.startsWith('### ')) {
          yPosition += 1;
          addText(line.substring(4), 12, 'bold', 1.3);
        } else if (line.startsWith('> ')) {
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.5);
          checkPageBreak(10);
          const startY = yPosition;
          addText(line.substring(2), 10, 'italic', 1.4);
          pdf.line(margin, startY - 2, margin, yPosition - 2);
        } else if (line.match(/^[-*] /)) {
          addText('• ' + line.substring(2), 11, 'normal', 1.4);
        } else if (line.match(/^\d+\. /)) {
          addText(line, 11, 'normal', 1.4);
        } else if (line.startsWith('```')) {
          // Code block
          yPosition += 2;
          pdf.setFillColor(250, 250, 250);
          const codeLines: string[] = [];
          i++;
          while (i < lines.length && !lines[i].startsWith('```')) {
            codeLines.push(lines[i]);
            i++;
          }
          const codeHeight = codeLines.length * 5 + 6;
          checkPageBreak(codeHeight);
          pdf.rect(margin, yPosition - 3, contentWidth, codeHeight, 'F');
          pdf.setFont('courier', 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(60, 60, 60);
          for (const codeLine of codeLines) {
            pdf.text(codeLine, margin + 3, yPosition);
            yPosition += 5;
          }
          pdf.setTextColor(0, 0, 0);
          yPosition += 5;
        } else if (line.trim() === '' || line.trim() === '---') {
          yPosition += 4;
        } else if (line.trim()) {
          // Regular text with inline markdown
          addText(line, 11, 'normal', 1.5);
        }
      }

      // Generate filename
      const pdfFilename = filename.replace(/\.md$/, '') + '.pdf';
      
      // Save the PDF
      pdf.save(pdfFilename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="px-4 py-2 text-sm text-gray-700 hover:text-gray-950 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Export PDF
          </>
        )}
      </button>
      <CopyButton content={content} />
    </div>
  );
}

