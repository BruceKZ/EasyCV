# EasyCV

EasyCV is a modern, privacy-focused resume builder that combines the power of [Typst](https://typst.app/) with the ease of a web interface. Built with Vue 3 and TypeScript, it allows you to create professional, beautifully typeset resumes in real-time without needing to install Typst locally or write complex markup manually.

## Features

- **Real-time Preview**: See your changes instantly as you type, powered by Typst's WASM compiler.
- **Privacy First**: All data is stored locally in your browser. No server-side storage.
- **Bilingual Support**: Seamlessly switch between Chinese and English resume templates.
- **PDF Export**: Generate high-quality, print-ready PDFs directly from the browser.
- **Data Management**: Import and export your resume data as JSON for backup or transfer.
- **Modern UI**: Clean, responsive interface built with Tailwind CSS.

## Tech Stack

- **Frontend Framework**: [Vue 3](https://vuejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Typesetting Engine**: [Typst](https://typst.app/) (via `@myriaddreamin/typst.ts`)

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/easycv.git
    cd easycv
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

## Usage

1.  **Edit Content**: Use the editor panel on the left to input your personal information, education, work experience, etc.
2.  **Preview**: The right panel shows the real-time rendered PDF of your resume.
3.  **Switch Language**: Use the language switcher in the toolbar to toggle between English and Chinese templates.
4.  **Export PDF**: Click the "Export PDF" button to download your resume.
5.  **Save/Load**: Use "Export JSON" to save your data and "Import JSON" to restore it later.

## Project Structure

- `src/components`: Vue components for the Editor and Preview.
- `src/stores`: Pinia stores for managing application state (resume data).
- `src/utils`: Utility functions, including Typst compilation logic.
- `src/assets`: Static assets.

## License

[MIT](LICENSE)
