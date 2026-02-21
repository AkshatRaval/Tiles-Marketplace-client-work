import { Badge } from "@/components/ui/badge";
import { ScrollText } from "lucide-react";

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: `By accessing or using BookMyTile ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Platform.

These Terms apply to all visitors, users, and others who access or use the service, including registered dealers, buyers, and guests.`,
    },
    {
        title: "2. Description of Service",
        content: `BookMyTile is an online marketplace that connects tile dealers with buyers across India. We provide tools for dealers to list their products and for buyers to discover, compare, and enquire about tiles.

BookMyTile acts solely as a platform facilitating connections between buyers and dealers. We are not a party to any transaction between buyers and dealers unless explicitly stated.`,
    },
    {
        title: "3. User Accounts",
        content: `To access certain features of the Platform, you must register for an account. When creating an account, you agree to:

• Provide accurate, current, and complete information
• Maintain and promptly update your account information
• Keep your password confidential and not share it with third parties
• Notify us immediately of any unauthorized use of your account
• Accept responsibility for all activities that occur under your account

We reserve the right to suspend or terminate accounts that violate these Terms.`,
    },
    {
        title: "4. Dealer Obligations",
        content: `Dealers who list products on BookMyTile agree to:

• Provide accurate product descriptions, images, and pricing
• Honor enquiries and bookings made through the Platform
• Maintain up-to-date stock availability information
• Comply with all applicable Indian laws and regulations, including GST requirements
• Not list counterfeit, prohibited, or misrepresented products
• Respond to buyer enquiries within a reasonable time

BookMyTile reserves the right to remove listings or suspend dealer accounts for violations.`,
    },
    {
        title: "5. Buyer Obligations",
        content: `Buyers using the Platform agree to:

• Use the Platform only for lawful purposes
• Not submit false enquiries or mislead dealers
• Respect the terms and conditions set by individual dealers
• Not attempt to circumvent the Platform to avoid fees or obligations

Buyers acknowledge that final transaction terms (price, delivery, payment) are agreed upon directly with the dealer.`,
    },
    {
        title: "6. Prohibited Activities",
        content: `You may not use the Platform to:

• Violate any applicable law or regulation
• Infringe on the intellectual property rights of others
• Transmit any unsolicited commercial communications (spam)
• Attempt to gain unauthorized access to any part of the Platform
• Scrape, crawl, or systematically extract data from the Platform
• Post false, misleading, or defamatory content
• Impersonate any person or entity`,
    },
    {
        title: "7. Intellectual Property",
        content: `The Platform and its original content, features, and functionality are and will remain the exclusive property of BookMyTile and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.

Dealers retain ownership of their product images and descriptions but grant BookMyTile a non-exclusive, worldwide, royalty-free license to use, display, and distribute this content on the Platform.`,
    },
    {
        title: "8. Disclaimers & Limitation of Liability",
        content: `The Platform is provided on an "as is" and "as available" basis without warranties of any kind. BookMyTile does not warrant that the Platform will be uninterrupted, error-free, or free of viruses.

To the fullest extent permitted by law, BookMyTile shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or any transaction conducted through it.

BookMyTile's total liability to you for all claims shall not exceed the amount you paid to BookMyTile in the 12 months preceding the claim.`,
    },
    {
        title: "9. Governing Law",
        content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Ahmedabad, Gujarat.`,
    },
    {
        title: "10. Changes to Terms",
        content: `We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the effective date at the top of this page. Your continued use of the Platform after changes constitutes acceptance of the revised Terms.`,
    },
    {
        title: "11. Contact",
        content: `For questions about these Terms, contact us at:

BookMyTile
Email: legal@bookmytile.in
Phone: +91 98765 43210
Address: Ahmedabad, Gujarat, India — 380001`,
    },
];

const TermsOfService = () => {
    return (
        <div className="bg-background">
            {/* Hero */}
            <section className="py-20 px-6 text-center bg-gradient-to-b from-primary/5 to-transparent">
                <div className="max-w-3xl mx-auto space-y-5">
                    <Badge variant="outline" className="bg-accent text-accent-foreground border-accent-foreground/20 px-5 py-2">
                        <ScrollText className="w-4 h-4 mr-1" /> Legal
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold font-serif">Terms of Service</h1>
                    <p className="text-muted-foreground">
                        Effective date: <strong>1 January 2025</strong>
                    </p>
                    <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                        Please read these Terms carefully before using BookMyTile. They govern your use of our platform and services.
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

export default TermsOfService;
