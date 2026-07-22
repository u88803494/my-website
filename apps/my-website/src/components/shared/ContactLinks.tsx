import { CONTACT_LINKS } from "@packages/shared/constants";
import { FileText, Mail } from "lucide-react";
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
  locale?: "en" | "zh-Hant";
  variant?: "circle" | "link";
}

const englishEmailHref = `mailto:${
  CONTACT_LINKS.find(({ key }) => key === "email")
    ?.href.split("mailto:")[1]
    ?.split("?")[0]
}?subject=${encodeURIComponent("I'd like to discuss your work")}&body=${encodeURIComponent("Hi Henry,\n\nI came across your portfolio and would like to discuss your experience and potential opportunities.\n\nBest regards,")}`;

const englishLabels = {
  email: { href: englishEmailHref, label: "Email", tooltip: "Email me directly" },
  github: { label: "GitHub", tooltip: "View my code on GitHub" },
  linkedin: { label: "LinkedIn", tooltip: "View my professional profile" },
  medium: { label: "Medium", tooltip: "Read my technical articles" },
  resume: { label: "Resume", tooltip: "View my complete resume and experience" },
} as const;

const ContactLinks = ({ className = "", locale = "zh-Hant", variant = "circle" }: ContactLinksProps) => {
  const baseClass = variant === "circle" ? "btn btn-ghost btn-circle" : "link link-hover";

  return (
    <>
      {contacts.map(({ href, icon, key, label, tooltip }) => {
        const localized = locale === "en" ? englishLabels[key as keyof typeof englishLabels] : { label, tooltip };
        const localizedHref = "href" in localized ? localized.href : href;

        return (
          <a
            aria-label={localized.label}
            className={`${baseClass} ${className} tooltip tooltip-custom tooltip-top`.trim()}
            data-tip={localized.tooltip}
            href={localizedHref}
            key={key}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            target={href.startsWith("http") ? "_blank" : undefined}
          >
            {icon}
          </a>
        );
      })}
    </>
  );
};

export default ContactLinks;
