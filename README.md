# QRyptshare 🔒

**Version 1.1.0**

**QRyptshare** is a professional, privacy-focused QR code generator built with **Next.js**, **Tailwind CSS**, and **Capacitor**. It features a responsive, adaptive interface that works seamlessly on desktop browsers and mobile devices.

Designed for self-hosting on Oracle Cloud Infrastructure (OCI) via Docker, deployment to GitHub Pages, or as a native Android app.

-----

## 👁️ Preview

### Live Demo

Try the web application live: **[http://qr.sanchez.ph](http://qr.sanchez.ph)**

### Landing Page

Visit the project home: **[https://qryptshare.sanchez.ph](https://qryptshare.sanchez.ph)**

### App Screenshots

| Desktop View | Mobile View |
|:---:|:---:|
|  | *Add your mobile screenshot here* |

> *The UI features a split-pane design on desktop (Input vs. Result) and a responsive stack layout on mobile.*

-----

## 🚀 Features

### 🖥️ Modern, Adaptive UI

  * **Split-Screen Desktop Layout:** Input forms on the left, sticky real-time QR preview on the right.
  * **Mobile-First Design:** Collapsible navigation menu and touch-optimized inputs for smaller screens.
  * **Platform Awareness:** Automatically detects if running as a web app or native Android app to toggle download prompts.

### 🔗 Link Generator

  * Convert any website URL into a high-quality QR code instantly.

### 📶 WiFi Access

  * Generate QR codes that allow devices to instantly join a network.
  * **Security Support:** WPA/WPA2, WEP, and Open networks.
  * **Hidden Networks:** Support for non-broadcast SSIDs.
  * **Privacy:** Toggle password visibility while typing.

### 👤 Professional Contact Card (vCard)

  * Create digital business cards that save directly to a phone's address book.
  * **Fields Supported:**
      * First & Last Name
      * Job Title & Organization
      * Mobile Phone & Email
      * Website URL

### 💾 Flexible Export

  * Download QR codes in multiple formats: **PNG**, **JPG**, or **WebP**.
  * **Smart Backgrounds:** Automatic white background injection ensures QR codes remain scannable even in dark mode viewers.
  * **High Resolution:** Exports are scaled for high-quality printing.

-----

## 🛡️ Privacy & Philosophy

QRyptshare is built with a strict **privacy-first** approach:

  * **No Data Storage:** Information entered is processed entirely in your browser's memory. Nothing is ever sent to a server.
  * **No Tracking:** We do not track user behavior or analytics.
  * **Ad-Free:** Experience a clean, distraction-free interface.

-----

## 💻 Code & Development

Follow these instructions to set up the development environment and run the code locally.

### 1\. Prerequisites

Ensure you have **Node.js 18+** installed.

### 2\. Clone & Install

```bash
git clone https://github.com/tildemark/QRyptshare.git
cd QRyptshare

# Install dependencies
npm install
```

### 3\. Run Development Server

To start the Next.js local server:

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

-----

## 📦 Deployment Options

### Option A: Docker (Self-Hosted / OCI)

Ideal for hosting on your own server.

1.  **Deploy via Portainer:**

      * Create a new stack.
      * Paste the content of `docker-compose.yml`.
      * Deploy.

2.  **Manual Docker Run:**

    ```bash
    docker build -t qryptshare .
    docker run -p 3010:3000 qryptshare
    ```

### Option B: Android App (APK)

1.  **Build Static Assets:**
    ```bash
    npm run build:mobile
    ```
2.  **Open in Android Studio:**
    ```bash
    npx cap open android
    ```
3.  **Build:** Select `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

### Option C: GitHub Pages (Landing Page)

1.  Checkout the `gh-pages` branch.
2.  Place your `index.html` and `app-release.apk` in the root.
3.  Push to GitHub to serve a static download page.

-----

## 🛠️ Tech Stack

  * **Framework:** Next.js 14 (App Router)
  * **Language:** TypeScript
  * **Styling:** Tailwind CSS
  * **Icons:** Lucide React
  * **Mobile Engine:** Capacitor (Android)
  * **Deployment:** Docker, Portainer, GitHub Pages

-----

## ☕ Support the Project

This project is completely free and open source. If you find it useful, consider buying me a coffee\!

[](https://buymeacoffee.com/tildemark)

-----

## 📝 Changelog

### v1.1.0

  * **Client-Side Privacy:** Verified that no data leaves the device.
  * **Custom Styling:** Added controls for quiet zone margins, border thickness, colors, and border radius.
  * **Format Support:** Added WebP and JPG download options alongside PNG.

### v1.0.0

  * **New UI:** Implemented responsive sidebar layout for desktop and hamburger menu for mobile.
  * **New Layout:** Added split-screen view for easier data entry on large screens.
  * **New:** Job Title and Organization fields for Contacts.
  * **Mobile:** Added native platform detection to hide "Download App" buttons when running inside the app.

*See full history in [changelogs/](https://www.google.com/search?q=./changelogs/)*

-----

## 📄 License

This project is open source and available under the [MIT License](https://www.google.com/search?q=LICENSE).