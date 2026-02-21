import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

const footerLinks = {
    explore: [
        { label: "Browse Tiles", href: "/tiles" },
        { label: "New Arrivals", href: "/tiles?sort=newest" },
        { label: "Featured", href: "/tiles?featured=true" },
        { label: "Categories", href: "/tiles" },
        { label: "Deals", href: "/tiles?sort=price_asc" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
    ],
    support: [
        { label: "Help Center", href: "/legal/help-center" },
        { label: "Privacy Policy", href: "/legal/privacy" },
        { label: "Terms of Service", href: "/legal/terms" },
    ],
};

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
    return (
        <footer className="bg-background border-t">
            {/* Top section */}
            <div className="max-w-7xl mx-auto px-6 py-14">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand column */}
                    <div className="lg:col-span-2 space-y-5">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">BT</span>
                            </div>
                            <span className="font-serif text-xl font-bold">BookMyTile</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            India's most trusted tile marketplace — connecting verified
                            dealers with customers who deserve a better way to discover and
                            buy premium tiles.
                        </p>
                        {/* Contact info */}
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                <span>support@bookmytile.in</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>Ahmedabad, Gujarat, India — 380001</span>
                            </div>
                        </div>
                        {/* Social */}
                        <div className="flex items-center gap-3 pt-1">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-full border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">
                            Explore
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.explore.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">
                            Company
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">
                            Support
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Bottom bar */}
            <div className="max-w-7xl mx-auto px-6 py-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} BookMyTile. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                            Privacy
                        </Link>
                        <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                            Terms
                        </Link>
                        <Link href="/sitemap" className="hover:text-foreground transition-colors">
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
