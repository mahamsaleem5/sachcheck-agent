SachCheck — AI Agent for Job Scam Verification

Track: Agents for Good
Live App: https://sachcheck-225786514138.asia-southeast1.run.app/
Built for: Kaggle 5-Day AI Agents Intensive Vibe Coding Capstone (with Google)

The Problem

Job scams are a global, growing problem. Fraudulent recruiters post fake job offers to steal money (through "registration fees" or "training fees") or harvest personal data (CNIC/ID numbers, bank details) from job seekers who are often in vulnerable financial situations and eager to start work quickly. Verifying a company's legitimacy manually means checking multiple sources — search engines, review sites, LinkedIn, official registries — a slow process most job seekers skip entirely under time pressure.

The Solution

SachCheck ("sach" means "truth") is an AI agent that automates this verification process. A user submits a company name and the text of a job offer or recruiter message. The agent researches the company online and analyzes the message for known scam patterns, then returns a single, clear verdict — Likely Legit, Suspicious, or Likely Scam — along with the specific reasoning behind it and a recommended next step.

Why Agents (Not Just a Search Tool)

A simple search engine returns raw links and leaves interpretation to the user — exactly the burden this product is meant to remove. SachCheck instead uses two coordinating agent roles that reason over the evidence and combine it into a single decision:


Research Agent — actively searches the web for the company (official site, reviews, complaints, LinkedIn presence, registration signals) and summarizes what it finds — including treating a total absence of any online footprint as a meaningful red flag in itself, since legitimate employers almost always leave some digital trace.
Risk Analyst Agent — independently analyzes the offer text itself for scam patterns (upfront fee requests, urgency pressure, generic email domains, vague job descriptions, premature requests for personal documents).


The two findings are merged into one verdict with a confidence level, so the user gets a decision, not just data.

Architecture

User Input (Company Name + Offer Text)
        │
        ▼
 ┌─────────────────────┐
 │   Research Agent     │──▶ Web Search Tool ──▶ Company presence,
 │  (company lookup)    │                        reviews, registration
 └─────────────────────┘                        signals
        │
        ▼
 ┌─────────────────────┐
 │  Risk Analyst Agent  │──▶ Red-flag pattern analysis on offer text
 │ (message analysis)   │
 └─────────────────────┘
        │
        ▼
 ┌─────────────────────┐
 │   Verdict Engine      │──▶ Combines both findings into:
 │                       │     Verdict + Confidence + Reasons + Advice
 └─────────────────────┘
        │
        ▼
 ┌─────────────────────┐
 │   Memory Store        │──▶ Saves company + verdict + date
 │ (Previously Checked)  │     Instantly returns past verdicts on repeat lookups
 └─────────────────────┘

Key Concepts Demonstrated

ConceptImplementationMulti-agent systemResearch Agent and Risk Analyst Agent operate as distinct reasoning steps with separate responsibilities, coordinated into one verdictTool use / MCP-style searchThe agent calls a live web search tool to gather real-time evidence rather than relying on the model's static training dataMemory (context engineering)Verdicts are persisted so repeat company lookups are instant, and the system builds a growing trust database over timeSecurityNo API keys are hardcoded in the codebase — GEMINI_API_KEY is loaded from environment variables (.env.local, excluded via .gitignore); see .env.example for the required variable name onlyDeployabilityDeployed via Google AI Studio's one-click Cloud Run integration, producing a public, login-free URL

Tech Stack


Frontend: React + TypeScript (Vite)
Backend: Node/TypeScript server (server.ts) handling agent orchestration
Model: Gemini (via Google AI Studio)
Search: Live web search tool integration
Deployment: Google Cloud Run (one-click deploy from AI Studio)


Project Structure

├── App.tsx                # Root application component
├── CheckForm.tsx           # Company name + offer text input form
├── Header.tsx               # App header/branding
├── HistoryList.tsx          # "Previously Checked Companies" list (memory UI)
├── VerdictReportCard.tsx    # Renders the verdict, confidence, and reasoning
├── server.ts                 # Backend agent orchestration logic
├── types.ts                  # Shared TypeScript types
├── .env.example               # Documents required environment variable (no real key)
└── package.json

Running Locally

Prerequisites: Node.js installed

bash# 1. Install dependencies
npm install

# 2. Create a .env.local file and add your own Gemini API key
GEMINI_API_KEY=your_key_here

# 3. Run the app
npm run dev

Deployment

This app is deployed using Google AI Studio's built-in one-click Cloud Run deployment. The Gemini API key is securely injected server-side as a Cloud Run environment secret — it is never exposed in client-side code or committed to this repository.

To reproduce the deployment:


Import this repo into Google AI Studio (Build mode), or recreate the app using the project structure above
Configure the GEMINI_API_KEY secret
Use AI Studio's "Deploy to Cloud Run" option for a one-click public deployment


Example Use Case

Input:


Company: "XYZ Global Solutions"
Offer text: "Congratulations! You've been selected. Pay a $50 refundable registration fee within 2 hours to confirm your seat. Contact us on WhatsApp only."


Output:


🚩 Likely Scam — High Confidence


No verifiable presence found for "XYZ Global Solutions" — no official website, no LinkedIn, no registration record found.
Offer requests an upfront "refundable registration fee" — a classic scam tactic.
Urgency pressure ("within 2 hours") is a common manipulation technique.
Contact is WhatsApp-only, with no verifiable company email.
Recommendation: Do not send any payment or personal documents. Independently verify the company before proceeding.




Evaluation

The agent was tested against a manually curated set of known-legitimate companies and known scam-pattern messages to validate verdict accuracy and reasoning quality across a range of evidence scenarios (strong online presence, weak presence, and zero online presence).

Future Improvements


Expand registry-checking to integrate directly with official company registration APIs by country
Add a browser extension for one-click checking from job posting sites
Support multi-language offer text analysis
Crowd-sourced reporting to flag confirmed scams back into the memory store



Built for the Kaggle 5-Day AI Agents Intensive Vibe Coding Course with Google — Agents for Good track.
