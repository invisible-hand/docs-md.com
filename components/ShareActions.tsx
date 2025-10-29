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
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      let yPosition = margin;

      const checkPageBreak = (neededHeight: number) => {
        if (yPosition + neededHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Simple text renderer with word wrapping
      const addText = (text: string, fontSize: number, fontStyle: 'normal' | 'bold' | 'italic' = 'normal') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        
        const lineHeight = fontSize * 0.4;
        const lines = pdf.splitTextToSize(text, contentWidth);
        
        checkPageBreak(lineHeight * lines.length + 2);
        
        for (const line of lines) {
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        }
      };

      // Parse markdown content
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.startsWith('# ')) {
          // H1
          yPosition += 5;
          pdf.setFontSize(20);
          pdf.setFont('helvetica', 'bold');
          const h1Lines = pdf.splitTextToSize(line.substring(2), contentWidth);
          checkPageBreak(h1Lines.length * 8 + 8);
          for (const h1Line of h1Lines) {
            pdf.text(h1Line, margin, yPosition);
            yPosition += 8;
          }
          yPosition += 3;
        } else if (line.startsWith('## ')) {
          // H2
          yPosition += 4;
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          const h2Lines = pdf.splitTextToSize(line.substring(3), contentWidth);
          checkPageBreak(h2Lines.length * 6.5 + 6);
          for (const h2Line of h2Lines) {
            pdf.text(h2Line, margin, yPosition);
            yPosition += 6.5;
          }
          yPosition += 2;
        } else if (line.startsWith('### ')) {
          // H3
          yPosition += 3;
          pdf.setFontSize(13);
          pdf.setFont('helvetica', 'bold');
          const h3Lines = pdf.splitTextToSize(line.substring(4), contentWidth);
          checkPageBreak(h3Lines.length * 5.5 + 4);
          for (const h3Line of h3Lines) {
            pdf.text(h3Line, margin, yPosition);
            yPosition += 5.5;
          }
          yPosition += 1;
        } else if (line.startsWith('> ')) {
          // Blockquote
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'italic');
          pdf.setTextColor(80, 80, 80);
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(1);
          
          const quoteText = line.substring(2);
          const quoteLines = pdf.splitTextToSize(quoteText, contentWidth - 10);
          const quoteHeight = quoteLines.length * 4.5;
          
          checkPageBreak(quoteHeight + 4);
          const startY = yPosition;
          
          for (const quoteLine of quoteLines) {
            pdf.text(quoteLine, margin + 5, yPosition);
            yPosition += 4.5;
          }
          
          pdf.line(margin, startY - 2, margin, yPosition - 1);
          pdf.setTextColor(0, 0, 0);
          yPosition += 2;
        } else if (line.match(/^[-*+] /)) {
          // Bullet list
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          const bulletText = line.substring(2);
          const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 8);
          
          checkPageBreak(bulletLines.length * 4.5 + 2);
          
          pdf.text('•', margin, yPosition);
          for (let j = 0; j < bulletLines.length; j++) {
            pdf.text(bulletLines[j], margin + 5, yPosition);
            yPosition += 4.5;
          }
        } else if (line.match(/^\d+\. /)) {
          // Numbered list
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          const numMatch = line.match(/^(\d+)\. /);
          const num = numMatch ? numMatch[1] + '.' : '1.';
          const listText = line.substring(line.indexOf(' ') + 1);
          const listLines = pdf.splitTextToSize(listText, contentWidth - 10);
          
          checkPageBreak(listLines.length * 4.5 + 2);
          
          pdf.text(num, margin, yPosition);
          for (let j = 0; j < listLines.length; j++) {
            pdf.text(listLines[j], margin + 7, yPosition);
            yPosition += 4.5;
          }
        } else if (line.startsWith('```')) {
          // Code block
          const language = line.substring(3).trim();
          const codeLines: string[] = [];
          i++;
          
          while (i < lines.length && !lines[i].startsWith('```')) {
            codeLines.push(lines[i]);
            i++;
          }
          
          if (codeLines.length > 0) {
            yPosition += 3;
            pdf.setFillColor(248, 248, 248);
            pdf.setDrawColor(220, 220, 220);
            
            const codeLineHeight = 4.5;
            const codePadding = 4;
            const codeBlockHeight = codeLines.length * codeLineHeight + codePadding * 2;
            
            checkPageBreak(codeBlockHeight + 4);
            
            pdf.roundedRect(margin, yPosition - 3, contentWidth, codeBlockHeight, 1, 1, 'FD');
            
            pdf.setFontSize(9);
            pdf.setFont('courier', 'normal');
            pdf.setTextColor(50, 50, 50);
            
            yPosition += codePadding - 1;
            for (const codeLine of codeLines) {
              pdf.text(codeLine, margin + 3, yPosition);
              yPosition += codeLineHeight;
            }
            
            pdf.setTextColor(0, 0, 0);
            pdf.setFont('helvetica', 'normal');
            yPosition += codePadding + 2;
          }
        } else if (line.trim() === '---') {
          // Horizontal rule
          yPosition += 4;
          checkPageBreak(6);
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.3);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 4;
        } else if (line.trim() === '') {
          // Empty line
          yPosition += 4;
        } else {
          // Regular paragraph
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          
          // Strip inline markdown for cleaner output
          let cleanText = line
            .replace(/\*\*(.+?)\*\*/g, '$1')  // bold
            .replace(/\*(.+?)\*/g, '$1')       // italic
            .replace(/`(.+?)`/g, '$1')         // inline code
            .replace(/\[(.+?)\]\(.+?\)/g, '$1'); // links
          
          const paraLines = pdf.splitTextToSize(cleanText, contentWidth);
          checkPageBreak(paraLines.length * 4.5 + 2);
          
          for (const paraLine of paraLines) {
            pdf.text(paraLine, margin, yPosition);
            yPosition += 4.5;
          }
          yPosition += 1;
        }
      }

      const pdfFilename = filename.replace(/\.md$/, '') + '.pdf';
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

