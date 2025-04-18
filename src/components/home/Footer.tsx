
import React from 'react';
import { Separator } from "@/components/ui/separator";
import FooterLinks from './FooterLinks';
import Logo from "@/components/shared/Logo";

const Footer = () => {
  const productLinks = [
    { text: "Features", href: "#features" },
    { text: "How It Works", href: "#how-it-works" }
  ];
  
  const companyLinks = [
    { text: "About Us", href: "#" },
    { text: "Careers", href: "#" },
    { text: "Contact", href: "#" }
  ];
  
  const legalLinks = [
    { text: "Privacy Policy", href: "#" },
    { text: "Terms of Service", href: "#" },
    { text: "Cookie Policy", href: "#" }
  ];

  return (
    <footer className="bg-background border-t py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-sm text-muted-foreground">
              Advanced AI solutions for modern businesses.
            </p>
          </div>
          
          <FooterLinks title="Product" links={productLinks} />
          <FooterLinks title="Company" links={companyLinks} />
          <FooterLinks title="Legal" links={legalLinks} />
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 ExpertEye, All Rights Reserved
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <i className="ri-linkedin-fill"></i>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <i className="ri-twitter-fill"></i>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <i className="ri-facebook-fill"></i>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <i className="ri-instagram-fill"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
