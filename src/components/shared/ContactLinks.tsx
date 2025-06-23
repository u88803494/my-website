import { Mail } from 'lucide-react';
import { SiGithub, SiLinkedin, SiMedium } from 'react-icons/si';

const contacts = [
  {
    icon: <SiGithub className="w-6 h-6" />, 
    href: "https://github.com/u88803494",
    label: "Github"
  },
  {
    icon: <SiLinkedin className="w-6 h-6" />, 
    href: "https://www.linkedin.com/in/yu-hao-lee-a6a42179/",
    label: "Linkedin"
  },
  {
    icon: <SiMedium className="w-6 h-6" />, 
    href: "https://medium.com/@hugh-program-learning-diary-js",
    label: "Medium"
  },
  {
    icon: <Mail className="w-6 h-6" />, 
    href: "mailto:yhlscallop@gmail.com",
    label: "Email"
  }
];

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
      {contacts.map(({ icon, href, label }) => (
        <a
          key={label}
          href={href}
          className={`${baseClass} ${className}`.trim()}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={label}
        >
          {icon}
        </a>
      ))}
    </>
  );
};

export default ContactLinks; 
