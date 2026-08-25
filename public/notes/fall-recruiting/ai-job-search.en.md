---
title: Using AI to Support Role Discovery
slug: ai-job-search.md
order: 7
tags: [AI, vibe coding, role search]
---
# AI-Assisted Job Search

This guide helps you use natural language (conversing with AI) to build a personalized tool for tracking and managing job applications. Before you begin, consider if this approach is right for you: a tool should simplify your job search, not complicate it with another time-consuming project.

## Decide if Building It Yourself Is Worthwhile

Building a custom tool is most valuable when it genuinely solves a problem, rather than adding to your workload.

**It might be a good idea to build it yourself if:**

*   **Information is scattered:** You're tracking various job titles or industries, and existing platform filters often miss relevant positions. Your job information is spread across multiple bookmarks, screenshots, and spreadsheets, making it increasingly hard to search and compare.
*   **You need deep comparison:** You frequently compare job descriptions (JDs), deadlines, and preparation requirements across different roles, and you want to record your thoughts and progress.
*   **Existing tools fall short:** You're already using spreadsheets or simple note-taking apps, but they lack the flexibility for effective filtering, sorting, or status tracking.
*   **You're willing to test:** You're prepared to spend a little time testing the tool's usability and accept that the first version might be simple, with improvements added gradually.
*   **It offers project value:** The small tool itself can serve as a demonstration of your problem-solving and rapid prototyping skills.

**It might be better to stick with platform alerts and spreadsheets if:**

*   **Clear targets:** Your target companies and roles are already very specific and few in number, and existing platform alerts and simple spreadsheets meet your needs.
*   **Time is critical:** You currently need more time for resume preparation, application submissions, or interview practice, rather than organizing job information.
*   **Unrealistic expectations:** You hope the tool can automatically scrape all job boards for the latest information, but you're unwilling to deal with the complexities of logins, anti-scraping mechanisms, platform terms, and data maintenance.
*   **Distraction:** Building the tool itself starts consuming more energy than the actual job search, diverting you from your main goal.

A simple rule: if it doesn't save repetitive actions or offer project value, don't build it. Job searching is about matching and communication; tools are aids.

<note-interactive type="decision-aid" title="Should I build it myself?">
**Consider building it yourself if any of these apply:**
- Your current job info is scattered, platform filters are inaccurate, or spreadsheets are insufficient.
- You need to repeatedly compare job details and track your thoughts/progress.
- You're willing to invest a small amount of time in testing and iteration, accepting an MVP.
- The tool itself can showcase your problem-solving abilities.

**Consider sticking with existing tools if any of these apply:**
- Your targets are clear, few roles, and current alerts/spreadsheets are enough.
- Time is critical, prioritize resume/interview prep.
- You expect automated scraping of all sites but don't want to handle technical/compliance issues.
- Building the tool has become a burden on your job search.
</note-interactive>

## First Version: A Browser-Based Job Board

To make this accessible for users with no programming background, our first version will be a pure front-end static webpage. This means no connections to job boards, no paid APIs, and no back-end server. All your data will be securely stored directly in your browser.

**This MVP (Minimum Viable Product) can achieve the following core functions:**

*   **Manual Job Entry:** Easily add company, job title, job link, location, source (e.g., which job board), deadline, custom tags, current status (e.g., "To Apply," "Applied," "Interviewing"), and notes.
*   **Flexible Filtering & Sorting:** Support keyword search, multi-dimensional filtering by status and tags, and sorting by deadline, allowing you to quickly spot upcoming deadlines.
*   **Visual Management:** Mark roles as favorited, applied, tested, interviewed, or closed, providing a clear overview of each job's progress.
*   **Local Data Storage:** All data is saved in your current browser's `localStorage`, meaning your information persists even after closing and reopening the page.
*   **Data Backup & Migration:** Provides functions to export JSON, import JSON, and export CSV, making it easy to back up your data or move it between devices. Before importing, it will explicitly prompt you that no data will be automatically uploaded anywhere.

This MVP effectively solves common problems like scattered job bookmarks and forgotten application statuses. The browser's `localStorage` saves data per website and persists across browser sessions. While ideal for small personal tools, be aware that clearing browser data or changing devices might lead to data loss. Regular data export for backup is crucial.

## Choose a Tool for Conversational Web Generation

You can use Replit Agent, Lovable, or any other conversational AI coding platform you trust (i.e., platforms that generate code through dialogue). While interfaces may update, the core process remains similar:

1.  **Create a Project:** Select a Web App or front-end project template.
2.  **Describe Requirements:** Use natural language to detail the features you want to the AI.
3.  **Preview & Test:** After the AI generates code, view the results in the preview interface.
4.  **Provide Feedback:** Based on your testing, give the AI modification suggestions.
5.  **Publish:** Once satisfied, publish your tool (or keep it local only).

**Before you begin, keep these points in mind:**

*   **Plans & Public Scope:** Check the free tier limitations provided by the platform and whether your project is public or private by default.
*   **Privacy & Security:** **Never** upload or hardcode real passwords, identification numbers, undisclosed company materials, or any API Keys into your code. If job links and personal notes are sensitive, consider keeping them only in your local version and avoid publishing them to a public website.

## Step One: Give the AI Your Complete Requirements

