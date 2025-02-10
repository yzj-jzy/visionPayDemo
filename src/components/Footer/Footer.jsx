import React from 'react';

const Footer = ({ startYear, endYear, versionNumber, companyName }) => {
  return (
<div className="fixed h-9 w-full bottom-0 left-0 py-2 border-t border-gray-300 bg-zinc-100 text-sm text-gray-600">
  <div className="w-full text-right pr-4">
    <span className="whitespace-nowrap">Version: {versionNumber} © {startYear}~{endYear} - {companyName}</span>
  </div>
</div>

  );
};

export default Footer;
