# Apex Horizon Bank & Trust — Banking Compliance Testing Marketing Site

A modern, institutional-grade commercial and consumer banking marketing portal built specifically to test and validate automated compliance auditing platforms (such as **Nucomply**).

The site features dynamic content generation across multiple banking verticals, presenting different promotional claims, interest rates, APR calculations, and disclosure compliance levels on each visit.

---

## 🎯 Purpose & AI Crawler Integration

When testing an automated AI compliance auditor:
1. **Dynamic on Every Visit:** Each page visit dynamically rotates marketing copy, promotional claims, interest rates, and compliance postures unless pinned.
2. **Benchmark Ground-Truth Drawer:** A built-in "Nucomply AI Sandbox" toolbar at the top displays the active visit token, visit counter, active regulatory scenario, and an expandable **AI Benchmark Ground Truth** drawer listing exact statutory violations that the AI is expected to catch.
3. **Deep-Link Targeting for AI Crawlers:** Append `?variant=<scenario_id>` to any page URL to force a specific compliance state:
   - `?variant=compliant`: Fully compliant disclosure (TILA, CARD Act, Reg DD, FINRA).
   - `?variant=minor_omissions`: Subtle non-compliance (missing adjacent APR, buried footnotes, omitted balance transfer fees).
   - `?variant=high_risk_udaap`: Critical UDAAP violations ("100% Guaranteed Approval", "Free Money", infinite FDIC claims, deceptive factor rates).
   - `?variant=teaser_trap`: Aggressive bait-and-switch teaser promotions with hidden rate shock escalations.

---

## 🏦 Banking Verticals & Compliance Concerns Covered

| Vertical | Page Route | Primary Regulatory Frameworks | Key Compliance Concerns Tested |
| :--- | :--- | :--- | :--- |
| **Overview & Home** | `#/` | FTC Act / CFPB UDAAP | Universal rate claims, cross-product guarantees, institutional brand transparency. |
| **Residential Mortgages** | `#/mortgages` | Truth in Lending Act (TILA / 12 CFR Part 1026 - Reg Z) | Trigger terms (monthly payment / down payment) requiring APR disclosure, Equal Housing Lender badge, closing cost representations. |
| **Consumer Credit Cards** | `#/credit-cards` | Credit CARD Act of 2009 (12 CFR § 1026.60) | Standardized tabular Schumer Box, 0% intro period duration, post-intro variable APR, penalty APR triggers, balance transfer fees. |
| **Savings & Deposits** | `#/savings` | Truth in Savings Act (TISA / 12 CFR Part 1030 - Reg DD) & FDIC (12 CFR Part 328) | APY designation (Annual Percentage Yield) vs simple rate, $250k statutory FDIC limits, "fees could reduce earnings" warnings. |
| **Wealth Management** | `#/wealth` | FINRA Rule 2210 & SEC Investment Advisers Act | Prohibition of guaranteed profits, mandatory "Not FDIC Insured • May Lose Value" disclosure, "past performance is no guarantee" caveats. |
| **Commercial Credit** | `#/business-loans` | CA SB 1235, NY Commercial Finance Disclosure Law & ECOA | Disclosing effective APR alongside Factor Rates (e.g. 1.15 factor rate vs 45%+ APR), personal guarantee transparency. |
| **Regulatory Archive** | `#/disclosures` | CRA & Statutory Transparency | Community Reinvestment Act (CRA) notice, public fee schedule availability, regulatory charter status. |

---

## 🚀 GitHub Pages Deployment

The application is pre-configured for GitHub Pages:
- **Routing:** Uses `HashRouter` (`#/mortgages`, `#/credit-cards`, etc.), ensuring zero 404 errors on direct navigation or page refresh.
- **Base Path:** Configured with `base: './'` in [`vite.config.ts`](file:///d:/Development/Nucomply/Test_site_one/vite.config.ts) for instant compatibility with any GitHub repository name.
- **SPA Fallback:** Includes [`public/404.html`](file:///d:/Development/Nucomply/Test_site_one/public/404.html) to automatically route legacy paths to the hash router.
- **Automated CI/CD:** Includes [`.github/workflows/deploy.yml`](file:///d:/Development/Nucomply/Test_site_one/.github/workflows/deploy.yml). Simply push to `main` or `master` to automatically build and deploy.

### To Deploy Manually:
```bash
git add .
git commit -m "Initial commit of compliance marketing site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```
In your GitHub Repository Settings:
1. Navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push to `main` and your site will be live!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle for static hosting
npm run build
```
