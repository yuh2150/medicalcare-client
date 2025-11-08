'use client';

import { useMemo, useState } from 'react';

interface HTMLContentProps {
  content: string;
  className?: string;
  maxLength?: number;
  showReadMore?: boolean;
  allowedTags?: string[];
  allowedAttributes?: string[];
  enableLinks?: boolean;
  enableTables?: boolean;
  safe?: boolean; // Use DOMPurify for extra safety (slower)
}

// Default configuration for allowed HTML elements
const DEFAULT_ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote'
];

const DEFAULT_ALLOWED_ATTR = ['class', 'style'];

export function HTMLContent({ 
  content, 
  className = '', 
  maxLength,
  showReadMore = false,
  allowedTags = DEFAULT_ALLOWED_TAGS,
  allowedAttributes = DEFAULT_ALLOWED_ATTR,
  enableLinks = true,
  enableTables = false,
  safe = false
}: HTMLContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [safeSanitizedContent, setSafeSanitizedContent] = useState('');

  // Simple HTML sanitization - fast and lightweight
  const simpleSanitize = useMemo(() => (html: string): string => {
    if (!html || typeof html !== 'string') return '';
    
    // Remove dangerous tags and attributes using regex
    let sanitized = html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<object[^>]*>.*?<\/object>/gi, '')
      .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
      .replace(/<form[^>]*>.*?<\/form>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .trim();

    // Remove non-allowed tags if specified
    if (allowedTags.length > 0) {
      const allowedTagsRegex = new RegExp(`<(?!\/?(?:${allowedTags.join('|')})[>\s])([^>]+)>`, 'gi');
      sanitized = sanitized.replace(allowedTagsRegex, '');
    }

    return sanitized;
  }, [allowedTags]);

  // Advanced sanitization using DOMPurify (async loaded)
  useMemo(() => {
    if (safe && content) {
      const loadDOMPurify = async () => {
        try {
          const { default: DOMPurify } = await import('isomorphic-dompurify');
          
          const tags = [...allowedTags];
          const attrs = [...allowedAttributes];

          if (enableLinks) {
            tags.push('a');
            attrs.push('href', 'title', 'target', 'rel');
          }

          if (enableTables) {
            tags.push('table', 'thead', 'tbody', 'tr', 'td', 'th', 'caption');
            attrs.push('colspan', 'rowspan');
          }

          const config = {
            ALLOWED_TAGS: tags,
            ALLOWED_ATTR: attrs,
            ALLOW_DATA_ATTR: false,
            ADD_ATTR: enableLinks ? ['target'] : [],
            FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
            FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea']
          };

          const sanitized = DOMPurify.sanitize(content.trim(), config);
          setSafeSanitizedContent(sanitized);
        } catch (error) {
          console.warn('HTMLContent: DOMPurify not available, falling back to simple sanitization:', error);
          setSafeSanitizedContent(simpleSanitize(content));
        }
      };

      loadDOMPurify();
    }
  }, [content, safe, allowedTags, allowedAttributes, enableLinks, enableTables, simpleSanitize]);

  // Get the final sanitized content
  const sanitizedContent = useMemo(() => {
    if (!content || typeof content !== 'string') return '';
    
    if (safe) {
      return safeSanitizedContent || simpleSanitize(content);
    }
    
    return simpleSanitize(content);
  }, [content, safe, safeSanitizedContent, simpleSanitize]);

  // Memoize truncated content with read more functionality
  const { displayContent, isTruncated } = useMemo(() => {
    if (!sanitizedContent) {
      return { displayContent: '', isTruncated: false };
    }

    // If no maxLength or content is short enough, return full content
    if (!maxLength || sanitizedContent.length <= maxLength) {
      return { displayContent: sanitizedContent, isTruncated: false };
    }

    // If expanded or showReadMore is false, return full content
    if (isExpanded || !showReadMore) {
      return { displayContent: sanitizedContent, isTruncated: true };
    }

    // Truncate content intelligently at word boundaries
    let truncated = sanitizedContent.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > maxLength * 0.8) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }

    // Add ellipsis
    truncated = truncated + '...';

    return { displayContent: truncated, isTruncated: true };
  }, [sanitizedContent, maxLength, isExpanded, showReadMore]);

  // Return empty if no content
  if (!displayContent) {
    return null;
  }

  // Custom styles for better rendering
  const customStyles = {
    lineHeight: '1.6',
    wordBreak: 'break-word' as const,
    overflowWrap: 'break-word' as const
  };

  return (
    <div className="relative">
      <div 
        className={`prose prose-gray prose-sm max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: displayContent }}
        style={customStyles}
      />
      
      {/* Read More/Less Button */}
      {showReadMore && isTruncated && (
        <div className="mt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1"
          >
            {isExpanded ? 'Thu gọn ↑' : 'Xem thêm ↓'}
          </button>
        </div>
      )}
    </div>
  );
}

// Utility function to strip HTML tags for plain text
export function stripHTMLTags(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  try {
    // Simple regex to remove HTML tags
    return html.replace(/<[^>]*>/g, '').trim();
  } catch (error) {
    console.warn('stripHTMLTags: Error stripping HTML:', error);
    return html;
  }
}

// Utility function to get text content length (excluding HTML tags)
export function getTextLength(html: string): number {
  return stripHTMLTags(html).length;
}

// Legacy export for backwards compatibility
// export { HTMLContent as HTMLContent };
