/**
 * ====================================================================================
 * SIGNATURES STUDIO - GOOGLE DRIVE CLIENT SYNC
 * Author: Muhammad Arslan (workstation112130@gmail.com)
 * Description: Client-side integration that dynamically loads and displays portfolio
 *              projects directly from your Google Drive folders.
 *              Whenever you add new designs to Google Drive, they automatically appear here!
 * ====================================================================================
 */

const GoogleDriveSync = (function() {
    // --------------------------------------------------------------------------------
    // CONFIGURATION
    // --------------------------------------------------------------------------------
    // Set your deployed Google Apps Script Web App URL below:
    let SCRIPT_WEB_APP_URL = window.GOOGLE_DRIVE_WEB_APP_URL || "";

    // Local in-memory / session cache to ensure blazing-fast navigation
    const cache = {};

    /**
     * Set or update the Apps Script Web App URL at runtime
     */
    function setEndpointUrl(url) {
        if (url && typeof url === 'string') {
            SCRIPT_WEB_APP_URL = url.trim();
            try {
                localStorage.setItem('signatures_gdrive_endpoint', SCRIPT_WEB_APP_URL);
            } catch (e) {}
        }
    }

    // Attempt to restore cached endpoint URL from localStorage if available
    try {
        const storedUrl = localStorage.getItem('signatures_gdrive_endpoint');
        if (storedUrl && !SCRIPT_WEB_APP_URL) {
            SCRIPT_WEB_APP_URL = storedUrl;
        }
    } catch (e) {}

    /**
     * Fetches files for a specific service or folder from the Google Apps Script endpoint
     * @param {string} serviceName - e.g. 'logo-design', 'product-social', etc.
     * @param {string} [folderId] - Optional direct Google Drive folder ID
     * @returns {Promise<Array>} Array of file objects
     */
    async function fetchDriveFiles(serviceName, folderId) {
        if (!SCRIPT_WEB_APP_URL) {
            console.info('[Google Drive Sync] Google Apps Script endpoint URL is not configured yet. Using local portfolio assets.');
            return null;
        }

        const cacheKey = serviceName || folderId || 'default';
        if (cache[cacheKey] && Array.isArray(cache[cacheKey])) {
            return cache[cacheKey];
        }

        try {
            const url = new URL(SCRIPT_WEB_APP_URL);
            if (serviceName) url.searchParams.set('service', serviceName);
            if (folderId) url.searchParams.set('folderId', folderId);

            const response = await fetch(url.toString(), {
                method: 'GET',
                mode: 'cors',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.success && Array.isArray(data.files)) {
                cache[cacheKey] = data.files;
                console.log(`[Google Drive Sync] Successfully loaded ${data.files.length} items from Google Drive for "${serviceName}".`);
                return data.files;
            } else {
                console.warn('[Google Drive Sync] Endpoint returned non-success response:', data);
                return null;
            }
        } catch (err) {
            console.warn('[Google Drive Sync] Could not fetch live Google Drive items, falling back to local assets:', err.message);
            return null;
        }
    }

    /**
     * Renders drive files into the portfolio gallery container, preserving exact styling
     * @param {HTMLElement} container - The gallery DOM element (#work-gallery-grid)
     * @param {Array} files - Array of file objects from Google Drive
     * @param {string} categoryTag - Tag name to show on hover (e.g. 'Logo Design')
     */
    function renderGallery(container, files, categoryTag) {
        if (!container || !Array.isArray(files) || files.length === 0) return;

        container.innerHTML = files.map(file => {
            const title = file.title || file.name || 'Portfolio Item';
            const tag = categoryTag || 'Design';
            const thumb = file.thumbnail || file.thumbnailLarge || '';
            const fallbackThumb = file.thumbnailLarge || thumb;
            const viewLink = file.viewUrl || '#';

            return `
                <a href="${viewLink}" target="_blank" rel="noopener noreferrer" class="work-gallery-item" title="${title}">
                    <img src="${thumb}" 
                         alt="${title}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='${fallbackThumb}';">
                    <div class="work-gallery-overlay">
                        <div>
                            <div class="work-caption-tag">${tag}</div>
                            <h4 class="work-caption-title">${title}</h4>
                        </div>
                    </div>
                </a>
            `;
        }).join('');
    }

    /**
     * Automatically syncs the service-detail gallery with Google Drive
     */
    async function syncServiceDetailGallery(serviceKey, fallbackImages, categoryTag) {
        const galleryGrid = document.getElementById('work-gallery-grid');
        if (!galleryGrid) return;

        // If no endpoint configured yet, keep fallback
        if (!SCRIPT_WEB_APP_URL) return;

        // Fetch live items from Google Drive in background
        const driveFiles = await fetchDriveFiles(serviceKey);
        if (driveFiles && driveFiles.length > 0) {
            renderGallery(galleryGrid, driveFiles, categoryTag);
        }
    }

    return {
        setEndpointUrl,
        fetchDriveFiles,
        renderGallery,
        syncServiceDetailGallery,
        get endpointUrl() { return SCRIPT_WEB_APP_URL; }
    };
})();

// Attach to window for global access
window.GoogleDriveSync = GoogleDriveSync;
