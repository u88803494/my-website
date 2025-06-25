import { Mail, FileText } from 'lucide-react';
import { SiGithub, SiLinkedin, SiMedium } from 'react-icons/si';
import { CONTACT_LINKS } from '@/constants/socialLinks';

const iconMap = {
  github: <SiGithub className="w-6 h-6" />,
  linkedin: <SiLinkedin className="w-6 h-6" />,
  medium: <SiMedium className="w-6 h-6" />,
  resume: <FileText className="w-6 h-6" />,
  email: <Mail className="w-6 h-6" />
} as const;

const contacts = CONTACT_LINKS.map(link => ({
  ...link,
  icon: iconMap[link.key as keyof typeof iconMap]
}));

interface ContactLinksProps {
  variant?: 'circle' | 'link';
  className?: string;
}

const ContactLinks = ({ variant = 'circle', className = '' }: ContactLinksProps) => {
  const baseClass = variant === 'circle' 
    ? 'btn btn-ghost btn-circle' 
    : 'link link-hover';

  return (
    <>
      {contacts.map(({ icon, href, label, tooltip }) => (
        <a
          key={label}
          href={href}
          className={`${baseClass} ${className} tooltip tooltip-custom tooltip-top`.trim()}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={label}
          data-tip={tooltip}
        >
          {icon}
        </a>
      ))}
    </>
  );
};

export default ContactLinks; 
