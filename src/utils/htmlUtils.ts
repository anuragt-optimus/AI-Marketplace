/**
 * Convert HTML markup to plain text for display in UI
 * @param html - HTML string with markup
 * @returns Plain text string
 */
export const htmlToPlainText = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Get the text content (this strips all HTML tags)
  return tempDiv.textContent || tempDiv.innerText || '';
};

/**
 * Convert plain text to HTML markup (simple conversion for common formatting)
 * @param text - Plain text string
 * @returns HTML string with basic markup
 */
export const plainTextToHtml = (text: string): string => {
  if (!text) return '';
  
  // If the text already contains HTML markup, sanitize and return it
  if (containsHtml(text)) {
    return sanitizeHtml(text);
  }
  
  // Convert plain text to HTML with basic formatting
  let html = text;
  
  // Convert line breaks to <br> tags
  html = html.replace(/\n/g, '<br>');
  
  // Convert **bold** to <b>bold</b>
  html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  
  // Convert *italic* to <i>italic</i>
  html = html.replace(/\*(.*?)\*/g, '<i>$1</i>');
  
  return html;
};

/**
 * Check if a string contains HTML markup
 * @param str - String to check
 * @returns Boolean indicating if string contains HTML
 */
export const containsHtml = (str: string): boolean => {
  if (!str) return false;
  return /<[^>]*>/g.test(str);
};

/**
 * Sanitize HTML content by removing script tags and other dangerous elements
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*'[^']*'/gi, '');
  
  return sanitized;
};
