import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    HelpCircle,
    ShoppingBag,
    Store,
    CreditCard,
    Package,
    MessageCircle,
} from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        category: "Orders & Shopping",
        icon: ShoppingBag,
        questions: [
            {
                q: "How do I browse and search for tiles?",
                a: "Use the search bar at the top of the home page or navigate to 'Browse Tiles' to explore our full catalog. You can filter by category, price, size, and material.",
            },
            {
                q: "Can I contact a dealer directly?",
                a: "Yes! Each tile listing shows the dealer's contact details. You can use the 'Book' or 'Enquire' button on any product page to reach out.",
            },
            {
                q: "Is there a minimum order quantity?",
                a: "Minimum order quantities are set by individual dealers and will be shown on the product listing. Most dealers are flexible for sample orders.",
            },
        ],
    },
    {
        category: "For Dealers",
        icon: Store,
        questions: [
            {
                q: "How do I list my tiles on BookMyTile?",
                a: "Create a dealer account, complete your profile verification, and you can start adding your tile inventory from your dashboard.",
            },
            {
                q: "How long does verification take?",
                a: "Dealer verification typically takes 1–3 business days. You'll receive an email notification once your account is approved.",
            },
            {
                q: "Can I manage multiple showrooms?",
                a: "Yes, a single dealer account can manage multiple locations. Add additional showrooms from your dealer dashboard under 'Manage Locations'.",
            },
        ],
    },
    {
        category: "Payments",
        icon: CreditCard,
        questions: [
            {
                q: "How do payments work on the platform?",
                a: "BookMyTile facilitates the connection between buyers and dealers. Final payment terms are agreed upon directly between the buyer and dealer.",
            },
            {
                q: "Is my payment information secure?",
                a: "We use industry-standard encryption and never store your card details. All transactions are processed through secure, PCI-compliant payment gateways.",
            },
        ],
    },
    {
        category: "Shipping & Delivery",
        icon: Package,
        questions: [
            {
                q: "Who handles delivery?",
                a: "Delivery is arranged by the dealer. Shipping costs, timelines, and carriers vary by dealer and are shown at checkout or on the product page.",
            },
            {
                q: "What if my tiles arrive damaged?",
                a: "Contact the dealer directly within 48 hours of delivery with photos of the damage. Most dealers offer replacements for documented damage.",
            },
        ],
    },
];

const HelpCenter = () => {
    return (
        <div className="bg-background">
            {/* Hero */}
            <section className="py-20 px-6 text-center bg-gradient-to-b from-primary/5 to-transparent">
                <div className="max-w-3xl mx-auto space-y-5">
                    <Badge variant="outline" className="bg-accent text-accent-foreground border-accent-foreground/20 px-5 py-2">
                        <HelpCircle className="w-4 h-4 mr-1" /> Help Center
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold font-serif">
                        How can we help you?
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Find answers to the most common questions about BookMyTile — for
                        buyers and dealers alike.
                    </p>
                </div>
            </section>

            {/* FAQ Sections */}
            <section className="max-w-5xl mx-auto px-6 py-16 space-y-14">
                {faqs.map((section) => (
                    <div key={section.category}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <section.icon className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold font-serif">{section.category}</h2>
                        </div>
                        <div className="grid gap-4">
                            {section.questions.map((item) => (
                                <Card key={item.q} className="border-border">
                                    <CardContent className="pt-6 space-y-2">
                                        <h3 className="font-semibold text-base">{item.q}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* Contact CTA */}
            <section className="bg-muted py-14 px-6">
                <div className="max-w-2xl mx-auto text-center space-y-5">
                    <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-primary/10 text-primary">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold font-serif">Still need help?</h2>
                    <p className="text-muted-foreground">
                        Our support team is available Monday–Saturday, 9 AM to 6 PM IST.
                    </p>
                    <Link
                        href="mailto:support@bookmytile.in"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-8 py-3 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Email Support
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HelpCenter;
