import { NewsletterOverviewTemplateData } from '../types-overview';

export function generateNewsletterOverviewHTML(data: NewsletterOverviewTemplateData): string {
  const { categories, generatedAt, language } = data;

  // Hebrew text
  const isHebrew = language === 'Hebrew';
  const direction = isHebrew ? 'rtl' : 'ltr';
  const textAlign = isHebrew ? 'right' : 'left';

  // Extract all unique references from all categories
  const allReferences = categories
    .flatMap(cat => cat.references || [])
    .filter((reference, index, arr) => arr.indexOf(reference) === index);

  return `
<!DOCTYPE html>
<html lang="${isHebrew ? 'he' : 'en'}" dir="${direction}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>סקירת טרנדים שבועית</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  ${isHebrew ? '<link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700&family=Heebo:wght@300;400;500;600;700&display=swap" rel="stylesheet">' : ''}
</head>
<body style="margin: 0; padding: 0; font-family: ${isHebrew ? "'Assistant', 'Heebo'," : "'Inter',"} -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 60px 40px 40px 40px; text-align: center; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
              <h1 style="margin: 0 0 16px 0; font-family: ${isHebrew ? "'Heebo', 'Assistant'," : "'Playfair Display', Georgia,"} serif; font-size: 48px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.02em; line-height: 1.1;">
                ${isHebrew ? 'טרנדי אופנה שבועי' : 'Weekly Fashion Trends'}
              </h1>
              <p style="margin: 0; font-size: 18px; color: #666666; font-weight: 300; line-height: 1.6;">
                ${isHebrew ? 'סקירה שבועית של טרנדי האופנה' : 'Your weekly fashion trends overview'}
              </p>
              <p style="margin: 12px 0 0 0; font-size: 14px; color: #999999;">
                ${new Date(generatedAt).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </td>
          </tr>

          <!-- Categories Section -->
          ${categories.map((category, index) => `
          <tr>
            <td style="padding: ${index === 0 ? '40px' : '0 40px 40px 40px'};">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 32px;">
                    <!-- Category Header - Small Gray Text Only -->
                    <p style="margin: 0 0 24px 0; font-size: 14px; color: #999999; text-transform: uppercase; letter-spacing: 1px; text-align: ${textAlign}; font-weight: 500;">
                      ${category.category_id.replace('-', ' ')}
                    </p>

                    <!-- Category Description -->
                    <div style="margin-bottom: 32px; font-size: 16px; line-height: 1.8; color: #333333; text-align: ${textAlign}; direction: ${direction};">
                      <p style="margin: 12px 0; line-height: 1.8; color: #333333;">
                        ${category.description_translated || category.description_english}
                      </p>
                    </div>

                    <!-- Image -->
                    ${category.image_url ? `
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <h4 style="margin: 0; font-family: ${isHebrew ? "'Heebo', 'Assistant'," : "'Playfair Display', Georgia,"} serif; font-size: 20px; font-weight: 600; color: #1a1a1a; text-align: ${textAlign};">
                            ${isHebrew ? 'השראה ויזואלית' : 'Visual Inspiration'}
                          </h4>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img src="${category.image_url}" alt="${category.category_name}" style="width: 100%; height: auto; display: block; border-radius: 8px;" />
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
              <h3 style="margin: 0 0 24px 0; font-family: ${isHebrew ? "'Heebo', 'Assistant'," : "'Playfair Display', Georgia,"} serif; font-size: 28px; font-weight: 700; color: #1a1a1a; text-align: ${textAlign};">
                ${isHebrew ? 'מקורות ומראי מקום' : 'Sources & References'}
              </h3>
              <p style="margin: 0 0 24px 0; text-align: ${textAlign}; color: #666666; font-size: 16px;">
                ${isHebrew ? 'כל המקורות ששימשו למחקר טרנדי האופנה' : 'All sources used to research these fashion trends'}
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
                ${isHebrew ? 'מופעל על ידי מחקר טרנדים מונחה בינה מלאכותית' : 'Powered by AI-driven fashion trend research'}
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999;">
                &copy; ${new Date().getFullYear()} Kanibal. ${isHebrew ? 'כל הזכויות שמורות' : 'All rights reserved'}.
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
