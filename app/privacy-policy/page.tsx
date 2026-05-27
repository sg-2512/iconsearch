export const metadata = {
  title: 'Privacy Policy — IconSearch',
  description: 'Privacy policy for IconSearch. Learn how we collect, use, and protect your data when you use iconsearch.info.',
}

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>

      <section style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px', marginBottom: '12px' }}>
          // LEGAL
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
          Last updated: May 27, 2026
        </p>
      </section>

      <article style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {[
          {
            title: '1. Introduction',
            content: 'Welcome to IconSearch ("we", "our", or "us"). IconSearch is an independent developer resource that helps frontend developers compare and discover free open-source SVG icon libraries. This Privacy Policy explains how we collect, use, and protect information when you visit iconsearch.info. By using this website, you agree to the practices described in this policy.'
          },
          {
            title: '2. Information We Collect',
            content: 'We collect minimal data necessary to operate and improve the site. This includes: anonymous usage data via Google Analytics (page views, session duration, referral sources, device type, and general geographic region); data processed by Google AdSense for serving contextually relevant advertisements; and any information you voluntarily provide when contacting us by email. We do not collect your name, email address, or any personal information through the site itself — there are no accounts, forms, or sign-ups on IconSearch.'
          },
          {
            title: '3. Google Analytics',
            content: 'We use Google Analytics 4 to understand how visitors use our site. Google Analytics uses cookies to collect anonymous, aggregated information such as page popularity, session counts, and general location data (city/country level). This data cannot be used to identify you personally. All IP addresses are anonymized before storage. You can opt out of Google Analytics tracking entirely by installing the official Google Analytics Opt-out Browser Add-on, available at tools.google.com/dlpage/gaoptout.'
          },
          {
            title: '4. Google AdSense',
            content: 'We use Google AdSense to display advertisements on our site. Google AdSense may use cookies and similar tracking technologies to serve ads based on your prior visits to our website or other websites across the internet. These are contextual and interest-based ads managed entirely by Google. We do not have access to the personal data Google collects for advertising purposes. You can opt out of personalized advertising at any time by visiting Google\'s Ads Settings at adssettings.google.com, or by opting out through the Network Advertising Initiative at optout.networkadvertising.org.'
          },
          {
            title: '5. Cookies',
            content: 'Our site uses first-party and third-party cookies. First-party cookies may store your UI preferences (such as dark/light mode) locally in your browser. Third-party cookies are set by Google Analytics and Google AdSense as described above. These cookies do not contain personally identifiable information. You can disable, block, or delete cookies through your browser settings at any time. Note that disabling cookies may affect the functionality of some site features such as theme preferences.'
          },
          {
            title: '6. How We Use Data',
            content: 'Anonymous usage data from Google Analytics is used solely to understand which pages and features are most useful to developers, to identify technical issues, and to guide future content decisions. We do not sell, rent, or share any data with third parties beyond what is inherently processed by Google Analytics and Google AdSense as described in this policy. We do not use your data for marketing, profiling, or any purpose beyond operating and improving this website.'
          },
          {
            title: '7. Third-Party Links',
            content: 'IconSearch contains links to external websites including GitHub repositories, npm package pages, official library documentation, and Figma community pages. We are not responsible for the content, privacy practices, or data collection of any external site. We recommend reviewing the privacy policy of any external site before providing personal information. The presence of a link on IconSearch does not constitute an endorsement of the linked site.'
          },
          {
            title: '8. Data Storage and Security',
            content: 'IconSearch is a static website with no user accounts, no login system, and no backend database. We do not store any personally identifiable information on our servers. Analytics and advertising data is stored and processed by Google in accordance with Google\'s own privacy policies and security standards. Our website is served over HTTPS to encrypt all data transmitted between your browser and our servers.'
          },
          {
            title: '9. California Privacy Rights (CCPA)',
            content: 'If you are a California resident, you have the right to know what personal information is collected about you, the right to request deletion of personal information, and the right to opt out of the sale of personal information. IconSearch does not sell personal information. As described in this policy, we collect only anonymous analytics data through Google Analytics. California residents may contact us at iconsearchinfo@gmail.com for any privacy-related requests.'
          },
          {
            title: '10. GDPR and EEA Residents',
            content: 'If you are located in the European Economic Area (EEA), our legal basis for processing anonymous analytics data is our legitimate interest in understanding how the website is used and improving the user experience. You have the right to access, rectify, or erase any personal data we hold about you, the right to data portability, and the right to lodge a complaint with your local supervisory authority. Because we collect no personal data directly, most GDPR rights are automatically satisfied. For any questions, contact iconsearchinfo@gmail.com.'
          },
          {
            title: '11. Children\'s Privacy',
            content: 'IconSearch is a technical resource intended for web developers and is not directed at children under the age of 13. We do not knowingly collect any personal information from children under 13. If you believe a child has provided personal information through contact with us, please email iconsearchinfo@gmail.com immediately and we will take steps to remove any such information.'
          },
          {
            title: '12. Changes to This Policy',
            content: 'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal obligations. When we make material changes, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically. Your continued use of IconSearch after any updates constitutes your acceptance of the revised policy.'
          },
          {
            title: '13. Contact Us',
            content: 'If you have any questions, concerns, or requests regarding this Privacy Policy or your privacy rights, please contact us at: iconsearchinfo@gmail.com. We aim to respond to all privacy-related enquiries within 48 business hours.'
          },
        ].map(section => (
          <div key={section.title}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>
              {section.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>
              {section.content}
            </p>
          </div>
        ))}
      </article>

    </main>
  )
}