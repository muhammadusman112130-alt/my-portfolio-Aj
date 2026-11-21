# Google Drive Dynamic Sync - Setup & Deployment Guide

This guide explains how your portfolio website connects directly to your Google Drive account.

Once set up, whenever you drop or upload new images into your designated Google Drive folders, your portfolio will display them **automatically** without editing any HTML/CSS/JavaScript or pushing to GitHub!

---

## Security Model & Whitelist Restrictions

To ensure maximum security and privacy:
- **No Arbitrary Folder IDs:** The Apps Script does NOT accept arbitrary folder IDs from the public web. Only the 6 predefined services listed below are permitted:
  - `product-social`
  - `logo-design`
  - `advertisement`
  - `illustration`
  - `book-cover`
  - `brand-identity`
- **Zero Exposed Credentials:** No Google API keys, OAuth secrets, client tokens, or service account keys exist in the frontend code or the GitHub repository.
- **Strict Isolation:** Visitors cannot access, browse, or query any other folder or file in your personal Google Drive account.
- **Static Fallback:** If the Google Apps Script endpoint is ever unreachable or offline, the portfolio instantly and seamlessly displays the local curated project assets so the site never shows a blank gallery or error.

---

## Architecture Overview

```
[ Your Google Drive ]
         │
         ├── Designated Portfolio Folders (Only these are accessible):
         │       ├── Product & Social Media  (1Awoa0lRmnk44OlNBI99wCkwplcvmFoAx)
         │       ├── Logo Design             (1jiJzG9vRMzTrw_TUez2B62y0aPyGEVPb)
         │       ├── Advertisement           (1f18YtVHh3Ln0ZRAb_HSkAoUM7lXShJgR)
         │       ├── Illustration            (1QGxx5J0kp4HjtTHvu5i5s4sG3YfAdcMq)
         │       ├── Book Covers             (1Kj8kcu-jD0KNyNeNWeh3r8CRguNX45He)
         │       └── Brand Identity          (1ufEEa8sXFrWPf_SinYk9uBpdIsl3NcVP)
         │
         ▼
[ Google Apps Script Web App (google-apps-script.gs) ]
         │ (Runs free in your Google Account; Zero API keys exposed)
         ▼
[ Your Portfolio Website (drive-sync.js) ]
         │
         ▼
[ Live Dynamic Gallery inside Existing Portfolio Cards ]
```

---

## 3-Minute Deployment Instructions

### Step 1: Open Google Apps Script
1. Make sure you are signed into your Google account in your browser.
2. Go to: **[https://script.google.com/home/start](https://script.google.com/home/start)**
3. Click the **"+ New project"** button (top left).
4. Rename the project from *"Untitled project"* to **"Signatures Studio Drive API"** (click the title at top left).

### Step 2: Paste the Script Code
1. Open the file [google-apps-script.gs](file:///f:/simple-animated-portfolio-main/simple-animated-portfolio-main/google-apps-script.gs) in your project folder.
2. Select all and copy the entire code.
3. In the Google Apps Script editor, delete any placeholder code (`function myFunction() {}`) and **paste** the copied code.
4. Click the **Save** icon (disk icon or `Ctrl + S`).

### Step 3: Deploy as a Web App
1. Click the blue **"Deploy"** button (top right) and select **"New deployment"**.
2. Click the gear icon next to *"Select type"* and choose **"Web app"**.
3. Fill in the deployment settings:
   - **Description**: `Portfolio Drive Live Sync`
   - **Execute as**: `Me (your-account@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial so your portfolio visitors can view your images)*
4. Click **"Deploy"**.
5. Google will ask for authorization:
   - Click **"Authorize access"** (or **"Review permissions"**).
   - Select your Google account.
   - If Google shows a screen saying *"Google hasn't verified this app"*, click **"Advanced"** (bottom left), then click **"Go to Signatures Studio Drive API (unsafe)"**.
   - Click **"Allow"**.
6. Google will provide a **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`
7. Copy this URL!

### Step 4: Add the URL to Your Portfolio
1. Open [drive-sync.js](file:///f:/simple-animated-portfolio-main/simple-animated-portfolio-main/drive-sync.js).
2. At line 16, paste your Web App URL between the quotes:
   ```javascript
   let SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/YOUR_DEPLOYED_ID/exec";
   ```
3. Save the file.
4. Commit and push:
   ```bash
   git add drive-sync.js
   git commit -m "Connect Google Drive Web App endpoint"
   git push origin main
   ```

---

## How to Add New Projects in the Future (Zero Code!)

1. Simply open your **Google Drive** app or website.
2. Open the respective service folder:
   - **Logo Design**
   - **Brand Identity**
   - **Advertisement**
   - **Illustration**
   - **Book Covers**
   - **Product & Social Media**
3. Upload or drop your new image (`.png`, `.jpg`, `.webp`).
4. **Done!**
   - Your portfolio website will immediately show the new design in the gallery.
   - You **never** have to edit HTML, CSS, JavaScript, or run `git push`.
   - Your Google Drive credentials remain 100% private.
