'use client';

import { AppProgressBar } from 'next-nprogress-bar';

const NProgressBar = () => {
  return (
    <AppProgressBar
      height="4px"
      color="#2299dd"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
};

export default NProgressBar;