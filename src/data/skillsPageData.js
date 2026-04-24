/** Data for the Skills & Expertise page — grouped sections + core strengths */

export const SKILLS_PAGE_SUBTITLE =
  'Building scalable systems, AI infrastructure, and high-performance backends'

export const CORE_STRENGTHS = [
  {
    id: 'system-design',
    title: 'System Design',
    blurb: 'End-to-end architecture, trade-offs, and reliability under load.',
    iconKey: 'layers',
  },
  {
    id: 'ai-infra',
    title: 'AI Infrastructure',
    blurb: 'LLM integration, RAG, and production-grade data paths.',
    iconKey: 'brain',
  },
  {
    id: 'rust-backend',
    title: 'Rust Backend',
    blurb: 'High-concurrency services with predictable performance.',
    iconKey: 'cpu',
  },
  {
    id: 'distributed',
    title: 'Distributed Systems',
    blurb: 'Fault tolerance, scaling patterns, and operational clarity.',
    iconKey: 'share2',
  },
]

/** iconKey maps to lucide icon in SkillCard */
export const SKILL_SECTIONS = [
  {
    id: 'systems',
    title: 'Systems & Architecture',
    iconKey: 'network',
    items: [
      { name: 'System Design', iconKey: 'layout', level: 92 },
      { name: 'Distributed Systems', iconKey: 'gitBranch', level: 88 },
      { name: 'Microservices', iconKey: 'boxes', level: 86 },
      { name: 'Event-Driven Architecture', iconKey: 'radio', level: 84 },
      { name: 'API Architecture', iconKey: 'webhook', level: 90 },
      { name: 'High-Availability Systems', iconKey: 'shieldCheck', level: 85 },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    iconKey: 'server',
    items: [
      { name: 'Rust (Actix, Tokio)', iconKey: 'rust', level: 91 },
      { name: 'Python (FastAPI, Flask)', iconKey: 'code2', level: 89 },
      { name: 'High-Concurrency Systems', iconKey: 'zap', level: 87 },
      { name: 'Performance Optimization', iconKey: 'gauge', level: 86 },
      { name: 'PostgreSQL', iconKey: 'database', level: 88 },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Data Systems',
    iconKey: 'sparkles',
    items: [
      { name: 'Machine Learning / LLM Integration', iconKey: 'brain', level: 90 },
      { name: 'RAG Systems', iconKey: 'search', level: 88 },
      { name: 'Data Pipelines (ETL)', iconKey: 'workflow', level: 85 },
      { name: 'Vector Databases (pgvector, Qdrant)', iconKey: 'cylinder', level: 84 },
      { name: 'AI Workflow Automation', iconKey: 'bot', level: 83 },
    ],
  },
  {
    id: 'chain',
    title: 'Blockchain & Infrastructure',
    iconKey: 'link',
    items: [
      { name: 'Smart Contracts (Solana, Ethereum)', iconKey: 'hexagon', level: 82 },
      { name: 'Web3 Integrations', iconKey: 'wallet', level: 80 },
      { name: 'CI/CD & Docker', iconKey: 'container', level: 88 },
      { name: 'Cloud (AWS, GCP, Azure)', iconKey: 'cloud', level: 87 },
      { name: 'Observability & Monitoring', iconKey: 'activity', level: 86 },
    ],
  },
]
