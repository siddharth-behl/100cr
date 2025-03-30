export interface Mission {
  id: string;
  description: string;
  details?: string;
  isCompleted: boolean;
  isOptional: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  details?: string;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  timeframe: string;
  mission: string;
  goal: string;
  bonus?: string;
  punishment?: string;
  missions: Mission[];
  skills: Skill[];
  completionMessage: string;
}

// Game levels data
export const levelsData: Level[] = [
  {
    id: 1,
    name: "ROOKIE MODE",
    description: "Build cash flow with a High-Ticket Client Acquisition Agency.",
    timeframe: "0-3 Months",
    mission: "Build cash flow with a High-Ticket Client Acquisition Agency.",
    goal: "Close your first ₹1L+ client.",
    punishment: "No entertainment, no outings until the first deal is closed.",
    missions: [
      {
        id: "rookie_mission_1",
        description: "Complete Meta Ads Course (20 hrs + 27 hrs)",
        details: "Learn how to run profitable ads for clients",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "rookie_mission_2",
        description: "Cold DM & email 100+ businesses daily",
        details: "Start offering free trials to build portfolio",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "rookie_mission_3",
        description: "Book at least 5 sales calls per week",
        details: "Watch real cold call breakdowns to improve pitch",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "rookie_mission_4",
        description: "Close your first paying client (₹1L+ deal)",
        details: "This is your gateway to the next level",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "rookie_mission_5",
        description: "Build a basic landing page for your agency",
        details: "Use templates to start quickly",
        isCompleted: false,
        isOptional: true
      }
    ],
    skills: [
      {
        id: "meta_ads",
        name: "Meta Ads",
        description: "Master running profitable ads on Meta platforms",
        details: "Complete all modules in the Meta Ads courses and implement on test accounts"
      },
      {
        id: "sales_outreach",
        name: "Sales & Outreach",
        description: "Master cold DMs, emails, and calls to book meetings",
        details: "Practice with real businesses and refine your approach based on feedback"
      },
      {
        id: "copywriting",
        name: "Copywriting",
        description: "Learn direct response copywriting for ads, landing pages, emails",
        details: "Study top performing ads and practice writing compelling copy daily"
      },
      {
        id: "funnels_landing_pages",
        name: "Basic Funnels & Landing Pages",
        description: "Create high-converting pages to turn visitors into leads",
        details: "Build at least 3 different landing pages and test their performance"
      }
    ],
    completionMessage: "Established your first successful agency and secured a ₹1L+ client"
  },
  {
    id: 2,
    name: "WARRIOR MODE",
    description: "Scale to ₹5L-₹10L/month with 5-10 clients and hire your first employee.",
    timeframe: "3-6 Months",
    mission: "Scale to ₹5L-₹10L/month with 5-10 clients.",
    goal: "Hire your first employee (ad buyer or sales rep).",
    bonus: "Buy something BIG for yourself after ₹10L+ profit.",
    missions: [
      {
        id: "warrior_mission_1",
        description: "Sign 5+ paying clients (₹1L-₹3L per client)",
        details: "Focus on consistent results for existing clients to get referrals",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "warrior_mission_2",
        description: "Cold call & email 500+ businesses per week",
        details: "Scale your outreach with templates and systems",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "warrior_mission_3",
        description: "Outsource ad management to a freelancer or VA",
        details: "Find reliable talent to delegate routine tasks",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "warrior_mission_4",
        description: "Hit ₹5L+/month revenue",
        details: "Track your finances and reinvest profits strategically",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "warrior_mission_5",
        description: "Create a case study from your best-performing client",
        details: "Document the results to use in sales pitches",
        isCompleted: false,
        isOptional: true
      }
    ],
    skills: [
      {
        id: "advanced_sales",
        name: "Advanced Sales & Negotiation",
        description: "Start closing ₹1L+ retainers consistently",
        details: "Master objection handling and pricing psychology to increase your close rate"
      },
      {
        id: "lead_generation",
        name: "Lead Generation Systems",
        description: "Automate outreach using VAs & tools",
        details: "Build systems that can generate 20+ qualified leads per day without your direct involvement"
      },
      {
        id: "business_operations",
        name: "Business Operations",
        description: "Learn how to manage projects & deliver client work efficiently",
        details: "Create SOPs for all recurring processes in your business"
      },
      {
        id: "outsourcing_hiring",
        name: "Outsourcing & Hiring",
        description: "Delegate ad buying & sales tasks to free up time",
        details: "Develop interview protocols and training materials for new team members"
      }
    ],
    completionMessage: "Scaled your agency to ₹5L+/month with a growing team"
  },
  {
    id: 3,
    name: "TYCOON MODE",
    description: "Automate agency & acquire first ecom brand to scale to ₹2Cr+ revenue.",
    timeframe: "6-12 Months",
    mission: "Automate agency & acquire first ecom brand.",
    goal: "Buy a distressed ecom store & scale it to ₹2Cr+ revenue.",
    bonus: "Start equity-based deals (own % of businesses instead of just charging fees).",
    missions: [
      {
        id: "tycoon_mission_1",
        description: "Scale agency to ₹10L-₹20L/month (semi-automated)",
        details: "Optimize systems for client acquisition and delivery",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "tycoon_mission_2",
        description: "Build a team to manage operations",
        details: "Hire sales reps, closers, and ad buyers to run day-to-day operations",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "tycoon_mission_3",
        description: "Find an ecom store doing ₹2Cr-₹10Cr/year but struggling",
        details: "Look for businesses with good products but poor marketing",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "tycoon_mission_4",
        description: "Offer a performance-based acquisition deal",
        details: "Structure a deal where you pay only from increased profits",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "tycoon_mission_5",
        description: "Scale the acquired ecom brand to ₹2Cr+ revenue",
        details: "Apply your marketing expertise to grow the brand",
        isCompleted: false,
        isOptional: false
      }
    ],
    skills: [
      {
        id: "ecommerce_growth",
        name: "Ecommerce Growth Strategies",
        description: "Scaling brands using ads, CRO & retention",
        details: "Master customer acquisition costs, lifetime value, and inventory management for ecommerce"
      },
      {
        id: "equity_negotiation",
        name: "Equity Negotiation",
        description: "Learn how to acquire businesses for a % of revenue",
        details: "Understand valuation methods and risk mitigation in deal structures"
      },
      {
        id: "influencer_ugc",
        name: "Influencer & UGC Marketing",
        description: "Scale brands with influencer-generated content",
        details: "Build relationships with influencers and create campaigns that drive ROI"
      },
      {
        id: "m_and_a",
        name: "Mergers & Acquisitions (M&A)",
        description: "Learn how to buy & flip businesses",
        details: "Understand due diligence, deal structuring, and business integration"
      }
    ],
    completionMessage: "Automated your agency and successfully acquired your first ecommerce brand"
  },
  {
    id: 4,
    name: "MOGUL MODE",
    description: "Buy, scale & flip multiple ecom brands for 3-5X profit and cross ₹10Cr+ net worth.",
    timeframe: "2-3 Years",
    mission: "Buy, scale & flip multiple ecom brands for 3-5X profit.",
    goal: "Cross ₹10Cr+ net worth.",
    bonus: "First luxury investment (car, real estate, or dream purchase).",
    missions: [
      {
        id: "mogul_mission_1",
        description: "Flip at least 2-3 ecom brands for 3-5X return",
        details: "Acquire underperforming brands, improve operations, and sell at a profit",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "mogul_mission_2",
        description: "Hit ₹10Cr+ net worth",
        details: "Combine business assets, investments, and cash reserves",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "mogul_mission_3",
        description: "Build a portfolio of 3-5 ecom brands worth ₹10Cr+ each",
        details: "Create a diversified portfolio across different product categories",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "mogul_mission_4",
        description: "Start acquiring service-based businesses",
        details: "Expand your portfolio beyond ecommerce into agencies, SaaS, etc.",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "mogul_mission_5",
        description: "Make your first luxury investment",
        details: "Reward yourself with a car, property, or other significant purchase",
        isCompleted: false,
        isOptional: true
      }
    ],
    skills: [
      {
        id: "brand_scaling",
        name: "Brand Scaling & Exit Strategy",
        description: "Learn how to sell businesses for max valuation",
        details: "Understand how to position brands for acquisition and negotiate with potential buyers"
      },
      {
        id: "business_turnaround",
        name: "Business Turnaround",
        description: "Fix struggling businesses & make them profitable",
        details: "Identify operational inefficiencies and implement systems for sustainable growth"
      },
      {
        id: "fundraising",
        name: "Fundraising & Capital Raising",
        description: "Get investors to scale faster",
        details: "Create pitch decks, financial projections, and investment memorandums"
      },
      {
        id: "team_leadership",
        name: "Team Leadership",
        description: "Build & manage C-suite executives",
        details: "Develop leadership skills to manage CEOs, CFOs, and CMOs running your businesses"
      }
    ],
    completionMessage: "Grown multiple successful businesses and achieved ₹10Cr+ net worth"
  },
  {
    id: 5,
    name: "BILLIONAIRE MODE",
    description: "Launch an acquisition fund & dominate industries to own 10+ brands and print ₹100Cr+.",
    timeframe: "4-5 Years",
    mission: "Launch an acquisition fund & dominate industries.",
    goal: "Own 10+ brands, print ₹100Cr+, and exit with massive wealth.",
    bonus: "Your name in Forbes, billionaire status unlocked.",
    missions: [
      {
        id: "billionaire_mission_1",
        description: "Stop day-to-day operations & build a CEO-led team",
        details: "Hire experienced executives to manage your portfolio",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "billionaire_mission_2",
        description: "Use profits from ecom brands to acquire service-based businesses",
        details: "Reinvest your profits in high-margin service businesses",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "billionaire_mission_3",
        description: "Launch a ₹100Cr+ acquisition fund",
        details: "Raise capital from investors to scale your acquisition strategy",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "billionaire_mission_4",
        description: "Buy struggling service & ecom businesses in bulk & scale them",
        details: "Apply your proven systems across multiple acquisitions",
        isCompleted: false,
        isOptional: false
      },
      {
        id: "billionaire_mission_5",
        description: "Exit with ₹100Cr+ and achieve billionaire status",
        details: "Sell your portfolio for a massive payday",
        isCompleted: false,
        isOptional: false
      }
    ],
    skills: [
      {
        id: "private_equity",
        name: "Private Equity & Business Valuation",
        description: "Learn how to buy, hold & exit BIG",
        details: "Understand complex valuation methods, leveraged buyouts, and exit strategies"
      },
      {
        id: "raising_fund",
        name: "Raising ₹100Cr+ Fund",
        description: "Get institutional & private investors",
        details: "Create fund structure, investment thesis, and returns model to attract capital"
      },
      {
        id: "scaling_beyond",
        name: "Scaling Businesses Beyond ₹100Cr Revenue",
        description: "Build a high-growth machine",
        details: "Master the challenges of hypergrowth including capital allocation and market expansion"
      },
      {
        id: "c_level_management",
        name: "Hiring & Managing C-Level Executives",
        description: "Build an empire with CEOs running businesses for you",
        details: "Develop systems for recruiting, compensating, and managing high-level executives"
      }
    ],
    completionMessage: "Built a massive business empire and achieved ₹100Cr+ wealth"
  }
];
