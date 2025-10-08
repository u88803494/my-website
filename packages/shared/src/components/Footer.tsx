import React from 'react';

import ContactLinks from './ContactLinks';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <ContactLinks variant="circle" />
        </div>
        <div className="mt-6 text-center">
          <p className="text-slate-400">© {new Date().getFullYear()} Henry Lee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;