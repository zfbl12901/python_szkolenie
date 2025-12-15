import { Injectable } from '@angular/core';
import { marked } from 'marked';

declare var Prism: any;

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  parseMarkdown(markdown: string): string {
    // Supprimer le frontmatter YAML s'il existe
    let content = markdown;
    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    if (match) {
      content = match[1];
    }

    const options = {
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false
    };
    
    return marked.parse(content, options) as string;
  }

  highlightCode(element: HTMLElement): void {
    // Appliquer Prism.js après que le contenu soit inséré dans le DOM
    if (typeof Prism !== 'undefined') {
      const codeBlocks = element.querySelectorAll('pre code');
      codeBlocks.forEach((block: any) => {
        const lang = this.detectLanguage(block);
        if (lang && Prism.languages[lang]) {
          try {
            block.className = `language-${lang}`;
            block.innerHTML = Prism.highlight(block.textContent || '', Prism.languages[lang], lang);
          } catch (e) {
            console.warn('Erreur lors de la coloration du code:', e);
          }
        }
      });
    }
  }

  private detectLanguage(codeElement: HTMLElement): string | null {
    // Détecter le langage depuis la classe ou le contenu
    const className = codeElement.className || '';
    const langMatch = className.match(/language-(\w+)/);
    if (langMatch) {
      return langMatch[1];
    }
    
    // Détecter depuis le parent <pre>
    const pre = codeElement.parentElement;
    if (pre) {
      const preClass = pre.className || '';
      const preLangMatch = preClass.match(/language-(\w+)/);
      if (preLangMatch) {
        return preLangMatch[1];
      }
    }
    
    return null;
  }
}

