import type {
  ComplianceVariantId,
  PageDynamicVariant,
} from '../types/compliance.ts';

export interface HomeHeroOffer {
  badge: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  featuredRateLabel: string;
  featuredRateValue: string;
  disclaimer: string;
}

export interface HomePageContent {
  campaignHero: HomeHeroOffer;
  announcementNotice: string;
  tickerRates: Array<{ label: string; rate: string; sub: string }>;
  pillars: Array<{
    title: string;
    description: string;
    link: string;
    tag: string;
    icon: string;
  }>;
}

export const homeVariants: Record<ComplianceVariantId, PageDynamicVariant<HomePageContent>> = {
  compliant: {
    id: 'compliant',
    label: 'Fully Disclosed Marketing Presentation',
    complianceRating: 'A (Fully Compliant)',
    riskLevel: 'LOW',
    summary: 'Clear APR/APY distinctions, proper disclaimers, Equal Housing Lender logo, FDIC coverage limits, and SEC advisory boundary statements.',
    flags: [],
    content: {
      campaignHero: {
        badge: 'Institutional Banking & Wealth Management',
        headline: 'Financial Precision. Transparent Governance. Uncompromised Trust.',
        subheadline: 'Apex Horizon Bank delivers bespoke consumer banking, competitive residential mortgage financing, and fiduciary wealth management with full upfront regulatory clarity.',
        primaryCtaText: 'Explore Mortgages & Rates',
        primaryCtaLink: '/mortgages',
        secondaryCtaText: 'High-Yield Savings (5.15% APY)',
        secondaryCtaLink: '/savings',
        featuredRateLabel: 'Conforming 30-Year Fixed',
        featuredRateValue: '6.125% Rate / 6.240% APR',
        disclaimer: 'Based on 20% down payment and 740+ FICO. Apex Horizon Bank N.A. Member FDIC. Equal Housing Lender.',
      },
      announcementNotice: 'Rate Announcement: Federal Reserve updates reflected in our published APR and APY schedules as of this week.',
      tickerRates: [
        { label: '30-Yr Fixed Conforming', rate: '6.240% APR', sub: '6.125% Note Rate' },
        { label: '15-Yr Fixed Conforming', rate: '5.580% APR', sub: '5.450% Note Rate' },
        { label: 'High-Yield Savings', rate: '5.15% APY', sub: '$500 min balance' },
        { label: '14-Mo CD', rate: '5.35% APY', sub: '$1,000 min deposit' },
        { label: 'Premier Cash Card', rate: '0% Intro APR', sub: '15 billing cycles' },
        { label: 'Wall Street Prime', rate: '8.50%', sub: 'Benchmark index' },
      ],
      pillars: [
        {
          title: 'Residential Mortgages',
          description: 'Home purchase and refinancing loans with full TILA / Reg Z APR disclosures and guaranteed closing cost schedules.',
          link: '/mortgages',
          tag: 'TILA / Reg Z Compliant',
          icon: 'Home',
        },
        {
          title: 'High-Yield Savings & CDs',
          description: 'Institutional-grade deposit accounts with daily compounding and clear FDIC $250k protection limits under TISA / Reg DD.',
          link: '/savings',
          tag: 'TISA / Reg DD Verified',
          icon: 'PiggyBank',
        },
        {
          title: 'Consumer Credit Cards',
          description: 'Cash back and premium travel cards with transparent Schumer Box fee schedules and CARD Act compliance.',
          link: '/credit-cards',
          tag: 'CARD Act Compliant',
          icon: 'CreditCard',
        },
        {
          title: 'Private Wealth Advisory',
          description: 'SEC-registered fiduciary wealth management with clear capital-at-risk disclosures and fee transparency.',
          link: '/wealth',
          tag: 'SEC / FINRA Disclosed',
          icon: 'TrendingUp',
        },
        {
          title: 'Commercial Business Credit',
          description: 'Working capital lines and equipment financing with California SB 1235 & NY compliant APR calculations.',
          link: '/business-loans',
          tag: 'Commercial APR Disclosed',
          icon: 'Building2',
        },
        {
          title: 'Compliance & Legal Archive',
          description: 'Review complete fee schedules, Equal Housing statements, CRA notices, and privacy disclosures.',
          link: '/disclosures',
          tag: 'Regulatory Archive',
          icon: 'ShieldCheck',
        },
      ],
    },
  },

  minor_omissions: {
    id: 'minor_omissions',
    label: 'Subtle Marketing Omissions & Buried Footnotes',
    complianceRating: 'C (Minor Non-Compliance)',
    riskLevel: 'MEDIUM',
    summary: 'Promotes attractive rates without immediate APR/APY clarification, relying on fine print at page bottom.',
    flags: [
      {
        category: 'TILA_REG_Z',
        severity: 'minor',
        title: 'Hero Banner APR Footnote Dependency',
        description: 'Interest rates featured prominently in hero section without immediately adjacent APR.',
        expectedDisclosure: 'Immediate adjacent APR display.',
        actualContentSnippet: '"Mortgages from 4.87%*" with asterisk referencing page footer.',
      },
    ],
    content: {
      campaignHero: {
        badge: 'Seasonal Rate Special',
        headline: 'Lower Monthly Payments on Home Purchases & Refinancing',
        subheadline: 'Take advantage of limited-time seasonal promotional rates across our consumer and commercial lending catalog.',
        primaryCtaText: 'View 4.87% Mortgages*',
        primaryCtaLink: '/mortgages',
        secondaryCtaText: '5.25% Savings Accounts',
        secondaryCtaLink: '/savings',
        featuredRateLabel: 'Promotional Mortgage Rate',
        featuredRateValue: '4.875% Note Rate*',
        disclaimer: '*Terms and conditions apply. APR details provided in footer.',
      },
      announcementNotice: 'Limited inventory: Promotional financing rates available while allocations last.',
      tickerRates: [
        { label: 'Fixed Mortgage', rate: '4.875%*', sub: 'APR in footer' },
        { label: 'Apex Growth Savings', rate: '5.25%', sub: 'Interest rate' },
        { label: 'Pure Balance Card', rate: '0% Intro*', sub: 'Fee applies' },
        { label: 'Commercial Advance', rate: '1.18 Factor', sub: 'Simple fee' },
      ],
      pillars: [
        {
          title: 'Residential Mortgages',
          description: 'Discover how you can reduce your monthly payment with our latest home loan products.',
          link: '/mortgages',
          tag: 'Mortgage Solutions',
          icon: 'Home',
        },
        {
          title: 'High-Yield Savings',
          description: 'Grow your money faster with our high return savings account.',
          link: '/savings',
          tag: 'Savings',
          icon: 'PiggyBank',
        },
        {
          title: 'Credit Cards',
          description: 'Consolidate debt with 0% introductory credit solutions.',
          link: '/credit-cards',
          tag: 'Credit Cards',
          icon: 'CreditCard',
        },
        {
          title: 'Wealth Management',
          description: 'Grow your portfolio with our proprietary investment strategies.',
          link: '/wealth',
          tag: 'Investments',
          icon: 'TrendingUp',
        },
        {
          title: 'Business Loans',
          description: 'Fast capital advances for operational growth.',
          link: '/business-loans',
          tag: 'Commercial',
          icon: 'Building2',
        },
        {
          title: 'Disclosures Hub',
          description: 'General regulatory disclosures and account agreements.',
          link: '/disclosures',
          tag: 'Disclosures',
          icon: 'ShieldCheck',
        },
      ],
    },
  },

  high_risk_udaap: {
    id: 'high_risk_udaap',
    label: 'Critical UDAAP Violations & Deceptive Guarantees',
    complianceRating: 'F (High-Risk UDAAP Violation)',
    riskLevel: 'CRITICAL',
    summary: 'Deceptive "100% Guaranteed Approval", claims "Zero Fees Ever", and states investment returns are guaranteed by the US Government.',
    flags: [
      {
        category: 'CFPB_UDAAP',
        severity: 'critical',
        title: 'Deceptive Cross-Product Guarantees',
        description: 'Homepage promises unconditional approvals, zero fees, and government-backed profits across lending and wealth lines.',
        expectedDisclosure: 'Fair lending, truth in lending, and nondeposit investment disclosures.',
        actualContentSnippet: '"100% Guaranteed Approval on Mortgages, Cards, and 20% Guaranteed Investment Returns!"',
      },
    ],
    content: {
      campaignHero: {
        badge: '100% UNCONDITIONAL APPROVAL GUARANTEE',
        headline: 'Instant Cash, Guaranteed Mortgages & 20% Risk-Free Investment Returns!',
        subheadline: 'The only bank in the nation where NOBODY is turned down! Get approved in 60 seconds with zero credit checks, zero down payment, and zero fees ever!',
        primaryCtaText: 'Get Guaranteed Approval',
        primaryCtaLink: '/mortgages',
        secondaryCtaText: 'Earn 8.50% Guaranteed APY',
        secondaryCtaLink: '/savings',
        featuredRateLabel: 'Unconditional Home Loan',
        featuredRateValue: '1.99% Fixed for Everyone',
        disclaimer: 'No credit checks, no income checks, zero fees forever. Approved instantly.',
      },
      announcementNotice: 'ALERT: Every visitor is pre-approved for $500,000 credit today only!',
      tickerRates: [
        { label: 'Mortgage Rate', rate: '1.99% Fixed', sub: 'Guaranteed' },
        { label: 'Savings APY', rate: '8.50% APY', sub: 'US Govt Backed' },
        { label: 'Investment Profit', rate: '+20.0% Profit', sub: '100% Safe' },
        { label: 'Credit Card Limit', rate: '$15,000 Limit', sub: 'Instant Approval' },
      ],
      pillars: [
        {
          title: 'Guaranteed Mortgages',
          description: 'Zero down, zero credit check home loans up to $1.5M.',
          link: '/mortgages',
          tag: 'Guaranteed Approval',
          icon: 'Home',
        },
        {
          title: '8.50% Government APY',
          description: 'Unlimited FDIC guarantee up to $100M with zero risk.',
          link: '/savings',
          tag: 'Risk-Free Cash',
          icon: 'PiggyBank',
        },
        {
          title: 'Instant $15k Credit Cards',
          description: '0% interest for life and 10% unlimited cash back.',
          link: '/credit-cards',
          tag: 'Free Money',
          icon: 'CreditCard',
        },
        {
          title: '20% Guaranteed Wealth',
          description: 'Quantum hedge algorithms that never lose a single dollar.',
          link: '/wealth',
          tag: 'Guaranteed Profit',
          icon: 'TrendingUp',
        },
        {
          title: '9% Commercial Advances',
          description: 'Emergency business cash with no personal liability.',
          link: '/business-loans',
          tag: 'No Personal Guarantee',
          icon: 'Building2',
        },
        {
          title: 'Regulatory Exemptions',
          description: 'Learn why our bank operates without traditional limitations.',
          link: '/disclosures',
          tag: 'Exempt',
          icon: 'ShieldCheck',
        },
      ],
    },
  },

  teaser_trap: {
    id: 'teaser_trap',
    label: 'Teaser Rate & Bait-and-Switch Showcase',
    complianceRating: 'F (High-Risk UDAAP Violation)',
    riskLevel: 'CRITICAL',
    summary: 'Aggressive 0.99% teaser campaigns across all verticals concealing post-introductory payment explosions.',
    flags: [
      {
        category: 'CFPB_UDAAP',
        severity: 'critical',
        title: 'Systemic Teaser Marketing',
        description: 'Showcasing promotional 0.99% introductory rates without disclosing subsequent 10%+ rate adjustments.',
        expectedDisclosure: 'Clear, conspicuous disclosure of teaser duration and fully indexed rate.',
        actualContentSnippet: 'Promotes "0.99% Across Mortgages, Cards, and Business Lines!"',
      },
    ],
    content: {
      campaignHero: {
        badge: '0.99% ALL-PRODUCT TEASER BLOWOUT',
        headline: 'Pay Under 1% Interest on Everything: Mortgages, Cards & Business Lines!',
        subheadline: 'Slash your borrowing expenses instantly with our headline 0.99% introductory rates. Why pay normal bank rates when you can pay 0.99%?',
        primaryCtaText: 'Lock In 0.99% Now',
        primaryCtaLink: '/mortgages',
        secondaryCtaText: '9.00% 30-Day Savings',
        secondaryCtaLink: '/savings',
        featuredRateLabel: 'Universal Teaser Rate',
        featuredRateValue: '0.99% Intro Rate*',
        disclaimer: '*Introductory rate applies to early billing cycles. Terms apply.',
      },
      announcementNotice: 'Teaser Alert: 0.99% rate window closing in 48 hours for new applicants.',
      tickerRates: [
        { label: 'Intro Mortgage', rate: '0.99% Intro', sub: 'First 6 mos' },
        { label: 'Cash Surge APY', rate: '9.00% APY', sub: 'First 30 days' },
        { label: 'Card Intro APR', rate: '0.00% APR', sub: '24 Months' },
        { label: 'Commercial Line', rate: '1.99% Intro', sub: 'First 90 days' },
      ],
      pillars: [
        {
          title: '0.99% Teaser Mortgages',
          description: 'Pay just $499/mo for your initial months.',
          link: '/mortgages',
          tag: 'Teaser Financing',
          icon: 'Home',
        },
        {
          title: '9.00% Flash Savings',
          description: 'Experience ultra-high APY on your initial deposit.',
          link: '/savings',
          tag: 'Intro Yield',
          icon: 'PiggyBank',
        },
        {
          title: '0% 24-Month Cards',
          description: 'Zero finance charges on all initial purchases.',
          link: '/credit-cards',
          tag: 'Intro Credit',
          icon: 'CreditCard',
        },
        {
          title: 'Free Wealth Advisory',
          description: 'Initial 90 days of bespoke portfolio management at $0.',
          link: '/wealth',
          tag: 'Intro Advisory',
          icon: 'TrendingUp',
        },
        {
          title: '1.99% Business Lines',
          description: 'Low-cost working capital for the first 90 days.',
          link: '/business-loans',
          tag: 'Intro Commercial',
          icon: 'Building2',
        },
        {
          title: 'Special Promotion Terms',
          description: 'Important details regarding promotional rate resets.',
          link: '/disclosures',
          tag: 'Terms & Conditions',
          icon: 'ShieldCheck',
        },
      ],
    },
  },
};
