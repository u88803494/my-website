import { CONTACT_LINKS } from "@packages/shared/constants";
import { FileText, Mail } from "lucide-react";
import React from "react";
import { SiGithub, SiLinkedin, SiMedium } from "react-icons/si";

// Define the type locally from the constant
type ContactLink = (typeof CONTACT_LINKS)[number];

const iconMap = {
  email: <Mail className="h-6 w-6" />,
  github: <SiGithub className="h-6 w-6" />,
  linkedin: <SiLinkedin className="h-6 w-6" />,
  medium: <SiMedium className="h-6 w-6" />,
  resume: <FileText className="h-6 w-6" />,
} as const;

const contacts = CONTACT_LINKS.map((link: ContactLink) => ({
  ...link,
  icon: iconMap[link.key as keyof typeof iconMap],
}));

interface ContactLinksProps {
  className?: string;
  variant?: "circle" | "link";
}

const ContactLinks = ({ className = "", variant = "circle" }: ContactLinksProps) => {
  const baseClass = variant === "circle" ? "btn btn-ghost btn-circle" : "link link-hover";

  return (
    <>
      {contacts.map(({ href, icon, label, tooltip }) => (
        <a
          aria-label={label}
          className={`${baseClass} ${className} tooltip tooltip-custom tooltip-top`.trim()}
          data-tip={tooltip}
          href={href}
          key={label}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          target={href.startsWith("http") ? "_blank" : undefined}
        >
          {icon}
        </a>
      ))}
    </>
  );
};

export default ContactLinks;
