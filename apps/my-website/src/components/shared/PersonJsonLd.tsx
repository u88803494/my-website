import { SOCIAL_LINKS } from "@packages/shared/constants";

interface PersonJsonLdProps {
  jobTitle: string;
  url: string;
}

const PersonJsonLd: React.FC<PersonJsonLdProps> = ({ jobTitle, url }) => {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    image: "https://henryleelab.com/images/my-photo.jpeg",
    jobTitle,
    name: "Henry Lee",
    sameAs: [SOCIAL_LINKS.GITHUB, SOCIAL_LINKS.LINKEDIN, SOCIAL_LINKS.MEDIUM],
    url,
    worksFor: {
      "@type": "Organization",
      name: "Henry Lee Lab",
    },
  };

  return <script dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} type="application/ld+json" />;
};

export default PersonJsonLd;
