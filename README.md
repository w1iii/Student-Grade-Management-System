# Student Grade Management System

A desktop application for managing and tracking student grades across multiple grade levels. Built with Electron, React, and TypeScript.

<img width="1205" height="789" alt="Screenshot 2026-03-08 at 11 10 15 PM" src="https://github.com/user-attachments/assets/7755f6eb-e107-4bc9-8635-efcfce1b0cb5" />
<img width="1203" height="795" alt="Screenshot 2026-03-08 at 11 10 34 PM" src="https://github.com/user-attachments/assets/f4c933a1-0ad8-4f9c-b0fa-8172dc79d2ec" />


## Features

- **Multi-grade Support**: Manage grades from Elementary (Grade 1-6), High School (Grade 7-10), and Senior High School (Grade 11-12)
- **Student Management**: View and manage student records organized by grade level
- **Grade Tracking**: Track grades across 4 quarters for multiple subjects
- **Auto Calculations**: Automatic calculation of subject averages and general average
- **CSV Data Storage**: Student data stored in CSV format for easy import/export
- **Desktop Application**: Native desktop experience with Electron

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Desktop**: Electron 39
- **Routing**: React Router DOM
- **Data Processing**: csv-parser, fast-csv, xlsx

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the React development server and launch the Electron application.

### Build

```bash
npm run build
```

Builds the React app and prepares Electron files.

## Project Structure

```
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components (Login, Dashboard, Students)
│   ├── electron/        # Electron main process & preload
│   └── ...
├── students/            # CSV files containing student grade data
├── dist-electron/       # Compiled Electron files
└── public/              # Static assets
```

## Usage

1. Launch the application
2. Navigate through grade levels using the Dashboard
3. Select a grade to view student list
4. Click on a student to view and edit their grades
5. Click on any grade cell to edit - press Enter to save, Esc to cancel

## Data Format

Student data is stored in CSV files under the `students/` directory. Each file is named `grade_N.csv` where N is the grade level (1-12).
