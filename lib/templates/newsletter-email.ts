import { TrendData } from '../types';

interface NewsletterTemplateData {
  trends: TrendData[];
  generatedAt: string;
  subcategoryName: string;
}

export function generateNewsletterHTML(data: NewsletterTemplateData): string {
  const { trends, generatedAt, subcategoryName } = data;

  // Extract all unique references from trends
  const allReferences = trends
    .flatMap(trend => trend.references || [])
    .filter((reference, index, arr) => arr.indexOf(reference) === index);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fashion Trends Newsletter</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 60px 40px 40px 40px; text-align: center; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
              <h1 style="margin: 0 0 16px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 48px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.02em; line-height: 1.1;">
                Fashion Trends<br/>
                <span style="background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Research</span>
              </h1>
              <p style="margin: 0; font-size: 18px; color: #666666; font-weight: 300; line-height: 1.6;">
                Your weekly dose of ${subcategoryName} trends
              </p>
              <p style="margin: 12px 0 0 0; font-size: 14px; color: #999999;">
                ${new Date(generatedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </td>
          </tr>

          <!-- Trends Section -->
          ${trends.map((trend, index) => `
          <tr>
            <td style="padding: ${index === 0 ? '40px' : '0 40px 40px 40px'};">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 32px;">
                    <!-- Trend Header -->
                    <h2 style="margin: 0 0 24px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.02em;">
                      Trend #${trend.number}
                    </h2>

                    <!-- Trend Description -->
                    <div style="margin-bottom: 32px; font-size: 16px; line-height: 1.8; color: #333333; font-weight: 300;">
                      ${formatMarkdownToHTML(trend.description)}
                    </div>

                    <!-- Images Grid -->
                    ${trend.image_urls && trend.image_urls.length > 0 ? `
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <h4 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 600; color: #1a1a1a;">
                            Visual Inspiration
                          </h4>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          ${trend.image_urls.length === 1 ? `
                          <!-- Single horizontal image -->
                          <img src="${trend.image_urls[0]}" alt="Trend ${trend.number}" style="width: 100%; height: auto; display: block; border-radius: 8px;" />
                          ` : `
                          <!-- Multiple images stacked vertically (mobile-friendly) -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            ${trend.image_urls.map((imageUrl, imgIndex) => `
                            <tr>
                              <td style="padding-bottom: ${imgIndex < trend.image_urls.length - 1 ? '16px' : '0'};">
                                <img src="${imageUrl}" alt="Trend ${trend.number} - Image ${imgIndex + 1}" style="width: 100%; max-width: 600px; height: auto; display: block; border-radius: 8px;" />
                              </td>
                            </tr>
                            `).join('')}
                          </table>
                          `}
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `).join('')}

          <!-- References Section -->
          ${allReferences.length > 0 ? `
          <tr>
            <td style="padding: 40px; border-top: 1px solid #e5e5e5;">
              <h3 style="margin: 0 0 24px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; color: #1a1a1a; text-align: center;">
                Sources & References
              </h3>
              <p style="margin: 0 0 24px 0; text-align: center; color: #666666; font-size: 16px;">
                All sources used to research these fashion trends
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${allReferences.map((reference, index) => `
                <tr>
                  <td style="padding: 8px 0;">
                    <a href="${reference}" target="_blank" rel="noopener noreferrer" style="display: block; padding: 12px 16px; background-color: #fafafa; border-radius: 6px; color: #333333; text-decoration: none; font-size: 14px; word-break: break-all; transition: background-color 0.2s;">
                      ${reference}
                    </a>
                  </td>
                </tr>
                `).join('')}
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td style="padding: 40px; background-color: #1a1a1a; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff; font-weight: 300;">
                Powered by AI-driven fashion trend research
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999;">
                &copy; ${new Date().getFullYear()} Kanibal. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Convert markdown text to basic HTML for email
 */
function formatMarkdownToHTML(markdown: string): string {
  let html = markdown;

  // Convert headers
  html = html.replace(/### (.*?)$/gm, '<h4 style="margin: 16px 0 8px 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">$1</h4>');
  html = html.replace(/## (.*?)$/gm, '<h3 style="margin: 20px 0 12px 0; font-family: \'Playfair Display\', Georgia, serif; font-size: 24px; font-weight: 700; color: #1a1a1a;">$1</h3>');
  html = html.replace(/# (.*?)$/gm, '<h2 style="margin: 24px 0 16px 0; font-family: \'Playfair Display\', Georgia, serif; font-size: 28px; font-weight: 700; color: #1a1a1a;">$1</h2>');

  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: #1a1a1a;">$1</strong>');

  // Convert italic
  html = html.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>');

  // Convert unordered lists
  html = html.replace(/^\* (.*?)$/gm, '<li style="margin: 4px 0; color: #333333;">$1</li>');
  html = html.replace(/(<li.*?<\/li>\n?)+/g, '<ul style="margin: 12px 0; padding-left: 24px; list-style-type: disc;">$&</ul>');

  // Convert ordered lists
  html = html.replace(/^\d+\. (.*?)$/gm, '<li style="margin: 4px 0; color: #333333;">$1</li>');

  // Convert paragraphs
  html = html.split('\n\n').map(para => {
    if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol') || para.startsWith('<li')) {
      return para;
    }
    return `<p style="margin: 12px 0; line-height: 1.8; color: #333333;">${para}</p>`;
  }).join('\n');

  return html;
}
