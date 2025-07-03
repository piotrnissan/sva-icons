## Project Memories
- The user utilizes the Live Preview extension within VS Code for development.
- Icons in the sva-icons system should have a stroke value of 0 by default as they do not use strokes.
- info about .gitignore issue
- My tools may not show all files because of the project's .gitignore settings. I should use
`respect_git_ignore: false` when listing files if I suspect something is missing.
- I'm using PowerShell, so please use PowerShell syntax in your responses.
- Also `&&` is not a valid operator in PowerShell, so please use `;` to separate commands instead.
- **Test files belong in the `.tests` folder, NOT in the project root**
- **For viewing HTML files, use local server - file:// URLs don't work properly**
- **When creating test files, always place them in `.tests/` directory for proper organization**
- **Development scripts belong in `/scripts` directory alongside other project utilities**
- **For ES6 module testing, use the dev server: `node scripts/dev-server.mjs` (port 3002)**
- **Never place utility scripts in the project root - they belong in organized directories**

### Project Overview

This is the `sva-icons` project. Its primary purpose is to take a directory of source SVG files (`/svg`),
optimize them, and then build them into various distributable formats, including:
- Web Components
- Simple React components
- CSS Sprites
- Bundled JavaScript modules (`/bundles`)

### Key Files & Directories

-   `/svg`: The source of truth. All raw SVG icons are stored here.
-   `/scripts`: Contains all Node.js build and utility scripts. This is the heart of the project's automation.
    -   `dev-server.mjs`: Development server for ES6 module testing (port 3002)
    -   `validate-icons.js` and `validate-icon-names.js`: Quality and naming validation
    -   Build scripts: `build-*.js` files for various output formats
-   `/dist`: The output directory for all generated files and packages. This directory is cleaned before each build.
-   `icons.json`: A manifest file that lists all available icons. This file is likely generated or updated by a script.
-   `package.json`: Defines all dependencies and, most importantly, the `npm` scripts used to run workflows.
-   `svgo.config.json`: Configuration for SVGO, the tool used to optimize the source SVGs.
-   `/visual-testing`: A standalone React + Vite application for visually inspecting and testing the generated icons. It loads data directly from the build artifacts.
-   `.docs`: Contains documentation and planning documents for the project.
-   `.tests`: Contains test files for the project, ensuring that the build process and generated icons meet quality standards.
    -   `data-attribute-implementation.html`: Main test for data attribute-based icon injection
    -   `README.md`: Instructions for running tests with proper dev server

### Core Workflows

**1. Adding a New Icon:**
-   Place the new `.svg` file into the `/svg` directory.
-   Run the script that updates the `icons.json` manifest (likely `scripts/update-icons.js` or similar).
-   Run the main build process to generate all new assets.

**2. Building the Project:**
-   The project is built by running a series of scripts defined in `package.json`. The main script is likely
  `npm run build`.

**3. Validating Icons:**
-   The `scripts/validate-icons.js` and `scripts/validate-icon-names.js` scripts are used to enforce quality
  and naming conventions.

**4. Testing Icon Implementation:**
-   Use the development server for ES6 module testing: `node scripts/dev-server.mjs`
-   Access tests via `http://localhost:3002/.tests/` (never use file:// URLs)
-   Main test file: `data-attribute-implementation.html` for data attribute-based injection
-   The dev server serves from project root with proper MIME types and CORS headers

### Conventions & Standards

-   **SVG Naming:** All SVG filenames must follow the convention outlined in
`.docs/SVG_NAMING_CONVENTION.md`.
-   **Code Style:** Follow the existing code style found in the `/scripts` and `/src` directories.
-   **Commits:** Keep commit messages concise and focused on the change being made.
-   **Script Organization:** All utility and development scripts belong in `/scripts` directory, never in project root.
-   **Test Organization:** All test files belong in `.tests/` directory with proper documentation.
-   **Development Server:** Use `scripts/dev-server.mjs` for local testing, especially for ES6 modules.

### Known Issues & Environment

-   The project is located in a OneDrive directory. This can sometimes cause file-locking issues (`EIO` or
`ETIMEDOUT` errors) during file operations or installations due to the sync client. If a command fails, it's
  often worth retrying after a moment.

### **Future Requirements Planning Process**

When new requirements are provided (e.g., from the SVA Framework Team), we will follow the established and
successful planning process used for the v3.1 update. The process is as follows:

1.  **Review Requirements:** I will first thoroughly read and analyze the new requirements document.
2.  **Develop Planning Documents:** Based on the requirements, I will create a consistent set of three
planning documents:
    *   **Action Plan:** A strategic, high-level response outlining the phased approach, priorities, and
success metrics.
    *   **Detailed Tracker:** A granular, task-oriented document for day-to-day project management,
including specific tasks, assignments, and acceptance criteria.

