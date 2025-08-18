'use client';

import { Check, Award, Zap } from 'lucide-react';

interface VerificationBadgeProps {
  business: {
    id: string;
    name: string;
    verified?: boolean;
    hackathonPartner?: boolean;
    transactionCount?: number;
  };
}

export function VerificationBadge({ business }: VerificationBadgeProps) {
  const badges = [];

  // Hackathon verification badge
  if (business.verified) {
    badges.push({
      icon: <Check className="w-3 h-3" />,
      label: 'Base Verified',
      color: 'bg-green-100 text-green-800 border-green-200'
    });
  }

  // Hackathon partner badge
  if (business.hackathonPartner) {
    badges.push({
      icon: <Award className="w-3 h-3" />,
      label: 'Hackathon Partner',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    });
  }

  // High activity badge
  if (business.transactionCount && business.transactionCount >= 5) {
    badges.push({
      icon: <Zap className="w-3 h-3" />,
      label: 'Popular',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {badges.map((badge, index) => (
        <div
          key={index}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badge.color}`}
        >
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

// Hackathon demo data with verified businesses
export const HACKATHON_BUSINESSES = [
  {
    id: 'base-cafe',
    name: 'Base Café',
    verified: true,
    hackathonPartner: true,
    transactionCount: 12
  },
  {
    id: 'crypto-corner',
    name: 'Crypto Corner Store',
    verified: true,
    transactionCount: 8
  },
  {
    id: 'web3-workshop',
    name: 'Web3 Workshop',
    verified: true,
    hackathonPartner: true,
    transactionCount: 15
  }
];
