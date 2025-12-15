import { Injectable, inject } from '@angular/core';
import { ContentService, Article } from './content.service';
import { MarkdownService } from './markdown.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private contentService = inject(ContentService);
  private markdownService = inject(MarkdownService);

  /**
   * Exporte un article en PDF (simulation - nécessiterait une bibliothèque comme jsPDF)
   */
  exportArticleToPDF(articleSlug: string): Observable<void> {
    return this.contentService.getArticleBySlug(articleSlug).pipe(
      switchMap(article => {
        if (!article) {
          throw new Error('Article non trouvé');
        }
        return this.contentService.getArticleContent(article.path);
      }),
      map(content => {
        const htmlContent = this.markdownService.parseMarkdown(content);
        this.downloadAsPDF(htmlContent, articleSlug);
      })
    );
  }

  /**
   * Exporte une section complète
   */
  exportSectionToPDF(sectionId: string): Observable<void> {
    return this.contentService.getArticles().pipe(
      map(articles => {
        const sectionArticles = articles.filter(a => 
          a.path.includes(sectionId)
        );
        
        let htmlContent = '<html><head><meta charset="UTF-8"><style>body{font-family:Arial;padding:20px;}</style></head><body>';
        
        sectionArticles.forEach(article => {
          htmlContent += `<h1>${article.title}</h1>`;
          // Note: Pour un vrai export, il faudrait charger le contenu de chaque article
        });
        
        htmlContent += '</body></html>';
        this.downloadAsPDF(htmlContent, sectionId);
      })
    );
  }

  /**
   * Exporte un article en Markdown
   */
  exportArticleToMarkdown(articleSlug: string): Observable<void> {
    return this.contentService.getArticleBySlug(articleSlug).pipe(
      switchMap(article => {
        if (!article) {
          throw new Error('Article non trouvé');
        }
        return this.contentService.getArticleContent(article.path);
      }),
      map(content => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${articleSlug}.md`;
        a.click();
        URL.revokeObjectURL(url);
      })
    );
  }

  private downloadAsPDF(htmlContent: string, filename: string): void {
    // Note: Pour un vrai export PDF, utiliser une bibliothèque comme:
    // - jsPDF avec html2canvas
    // - pdfmake
    // - Puppeteer (backend)
    
    // Solution simple: ouvrir dans une nouvelle fenêtre pour impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>${filename}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1, h2, h3 { color: #333; }
              code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
              pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}