Create a new Web App project and paste the following prompt, which includes all core MVP requirements:

> Please create a pure front-end personal job search and application management tool for users with no programming background. Use a clean, responsive Chinese interface, requiring no login, database, backend, or any external APIs. Users should be able to manually add job entries, with fields including company, job title, job link, location, source, deadline, tags, current status, and notes. Support keyword search, filtering by status and tags, sorting by deadline, marking as favorite, and displaying upcoming deadlines. All data should be saved in the browser's localStorage. Provide export JSON, import JSON, and export CSV functionalities, with a prompt before import stating that no data will be automatically uploaded. Include a small amount of sample data and a clear sample data button. Please list the implementation plan first, and wait for my confirmation before building.

**Before the AI builds, carefully review its proposed implementation plan.** Confirm it hasn't unilaterally added an account system, database, paid APIs, automated crawlers, or any complex pages you don't need. Only when the plan fully aligns with your "pure front-end, local-first, no complex features" principles should you allow it to generate the code.

## Step Two: Test in Preview with Real Workflows

Don't just check for aesthetics or a complete feature list. Test it like a real user, following actual workflows.

**Add a real job entry, then systematically check these key points:**

*   **Data Persistence:** After refreshing the page, is the job information you added still there?
*   **Search & Filter:** Can you accurately find jobs by searching company or job title keywords? Can statuses and tags be correctly modified and filtered?
*   **Edge Cases:** Does the page show errors or display abnormally if the deadline is left empty? Does a very long job title overflow the screen in mobile preview?
*   **Import/Export:** After exporting data, can it be successfully re-imported?
*   **User Experience:** Is there a confirmation prompt when deleting a job to prevent accidental deletion?

**When you find an issue, clearly tell the AI "what I did, what I expected, and what actually happened."** For example:

> I added a very long job title in the mobile preview, and the card overflowed the screen, causing content to be cut off. I expected it to wrap text automatically and adjust the card width on mobile. Please only fix the mobile text wrapping and card width issues, without changing other functionalities. After fixing, please tell me what specific changes were made, and re-check the display at 375px width.

Address one issue at a time, providing a clear scope for the fix. This yields more stable and satisfactory results than vaguely asking for "overall optimization."

## Step Three: Add Truly Time-Saving Features

Once your basic version is stable, consider adding features that genuinely save time, one by one. With each new feature, re-evaluate its value, complexity, and potential privacy risks.

**Features you might consider adding include:**

*   **Smart Extraction:** Automatically extract company, responsibilities, skills, and deadlines from a copied job description (JD). The extracted results should be presented for your confirmation before saving.
*   **Skill Comparison:** Compare repeated skill requirements across several saved job descriptions to help you identify commonalities or focus areas.
*   **Resume Version Management:** Save links to different resume versions and cover letters corresponding to various job applications.
*   **Stage Statistics:** Display the number of jobs in each application stage (e.g., "Applied," "Interviewing") to give you a clear overview of your overall progress.
*   **Deadline Reminders:** Generate a list of upcoming deadlines to focus on for the week.

**Privacy & Cost Note:** If these features require external AI APIs (e.g., for complex text analysis), they introduce API key management, costs, and privacy data transfer issues. For the minimal version, keep it purely local, deferring "smart extraction" and similar features, or use local AI tools manually to assist.

## Step Four: Publish or Keep It Private

Most conversational AI coding platforms offer a Publish / Deploy button.

**Before publishing, ensure:**

*   **Repository & Website Visibility:** Is your code repository and the deployed website public?
*   **Personal Information Cleanup:** Make sure you remove any real personal information or sensitive content from your sample data.

You can also choose not to publish to the platform's public domain. Instead, download the generated static files (HTML, CSS, JS), place them in your own GitHub repository, and then follow the [GitHub Pages Official Quickstart](https://docs.github.com/en/pages/quickstart) guide to publish them as a free static website from a specific branch.

**Data Synchronization Note:** Even if your website is published online, data stored in the browser's `localStorage` remains local to that browser. This means data won't automatically sync if you switch devices. MDN's [Web Storage documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) also notes that local data is cleared after using private browsing mode. The tool's import/export functions help you control and manage your data, mitigating these limitations.

## How to Communicate Common Sticking Points to AI

When generating tools with AI, you might encounter common issues. Here's how to communicate effectively:

*   **It added too many features:** "Revert to a pure front-end MVP, retaining only job creation, filtering, status, local storage, and import/export functionalities."
*   **Data disappears after refresh:** "Please check the `localStorage` saving and initialization logic to ensure data persistence, and do not introduce a database."
*   **Fixing one thing breaks another:** "First, explain the root cause of this issue. Then, make only the minimal necessary fix, and verify that existing functionalities have not regressed."
*   **Page is hard to use on mobile:** "Please implement a mobile-first layout, ensuring buttons are easy to tap, form elements are single-column, and horizontal scrolling is prevented."
*   **Unsure about code security:** "List all external requests, third-party packages, and data that will be collected; ensure no sensitive keys are stored in the front-end code."

Replit's [official getting started documentation](https://docs.replit.com/build/your-first-app) also follows the "describe scope—check plan—preview test—publish" cycle. Coding skill isn't the barrier here; the key is clear problem articulation, scope control, and thorough testing.
