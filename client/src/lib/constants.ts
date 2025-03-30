import { Level, Mission, Skill } from "../types/game";

// Game Levels
export const GAME_LEVELS: Level[] = [
  {
    id: 1,
    name: "Rookie Mode",
    description: "Build cash flow with a High-Ticket Client Acquisition Agency.",
    timeframe: "0-3 Months",
    goal: "Close your first ₹1L+ client.",
    missions: [
      {
        id: "rookie_mission_1",
        name: "Learn Meta Ads",
        description: "Complete Meta Ads Course (20 hrs + 27 hrs)",
        reward: 1000,
        isCompleted: false,
        progress: 0,
        requirements: ["Watch & implement Meta Ads courses (complete all modules)"],
        levelId: 1
      },
      {
        id: "rookie_mission_2",
        name: "Master Cold Outreach",
        description: "Cold DM & email 100+ businesses daily",
        reward: 2000,
        isCompleted: false,
        progress: 0,
        requirements: ["Start offering free trials", "Track responses"],
        levelId: 1
      },
      {
        id: "rookie_mission_3",
        name: "Book Sales Calls",
        description: "Book at least 5 sales calls per week",
        reward: 3000,
        isCompleted: false,
        progress: 0,
        requirements: ["Watch real cold call breakdowns", "Practice sales scripts"],
        levelId: 1
      },
      {
        id: "rookie_mission_4",
        name: "Close First Client",
        description: "Close your first paying client (₹1L+ deal)",
        reward: 10000,
        isCompleted: false,
        progress: 0,
        requirements: ["Have a compelling offer", "Demonstrate value"],
        levelId: 1
      }
    ],
    skills: [
      {
        id: "skill_meta_ads",
        name: "Meta Ads",
        description: "Master running profitable Facebook & Instagram ads",
        isUnlocked: false,
        icon: "target",
        requiredSkills: [],
        levelId: 1
      },
      {
        id: "skill_outreach",
        name: "Sales & Outreach",
        description: "Cold DMs, emails, and calls to book meetings",
        isUnlocked: false,
        icon: "message-square",
        requiredSkills: [],
        levelId: 1
      },
      {
        id: "skill_copywriting",
        name: "Copywriting",
        description: "Direct response copywriting (ads, landing pages, emails)",
        isUnlocked: false,
        icon: "pen-tool",
        requiredSkills: [],
        levelId: 1
      },
      {
        id: "skill_funnels",
        name: "Basic Funnels",
        description: "Create high-converting landing pages & funnels",
        isUnlocked: false,
        icon: "filter",
        requiredSkills: [],
        levelId: 1
      }
    ],
    unlockRequirements: [
      "Watch & implement Meta Ads courses (complete all modules)",
      "Cold DM & email 100+ businesses daily (start offering free trials)",
      "Book at least 5 sales calls per week (watch real cold call breakdowns)",
      "Close your first paying client (₹1L+ deal)"
    ],
    rewards: ["Access to LEVEL 2 (Warrior Mode) after closing first ₹1L+ deal"],
    isUnlocked: true,
    isCompleted: false
  },
  {
    id: 2,
    name: "Warrior Mode",
    description: "Scale to ₹5L-₹10L/month with 5-10 clients.",
    timeframe: "3-6 Months",
    goal: "Hire your first employee (ad buyer or sales rep).",
    missions: [
      {
        id: "warrior_mission_1",
        name: "Sign Multiple Clients",
        description: "Sign 5+ paying clients (₹1L-₹3L per client)",
        reward: 15000,
        isCompleted: false,
        progress: 0,
        requirements: ["Create a compelling offer", "Refine your pitch"],
        levelId: 2
      },
      {
        id: "warrior_mission_2",
        name: "Scale Outreach",
        description: "Cold call & email 500+ businesses per week",
        reward: 5000,
        isCompleted: false,
        progress: 0,
        requirements: ["Use automation tools", "Create templates"],
        levelId: 2
      },
      {
        id: "warrior_mission_3",
        name: "Outsource Work",
        description: "Outsource ad management to a freelancer or VA",
        reward: 10000,
        isCompleted: false,
        progress: 0,
        requirements: ["Create SOPs", "Train your first hire"],
        levelId: 2
      },
      {
        id: "warrior_mission_4",
        name: "Hit Revenue Target",
        description: "Hit ₹5L+/month revenue",
        reward: 50000,
        isCompleted: false,
        progress: 0,
        requirements: ["Consistent client acquisition", "Reduce churn rate"],
        levelId: 2
      }
    ],
    skills: [
      {
        id: "skill_advanced_sales",
        name: "Advanced Sales",
        description: "Close ₹1L+ retainers and negotiate better deals",
        isUnlocked: false,
        icon: "trending-up",
        requiredSkills: ["skill_outreach"],
        levelId: 2
      },
      {
        id: "skill_lead_gen_systems",
        name: "Lead Generation Systems",
        description: "Automate outreach using VAs & tools",
        isUnlocked: false,
        icon: "users",
        requiredSkills: ["skill_outreach"],
        levelId: 2
      },
      {
        id: "skill_business_ops",
        name: "Business Operations",
        description: "Manage projects & improve business processes",
        isUnlocked: false,
        icon: "settings",
        requiredSkills: [],
        levelId: 2
      },
      {
        id: "skill_hiring",
        name: "Outsourcing & Hiring",
        description: "Delegate tasks & build a team",
        isUnlocked: false,
        icon: "user-plus",
        requiredSkills: ["skill_business_ops"],
        levelId: 2
      }
    ],
    unlockRequirements: [
      "Sign 5+ paying clients (₹1L-₹3L per client)",
      "Cold call & email 500+ businesses per week (no shortcuts)",
      "Outsource ad management to a freelancer or VA",
      "Hit ₹5L+/month revenue"
    ],
    rewards: ["Access to LEVEL 3 (Tycoon Mode) after hitting ₹10L+ in total profit"],
    isUnlocked: false,
    isCompleted: false
  },
  {
    id: 3,
    name: "Tycoon Mode",
    description: "Automate agency & acquire first ecom brand.",
    timeframe: "6-12 Months",
    goal: "Buy a distressed ecom store & scale it to ₹2Cr+ revenue.",
    missions: [
      {
        id: "tycoon_mission_1",
        name: "Scale Agency",
        description: "Scale agency to ₹10L-₹20L/month (semi-automated)",
        reward: 100000,
        isCompleted: false,
        progress: 0,
        requirements: ["Systematize processes", "Improve profit margins"],
        levelId: 3
      },
      {
        id: "tycoon_mission_2",
        name: "Build Team",
        description: "Build a team to manage operations",
        reward: 50000,
        isCompleted: false,
        progress: 0,
        requirements: ["Hire sales reps, closers, ad buyers", "Create training systems"],
        levelId: 3
      },
      {
        id: "tycoon_mission_3",
        name: "Find Ecom Store",
        description: "Find an ecom store doing ₹2Cr-₹10Cr/year but struggling",
        reward: 200000,
        isCompleted: false,
        progress: 0,
        requirements: ["Research potential acquisitions", "Analyze financial statements"],
        levelId: 3
      },
      {
        id: "tycoon_mission_4",
        name: "Acquire Store",
        description: "Offer a performance-based acquisition deal",
        reward: 500000,
        isCompleted: false,
        progress: 0,
        requirements: ["Negotiate favorable terms", "Pay only from profits"],
        levelId: 3
      }
    ],
    skills: [
      {
        id: "skill_ecom_growth",
        name: "Ecommerce Growth",
        description: "Scale brands using ads, CRO & retention strategies",
        isUnlocked: false,
        icon: "shopping-bag",
        requiredSkills: ["skill_meta_ads", "skill_advanced_sales"],
        levelId: 3
      },
      {
        id: "skill_equity_negotiation",
        name: "Equity Negotiation",
        description: "Acquire businesses for a % of revenue",
        isUnlocked: false,
        icon: "percent",
        requiredSkills: ["skill_advanced_sales"],
        levelId: 3
      },
      {
        id: "skill_influencer_marketing",
        name: "Influencer Marketing",
        description: "Scale brands with influencer-generated content",
        isUnlocked: false,
        icon: "instagram",
        requiredSkills: ["skill_copywriting"],
        levelId: 3
      },
      {
        id: "skill_m_and_a",
        name: "M&A Basics",
        description: "Learn how to buy & flip businesses",
        isUnlocked: false,
        icon: "repeat",
        requiredSkills: ["skill_equity_negotiation"],
        levelId: 3
      }
    ],
    unlockRequirements: [
      "Scale agency to ₹10L-₹20L/month (semi-automated)",
      "Build a team to manage operations (hire sales reps, closers, ad buyers)",
      "Find an ecom store doing ₹2Cr-₹10Cr/year but struggling",
      "Offer a performance-based acquisition deal (pay only from profits)"
    ],
    rewards: ["Access to LEVEL 4 (Mogul Mode) after scaling an ecom brand to ₹2Cr+ revenue"],
    isUnlocked: false,
    isCompleted: false
  },
  {
    id: 4,
    name: "Mogul Mode",
    description: "Buy, scale & flip multiple ecom brands for 3-5X profit.",
    timeframe: "2-3 Years",
    goal: "Cross ₹10Cr+ net worth.",
    missions: [
      {
        id: "mogul_mission_1",
        name: "Flip Multiple Brands",
        description: "Flip at least 2-3 ecom brands for 3-5X return",
        reward: 1000000,
        isCompleted: false,
        progress: 0,
        requirements: ["Improve operations", "Increase profitability"],
        levelId: 4
      },
      {
        id: "mogul_mission_2",
        name: "Build Net Worth",
        description: "Hit ₹10Cr+ net worth",
        reward: 2000000,
        isCompleted: false,
        progress: 0,
        requirements: ["Smart investments", "Multiple income streams"],
        levelId: 4
      },
      {
        id: "mogul_mission_3",
        name: "Build Brand Portfolio",
        description: "Build a portfolio of 3-5 ecom brands worth ₹10Cr+ each",
        reward: 5000000,
        isCompleted: false,
        progress: 0,
        requirements: ["Diverse product categories", "Strong market positions"],
        levelId: 4
      },
      {
        id: "mogul_mission_4",
        name: "Expand to Services",
        description: "Start acquiring service-based businesses",
        reward: 10000000,
        isCompleted: false,
        progress: 0,
        requirements: ["Identify high-margin services", "Leverage existing expertise"],
        levelId: 4
      }
    ],
    skills: [
      {
        id: "skill_brand_scaling",
        name: "Brand Scaling & Exit",
        description: "Sell businesses for maximum valuation",
        isUnlocked: false,
        icon: "trending-up",
        requiredSkills: ["skill_m_and_a", "skill_ecom_growth"],
        levelId: 4
      },
      {
        id: "skill_turnaround",
        name: "Business Turnaround",
        description: "Fix struggling businesses & make them profitable",
        isUnlocked: false,
        icon: "refresh-cw",
        requiredSkills: ["skill_business_ops"],
        levelId: 4
      },
      {
        id: "skill_fundraising",
        name: "Fundraising",
        description: "Get investors to scale faster",
        isUnlocked: false,
        icon: "dollar-sign",
        requiredSkills: ["skill_equity_negotiation"],
        levelId: 4
      },
      {
        id: "skill_leadership",
        name: "Team Leadership",
        description: "Build & manage C-suite executives",
        isUnlocked: false,
        icon: "users",
        requiredSkills: ["skill_hiring"],
        levelId: 4
      }
    ],
    unlockRequirements: [
      "Flip at least 2-3 ecom brands for 3-5X return",
      "Hit ₹10Cr+ net worth",
      "Build a portfolio of 3-5 ecom brands worth ₹10Cr+ each",
      "Start acquiring service-based businesses (agencies, SaaS, etc.)"
    ],
    rewards: ["Access to LEVEL 5 (Billionaire Mode) after flipping 3+ businesses successfully"],
    isUnlocked: false,
    isCompleted: false
  },
  {
    id: 5,
    name: "Billionaire Mode",
    description: "Launch an acquisition fund & dominate industries.",
    timeframe: "4-5 Years",
    goal: "Own 10+ brands, print ₹100Cr+, and exit with massive wealth.",
    missions: [
      {
        id: "billionaire_mission_1",
        name: "Build Executive Team",
        description: "Stop day-to-day operations & build a CEO-led team",
        reward: 20000000,
        isCompleted: false,
        progress: 0,
        requirements: ["Hire top executives", "Create organizational structure"],
        levelId: 5
      },
      {
        id: "billionaire_mission_2",
        name: "Expand Acquisitions",
        description: "Use profits from ecom brands to acquire service-based businesses",
        reward: 50000000,
        isCompleted: false,
        progress: 0,
        requirements: ["Diversify portfolio", "Create synergies"],
        levelId: 5
      },
      {
        id: "billionaire_mission_3",
        name: "Launch Fund",
        description: "Launch a ₹100Cr+ acquisition fund",
        reward: 100000000,
        isCompleted: false,
        progress: 0,
        requirements: ["Secure investor commitments", "Create fund structure"],
        levelId: 5
      },
      {
        id: "billionaire_mission_4",
        name: "Scale Empire",
        description: "Buy struggling service & ecom businesses in bulk & scale them",
        reward: 1000000000,
        isCompleted: false,
        progress: 0,
        requirements: ["Implement proven systems", "Create economies of scale"],
        levelId: 5
      }
    ],
    skills: [
      {
        id: "skill_pe",
        name: "Private Equity",
        description: "Buy, hold & exit BIG businesses",
        isUnlocked: false,
        icon: "briefcase",
        requiredSkills: ["skill_m_and_a", "skill_fundraising"],
        levelId: 5
      },
      {
        id: "skill_fund_raise",
        name: "Raising ₹100Cr+ Fund",
        description: "Get institutional & private investors",
        isUnlocked: false,
        icon: "bar-chart-2",
        requiredSkills: ["skill_fundraising"],
        levelId: 5
      },
      {
        id: "skill_empire_scaling",
        name: "Business Empire Scaling",
        description: "Scale businesses beyond ₹100Cr Revenue",
        isUnlocked: false,
        icon: "globe",
        requiredSkills: ["skill_brand_scaling", "skill_turnaround"],
        levelId: 5
      },
      {
        id: "skill_c_suite",
        name: "C-Level Management",
        description: "Build an empire with CEOs running businesses for you",
        isUnlocked: false,
        icon: "award",
        requiredSkills: ["skill_leadership"],
        levelId: 5
      }
    ],
    unlockRequirements: [
      "Stop day-to-day operations & build a CEO-led team",
      "Use profits from ecom brands to acquire service-based businesses",
      "Launch a ₹100Cr+ acquisition fund (like Cardone Ventures)",
      "Buy struggling service & ecom businesses in bulk & scale them"
    ],
    rewards: ["Forbes recognition", "Billionaire status unlocked", "Financial freedom"],
    isUnlocked: false,
    isCompleted: false
  }
];

