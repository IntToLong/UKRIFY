# UKRIFY – Chrome Extension

> **No more “ghbdsn” when you meant “привіт”!**  
Save time, skip the retyping, and fix your text instantly with just one click.

<img width="1280" height="800" alt="img" src="https://github.com/user-attachments/assets/58a5e09b-1100-4ba4-8965-1e98b932f4fb" />

## Overview

Are you tired of accidentally typing Ukrainian words with your keyboard set to English layout?<br>
**UKRIFY** is a lightweight Chrome extension designed specifically for bilingual keyboard users to quickly convert text typed in the wrong layout.<br>
Forget deleting and retyping — simply highlight your text, and UKRIFY instantly transforms it from English letters to proper Ukrainian Cyrillic.<br>


## Try UKRIFY

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-black?style=for-the-badge&logoColor=%23ffe259&label=Visit&labelColor=%23ffe259)](https://chromewebstore.google.com/detail/ukrify/fbfgapejodfnnmfijbhkgjakcmbfbcpo)

---

## Features

- Convert text typed in English layout back to Ukrainian in one click  
- Choose to **copy** the corrected text to clipboard or **replace** it in-place  
- Simple, intuitive user interface  
- Lightweight and fast with zero hassle  

---

## Technologies

- **Vanilla JavaScript**  
- **Vanilla CSS**  
- **Vite** (development and build tool)
- **Chrome Extensions API** (integrate the extension with the Chrome browser environment)
- **Clipboard API** (for secure and efficient text copying)  
- **npm** (package manager)

---

## How to Use

1. Select the misspelled word or sentence using double-click or `Ctrl+A`.
2. Click the **UKRIFY icon** that appears near the selection.
3. Choose an action: **Copy** (converted text to clipboard) or **Replace** (convert directly in place).
4. Done!

---

## Developer Setup

If you want to test or contribute to the extension, follow these steps:

### Installing

1. Ensure you have **Node.js v14 or higher** installed.
2. Customize the extension name in `src/manifest`.
3. Run:

```bash
npm install
```

---

### Developing

```bash
cd ext
npm run dev
```

#### Chrome Extension Developer Mode

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select the `ext/build` folder.

---

## Acknowledgements

Big thanks to [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext) for providing an excellent boilerplate that includes:

- a ready-to-use Vite setup,

- built-in structure for common extension features like popup, options page, side panel, and more.

It made getting started with Chrome extension development fast and enjoyable.

