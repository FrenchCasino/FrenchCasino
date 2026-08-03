import React from 'react';

interface FlagIconProps {
  country: 'FR' | 'BE' | 'LU';
  className?: string;
}

export function FlagIcon({ country, className = "w-4 h-auto rounded-[2px] shadow-sm shrink-0" }: FlagIconProps) {
  switch (country) {
    case 'FR':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className={className} title="France">
          <rect width="3" height="2" fill="#ED2939" />
          <rect width="2" height="2" fill="#fff" />
          <rect width="1" height="2" fill="#002395" />
        </svg>
      );
    case 'BE':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className={className} title="Belgique">
          <rect width="3" height="2" fill="#ED2939" />
          <rect width="2" height="2" fill="#FAE042" />
          <rect width="1" height="2" fill="#000" />
        </svg>
      );
    case 'LU':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className={className} title="Luxembourg">
          <rect width="3" height="2" fill="#00A1DE" />
          <rect width="3" height="1.3333" fill="#fff" />
          <rect width="3" height="0.6667" fill="#ED2939" />
        </svg>
      );
    default:
      return null;
  }
}