// Initial user progress
export const INITIAL_USER_PROGRESS = {
  currentLevel: 1 as const,
  money: 0,
  experience: 0,
  completedMissions: [],
  unlockedSkills: [],
  lastSaved: new Date().toISOString()
};

// XP required for each level
export const LEVEL_XP_REQUIREMENTS = {
  1: 1000,
  2: 5000,
  3: 20000,
  4: 100000,
  5: 500000
};

// Money required to unlock each level
export const LEVEL_MONEY_REQUIREMENTS = {
  1: 0,
  2: 100000,  // ₹1L
  3: 1000000, // ₹10L
  4: 20000000, // ₹2Cr
  5: 100000000 // ₹10Cr
};

// Achievement definitions
export const ACHIEVEMENTS = [
  {
    id: "achievement_first_mission",
    name: "First Steps",
    description: "Complete your first mission",
    isUnlocked: false,
    icon: "award",
    reward: 1000
  },
  {
    id: "achievement_first_skill",
    name: "Skill Unlocked",
    description: "Unlock your first skill",
    isUnlocked: false,
    icon: "key",
    reward: 2000
  },
  {
    id: "achievement_level_up",
    name: "Level Up",
    description: "Advance to the next level",
    isUnlocked: false,
    icon: "arrow-up",
    reward: 5000
  },
  {
    id: "achievement_first_lakh",
    name: "Lakhpati",
    description: "Earn your first ₹1L",
    isUnlocked: false,
    icon: "dollar-sign",
    reward: 10000
  },
  {
    id: "achievement_first_crore",
    name: "Crorepati",
    description: "Reach ₹1Cr net worth",
    isUnlocked: false,
    icon: "diamond",
    reward: 100000
  }
];
