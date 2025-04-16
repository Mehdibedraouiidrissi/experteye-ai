
import React from 'react';

interface FooterLinksProps {
  title: string;
  links: Array<{
    text: string;
    href: string;
  }>;
}

const FooterLinks = ({ title, links }: FooterLinksProps) => {
  return (
    <div>
      <h3 className="font-bold mb-4 text-primary">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map((link, index) => (
          <li key={index}>
            <a 
              href={link.href} 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinks;
