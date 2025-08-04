"use client";

import React from "react";

interface ClientSideDateProps {
  date: Date;
  locale: string;
  options: Intl.DateTimeFormatOptions;
}

const ClientSideDate: React.FC<ClientSideDateProps> = ({ date, locale, options }) => {
  return <>{date.toLocaleDateString(locale, options)}</>;
};

export default ClientSideDate;
