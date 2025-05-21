import React from 'react';
import { Separator } from "@/components/ui/separator";
import FooterLinks from './FooterLinks';
import Logo from "@/components/shared/Logo";

const Footer = () => {
  const productLinks = [
    { text: "Capabilities", href: "#features" },
    { text: "How It Helps", href: "#use-cases" },
    { text: "Security & Compliance", href: "#security" }
  ];
  
  const companyLinks = [
    { text: "About DigitalHub", href: "#" },
    { text: "Team Directory", href: "#" },
    { text: "Internal Support", href: "#" }
  ];
  
  const legalLinks = [
    { text: "Data Use Policy", href: "#" },
    { text: "Access Guidelines", href: "#" },
    { text: "Terms of Use", href: "#" }
  ];

  return (
    <footer className="bg-background border-t py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-sm text-muted-foreground">
              Your AI assistant for seamless knowledge access, task automation, and smarter collaboration — built for ExpertEye teams.
            </p>
          </div>
          
          <FooterLinks title="DigitalHub" links={productLinks} />
          <FooterLinks title="Company Tools" links={companyLinks} />
          <FooterLinks title="Policies" links={legalLinks} />
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 ExpertEye DigitalHub – For internal use only.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Internal LinkedIn">
              <i className="ri-linkedin-fill"></i>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Internal GitHub">
              <i className="ri-github-fill"></i>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Intranet">
              <i className="ri-building-4-line"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
