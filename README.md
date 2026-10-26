# TextExtractor AI

TextExtractor AI is a web app that extracts text from images using Google's **Gemini 3.8 Flash** model. You add one or more images, the app sends each one to the Gemini API, and you can edit, copy or download the text it returns.

The app has no backend of its own: the browser sends your images **directly to the Google Gemini API**, so they do leave your device (see [Privacy and Security Notes](#privacy-and-security-notes)).

---

## Features

- **Three ways to add images:** click to browse, drag and drop anywhere on the page, or paste from the clipboard (Ctrl+V). Up to 10 images can be queued at once (maximum 10 MB per image and 50 MB total).
- **Batch processing with progress:** images are processed one after another, with a progress bar and a status for each image. A failed image shows its own error and does not stop the rest.
- **Text recognition by Gemini:** the request asks for all text, numbers, symbols and emojis exactly as they appear, in any mix of languages, without translating or summarizing.
- **Edit, copy and download:** edit the extracted text for each image, copy it, copy everything at once, or download all results as a `.txt` or `.json` file.
- **Image preview:** open any uploaded image in a larger preview.
- **Interface languages:** English, Arabic (right-to-left) and Russian. The first language is detected from the browser, and your choice is remembered.
- **Dark and light themes:** starts from your OS preference, can be toggled, and is remembered.

Accuracy depends on image quality, language, handwriting, layout and the model's response, and no result is guaranteed to be perfect.

---

## Tech Stack

- **React 19**, **TypeScript** and **Vite 6**
- **Google Gemini API** through the official `@google/genai` SDK (model `gemini-3.8-flash`)
- **Tailwind CSS**, loaded from the Tailwind CDN script in `index.html` (it is not an npm dependency)
- Google Fonts (Inter and Cairo)

---

## Running Locally

### Prerequisites

- **Node.js 20.19 or newer** (22.12+ also works)
- npm
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Setup

```bash
git clone https://github.com/Adel-dev-2001/textextractor-ai.git
cd textextractor-ai
npm install
```

Create a local `.env.local` file in the project folder (you can copy `.env.example`) and add your key:

```env
GEMINI_API_KEY=your_key_here
```

Then start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server listens on the local machine only (`127.0.0.1`). This matters because the current prototype injects the API key into browser code; do not expose the development server to your network.

To create a bundle, run `npm run build` (TypeScript validation, then Vite bundling). The result is in `dist/`. `npm run lint` runs the TypeScript check separately. A successful build does not make this client-key prototype safe for public deployment; see the security notes below.

---

## Privacy and Security Notes

- **Input limits:** up to 10 images at once, 10 MB per image, 50 MB combined. This protects the browser from accidentally processing very large batches.
- **Your images are sent to Google.** Each image you process is read in the browser and sent to the Gemini API. This app does not store images, but Google handles them under its own terms, so avoid uploading sensitive images unless you have reviewed those terms.
- **Stored in your browser:** only your language and theme choices (`localStorage`). Images and extracted text are kept in memory and disappear when you close or reload the page.
- **API-key warning:** `vite.config.ts` injects the Gemini key into the client-side code. A key included in a browser bundle can be read by anyone who opens the site, even if it was kept in a local `.env.local` file. The dev server is therefore bound to `127.0.0.1` for local use. For a public deployment, route Gemini requests through a backend or serverless function that keeps the key on the server.
- **Tailwind CDN:** the Tailwind script in `index.html` is intended for development and prototyping. For a production site, install Tailwind as a build dependency instead.

---

## Project Structure

```
textextractor-ai/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── IconComponents.tsx
│   │   ├── ImagePreviewModal.tsx
│   │   ├── ImageResultCard.tsx
│   │   ├── ImageUploader.tsx
│   │   └── ProgressBar.tsx
│   ├── constants/
│   │   ├── i18n/
│   │   │   ├── ar.ts
│   │   │   ├── en.ts
│   │   │   └── ru.ts
│   │   └── languages.ts
│   ├── contexts/
│   │   └── SettingsContext.tsx   # Language, text direction and theme
│   ├── hooks/
│   │   └── useImageProcessor.ts  # Adding images, processing queue, copy and download
│   ├── services/
│   │   └── geminiService.ts      # Gemini client (created on first use)
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx                   # Main page layout
│   └── main.tsx                  # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts                # Dev server on port 3000, injects GEMINI_API_KEY
```

### How it fits together

```
App.tsx
  ├── SettingsContext      -> language, direction, theme
  └── useImageProcessor    -> image list, queue, copy / download
        └── geminiService  -> Gemini API (gemini-3.8-flash)
```
