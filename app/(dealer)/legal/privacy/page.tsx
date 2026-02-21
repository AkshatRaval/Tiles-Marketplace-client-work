import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

const sections = [
    {
        title: "1. Information We Collect",
        content: `We collect information you provide directly to us, such as when you create an account, list a product, make an enquiry, or contact us for support. This includes:
    
• Name, email address, and phone number
• Business name and GST/trade details (for dealers)
• Profile pictures and uploaded tile images
• Messages and enquiries sent through the platform
• Payment-related information (processed securely by third-party gateways)

We also collect certain information automatically when you use our services, including IP address, browser type, device identifiers, and usage data through cookies and similar technologies.`,
    },
    {
        title: "2. How We Use Your Information",
        content: `We use the information we collect to:

• Provide, operate, and improve BookMyTile's services
• Create and manage your account
• Facilitate connections between buyers and dealers
• Send transactional emails and important service notifications
• Respond to your comments, questions, and customer service requests
• Monitor and analyze usage patterns to improve user experience
• Detect, investigate, and prevent fraudulent or illegal activities
• Comply with legal obligations`,
    },
    {
        title: "3. Sharing of Information",
        content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:

• Dealers or buyers as necessary to complete a transaction or enquiry you initiated
• Service providers who perform services on our behalf (hosting, analytics, payment processing)
• Law enforcement or government agencies when required by law or to protect rights and safety
• A successor entity in the event of a merger, acquisition, or sale of assets

Dealer business information (name, location, contact) is publicly displayed on their listings as part of the marketplace.`,
    },
    {
        title: "4. Cookies",
        content: `We use cookies and similar tracking technologies to enhance your experience on BookMyTile. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our service may not function properly without cookies.

Types of cookies we use:
• Essential cookies — Required for the platform to function
• Analytics cookies — Help us understand how users interact with our site
• Preference cookies — Remember your settings and preferences`,
    },
    {
        title: "5. Data Security",
        content: `We implement industry-standard technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes SSL/TLS encryption, secure data storage, and access controls.

However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`,
    },
    {
        title: "6. Your Rights",
        content: `You have the right to:

• Access the personal data we hold about you
• Request correction of inaccurate or incomplete data
• Request deletion of your account and associated data
• Opt out of marketing communications at any time
• Lodge a complaint with a data protection authority

To exercise any of these rights, please contact us at privacy@bookmytile.in.`,
    },
    {
        title: "7. Children's Privacy",
        content: `BookMyTile is not directed to children under 18 years of age. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected information from a minor, please contact us immediately so we can delete it.`,
    },
    {
        title: "8. Changes to This Policy",
        content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated effective date. We encourage you to review this policy periodically.`,
    },
    {
        title: "9. Contact Us",
        content: `If you have any questions about this Privacy Policy, please contact us at:

BookMyTile
Email: privacy@bookmytile.in
Phone: +91 98765 43210
Address: Ahmedabad, Gujarat, India — 380001`,
    },
];

const PrivacyPolicy = () => {
    return (
        <div className="bg-background">
            {/* Hero */}
            <section className="py-20 px-6 text-center bg-gradient-to-b from-primary/5 to-transparent">
                <div className="max-w-3xl mx-auto space-y-5">
                    <Badge variant="outline" className="bg-accent text-accent-foreground border-accent-foreground/20 px-5 py-2">
                        <Shield className="w-4 h-4 mr-1" /> Legal
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold font-serif">Privacy Policy</h1>
                    <p className="text-muted-foreground">
                        Effective date: <strong>1 January 2025</strong>
                    </p>
                    <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                        At BookMyTile, your privacy matters. This policy explains what information we collect, how we use it, and the choices you have.
                    </p>
                </div>
            </section>

            {/* Sections */}
            <section className="max-w-4xl mx-auto px-6 py-16 space-y-10">
                {sections.map((section) => (
                    <div key={section.title} className="space-y-3">
                        <h2 className="text-xl font-bold font-serif">{section.title}</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                            {section.content}
                        </p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default PrivacyPolicy;
