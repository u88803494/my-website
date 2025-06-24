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
    href: "mailto:yhlscallop@gmail.com?subject=%E9%97%9C%E6%96%BC%E6%82%A8%E7%9A%84%E4%BD%9C%E5%93%81%E9%9B%86%EF%BC%8C%E6%88%91%E6%83%B3%E8%88%87%E6%82%A8%E8%81%8A%E8%81%8A&body=%E6%82%A8%E5%A5%BD%EF%BC%8CHenry%EF%BC%8C%0A%0A%E6%88%91%E5%9C%A8%E6%82%A8%E7%9A%84%E5%80%8B%E4%BA%BA%E7%B6%B2%E7%AB%99%E4%B8%8A%E7%9C%8B%E5%88%B0%E4%BA%86%E6%82%A8%E7%9A%84%E7%B6%93%E6%AD%B7%EF%BC%8C%E6%83%B3%E8%88%87%E6%82%A8%E9%80%B2%E4%B8%80%E6%AD%A5%E8%A8%8E%E8%AB%96...%0A%0A%E6%9C%9F%E5%BE%85%E6%82%A8%E7%9A%84%E5%9B%9E%E8%A6%86%EF%BC%81",
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
