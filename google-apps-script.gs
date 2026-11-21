/**
 * ====================================================================================
 * SIGNATURES STUDIO - GOOGLE DRIVE PORTFOLIO SYNC ENDPOINT
 * Author: Muhammad Arslan (workstation112130@gmail.com)
 * Description: Secure serverless Google Apps Script Web App that reads portfolio
 *              images directly from your designated Google Drive folders and serves
 *              them as JSON to your static portfolio website without exposing private
 *              credentials or tokens.
 * ====================================================================================
 */

// Mapping of portfolio services to their designated Google Drive Folder IDs
const FOLDERS_CONFIG = {
  "product-social": "1Awoa0lRmnk44OlNBI99wCkwplcvmFoAx",
  "logo-design":    "1jiJzG9vRMzTrw_TUez2B62y0aPyGEVPb",
  "advertisement":  "1f18YtVHh3Ln0ZRAb_HSkAoUM7lXShJgR",
  "illustration":   "1QGxx5J0kp4HjtTHvu5i5s4sG3YfAdcMq",
  "book-cover":     "1Kj8kcu-jD0KNyNeNWeh3r8CRguNX45He",
  "brand-identity": "1ufEEa8sXFrWPf_SinYk9uBpdIsl3NcVP"
};

/**
 * Handles HTTP GET requests from your portfolio website
 */
function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const service = params.service ? params.service.toLowerCase().trim() : "";
    const customFolderId = params.folderId ? params.folderId.trim() : "";

    // 1. If requesting all services in one single request
    if (service === "all") {
      const allServicesData = {};
      for (const serviceKey in FOLDERS_CONFIG) {
        allServicesData[serviceKey] = fetchFolderFiles(FOLDERS_CONFIG[serviceKey]);
      }
      return createJsonResponse({
        success: true,
        service: "all",
        data: allServicesData,
        timestamp: new Date().toISOString()
      });
    }

    // 2. Determine target folder ID
    let targetFolderId = customFolderId;
    if (!targetFolderId && service && FOLDERS_CONFIG[service]) {
      targetFolderId = FOLDERS_CONFIG[service];
    }

    if (!targetFolderId) {
      return createJsonResponse({
        success: false,
        error: "Invalid request. Please provide a valid service name ('product-social', 'logo-design', etc.) or 'folderId'.",
        availableServices: Object.keys(FOLDERS_CONFIG)
      });
    }

    // 3. Fetch images from the designated folder
    const files = fetchFolderFiles(targetFolderId);

    return createJsonResponse({
      success: true,
      service: service || "custom",
      folderId: targetFolderId,
      count: files.length,
      files: files,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.message || error.toString()
    });
  }
}

/**
 * Reads all image files from a given Google Drive folder
 */
function fetchFolderFiles(folderId) {
  const folder = DriveApp.getFolderById(folderId);
  const fileIterator = folder.getFiles();
  const fileList = [];

  while (fileIterator.hasNext()) {
    const file = fileIterator.next();
    const mime = file.getMimeType();
    const name = file.getName();

    // Check if the file is an image
    const isImage = mime.indexOf("image/") === 0 || 
                    /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(name);

    if (isImage) {
      const fileId = file.getId();
      fileList.push({
        id: fileId,
        name: name,
        title: formatTitle(name),
        description: file.getDescription() || "",
        mimeType: mime,
        // High-speed Google CDN URLs that load cleanly inside <img> tags on any website
        thumbnail: "https://lh3.googleusercontent.com/d/" + fileId,
        thumbnailLarge: "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1600",
        viewUrl: "https://drive.google.com/file/d/" + fileId + "/view",
        downloadUrl: file.getDownloadUrl(),
        createdTime: file.getDateCreated().toISOString(),
        lastUpdated: file.getLastUpdated().toISOString()
      });
    }
  }

  // Sort files: newest uploads appear first
  fileList.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

  return fileList;
}

/**
 * Cleans file names to create human-readable card titles
 * e.g. "branding_concept_01.jpg" -> "Branding Concept 01"
 */
function formatTitle(filename) {
  // Remove file extension
  let clean = filename.replace(/\.[^/.]+$/, "");
  // Replace underscores, hyphens, and multiple spaces with a single space
  clean = clean.replace(/[-_]+/g, " ").trim();
  // Capitalize first letter of each word
  return clean.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Helper to generate valid JSON responses with CORS support
 */
function createJsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
