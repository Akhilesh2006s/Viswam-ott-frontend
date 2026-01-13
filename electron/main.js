const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

let mainWindow;
let downloadPath = null; // Will store custom download path
let isKioskMode = false; // TV/Kiosk mode flag
let isPortable = false; // Check if running from USB

// Check if app is running from USB/portable location
function checkPortableMode() {
  const appPath = app.getAppPath();
  // Check if running from removable drive (USB)
  const drive = path.parse(appPath).root;
  // On Windows, check if drive is removable
  if (process.platform === 'win32') {
    try {
      // If app is not in Program Files or AppData, likely portable
      if (!appPath.includes('Program Files') && !appPath.includes('AppData') && !appPath.includes('node_modules')) {
        isPortable = true;
      }
    } catch (e) {
      // If we can't determine, assume portable
      isPortable = true;
    }
  } else {
    // For other platforms, check if not in standard install location
    if (!appPath.includes('/Applications') && !appPath.includes('/usr')) {
      isPortable = true;
    }
  }
  return isPortable;
}

// Get default download path - use USB location if portable
function getDefaultDownloadPath() {
  if (isPortable) {
    // Store videos on USB drive if portable
    const appPath = app.getAppPath();
    const videosPath = path.join(path.dirname(appPath), 'videos');
    return videosPath;
  }
  return path.join(app.getPath('userData'), 'videos');
}

// Get current download path (custom or default)
function getDownloadPath() {
  return downloadPath || getDefaultDownloadPath();
}

// Ensure download directory exists
async function ensureDownloadDir(dirPath) {
  if (!fsSync.existsSync(dirPath)) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Load saved preferences
async function loadPreferences() {
  try {
    const prefsPath = path.join(app.getPath('userData'), 'preferences.json');
    if (fsSync.existsSync(prefsPath)) {
      const data = await fs.readFile(prefsPath, 'utf-8');
      const prefs = JSON.parse(data);
      
      if (prefs.downloadPath && fsSync.existsSync(prefs.downloadPath)) {
        downloadPath = prefs.downloadPath;
        await ensureDownloadDir(downloadPath);
        return prefs;
      }
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
  
  // Initialize default path
  const defaultPath = getDefaultDownloadPath();
  await ensureDownloadDir(defaultPath);
  return { downloadPath: defaultPath };
}

function createWindow() {
  // Check for kiosk mode from environment or command line
  const args = process.argv;
  isKioskMode = args.includes('--kiosk') || args.includes('--tv-mode') || process.env.KIOSK_MODE === 'true';
  
  // Check if portable mode
  isPortable = checkPortableMode();
  
  // For TV mode, use fullscreen/kiosk
  const windowOptions = {
    width: isKioskMode ? 1920 : 1200,
    height: isKioskMode ? 1080 : 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    show: false,
    titleBarStyle: 'default',
    icon: path.join(__dirname, '../public/favicon.ico'),
    autoHideMenuBar: true,
    fullscreen: isKioskMode, // Start in fullscreen for TV
    kiosk: isKioskMode, // Kiosk mode removes all window controls
    frame: !isKioskMode, // No frame in kiosk mode
    alwaysOnTop: isKioskMode // Keep on top in TV mode
  };
  
  mainWindow = new BrowserWindow(windowOptions);
  
  // Remove menu bar completely - do this after window is created
  mainWindow.setMenuBarVisibility(false);
  
  // Also remove menu after window is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Ensure menu bar is hidden
    mainWindow.setMenuBarVisibility(false);
    
    // For TV mode, maximize and go fullscreen
    if (isKioskMode) {
      mainWindow.maximize();
      mainWindow.setFullScreen(true);
    }
  });
  
  // Keyboard shortcuts for TV control
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // F11 - Toggle fullscreen
    if (input.key === 'F11') {
      if (mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false);
        isKioskMode = false;
      } else {
        mainWindow.setFullScreen(true);
        isKioskMode = true;
      }
      event.preventDefault();
    }
    
    // ESC - Exit fullscreen (but not kiosk mode if started with --kiosk)
    if (input.key === 'Escape' && !args.includes('--kiosk')) {
      if (mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false);
        isKioskMode = false;
      }
    }
    
    // Alt+F4 or Ctrl+Q - Exit app (only if not in strict kiosk mode)
    if ((input.key === 'F4' && input.alt) || (input.key === 'q' && input.control)) {
      if (!args.includes('--kiosk')) {
        app.quit();
      }
      event.preventDefault();
    }
  });

  // Load your app
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:8080/');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // For production, load the index.html file
    const indexPath = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(indexPath);
    
    // Don't open DevTools in production
    // mainWindow.webContents.openDevTools();
  }
  
  // Handle console errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (isMainFrame) {
      console.error('Failed to load:', errorCode, errorDescription, validatedURL);
    }
  });
  
  // Log console messages
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Console ${level}]:`, message);
  });
  
  // Ensure React Router handles all routes correctly
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Prevent navigation to file:// protocol issues
    if (parsedUrl.protocol === 'file:') {
      // Allow file protocol for local resources
      return;
    }
    
    // If trying to navigate to a different protocol, prevent it
    if (parsedUrl.protocol !== 'file:' && parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      event.preventDefault();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Initialize default download directory
  ensureDownloadDir(getDefaultDownloadPath());
}

// App event handlers
app.whenReady().then(async () => {
  // Remove menu bar completely
  Menu.setApplicationMenu(null);
  
  // Load preferences on startup
  await loadPreferences();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for window resizing
ipcMain.on('video-downloaded', (event, videoData) => {
  if (mainWindow && !isKioskMode) {
    // Resize to larger size for video viewing (only if not in kiosk mode)
    mainWindow.setSize(1600, 1000, true);
    mainWindow.center();
    mainWindow.setMinimumSize(1200, 800);
  }
});

ipcMain.on('video-player-closed', () => {
  if (mainWindow && !isKioskMode) {
    // Reset to normal size (only if not in kiosk mode)
    mainWindow.setSize(1200, 800, true);
    mainWindow.center();
    mainWindow.setMinimumSize(800, 600);
  }
});

// Toggle kiosk/fullscreen mode
ipcMain.handle('toggle-fullscreen', () => {
  if (mainWindow) {
    const isFullScreen = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFullScreen);
    isKioskMode = !isFullScreen;
    return { isFullScreen: !isFullScreen };
  }
  return { isFullScreen: false };
});

// Get current download path
ipcMain.handle('get-download-path', async () => {
  const currentPath = getDownloadPath();
  await ensureDownloadDir(currentPath);
  return currentPath;
});

// Set custom download path
ipcMain.handle('set-download-path', async (event, customPath) => {
  try {
    // Validate path exists and is writable
    await fs.access(customPath, fs.constants.W_OK);
    downloadPath = customPath;
    await ensureDownloadDir(downloadPath);
    
    // Save preference
    const prefsPath = path.join(app.getPath('userData'), 'preferences.json');
    await fs.writeFile(prefsPath, JSON.stringify({ downloadPath: customPath }, null, 2));
    
    return { success: true, path: customPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Open folder picker dialog
ipcMain.handle('select-download-folder', async () => {
  if (!mainWindow) return { success: false, error: 'Window not available' };
  
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'Select Download Folder'
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    downloadPath = selectedPath;
    await ensureDownloadDir(selectedPath);
    
    // Save preference
    const prefsPath = path.join(app.getPath('userData'), 'preferences.json');
    await fs.writeFile(prefsPath, JSON.stringify({ downloadPath: selectedPath }, null, 2));
    
    return { success: true, path: selectedPath };
  }
  
  return { success: false, canceled: true };
});

// Load saved preferences
ipcMain.handle('load-preferences', async () => {
  return await loadPreferences();
});

// Save video file to disk
ipcMain.handle('save-video-file', async (event, { videoId, videoData, metadata }) => {
  try {
    const downloadDir = getDownloadPath();
    await ensureDownloadDir(downloadDir);
    
    const filename = `${metadata.title.replace(/[^a-z0-9]/gi, '_')}_${videoId}.mp4`;
    const filePath = path.join(downloadDir, filename);
    
    // Convert base64 to buffer and write file
    const buffer = Buffer.from(videoData, 'base64');
    await fs.writeFile(filePath, buffer);
    
    // Save metadata
    const metadataPath = path.join(downloadDir, `${videoId}.json`);
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    
    return { success: true, filePath, filename };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get video file path
ipcMain.handle('get-video-file-path', async (event, videoId) => {
  const downloadDir = getDownloadPath();
  try {
    const files = await fs.readdir(downloadDir);
    const videoFile = files.find(f => f.includes(videoId) && f.endsWith('.mp4'));
    
    if (videoFile) {
      return path.join(downloadDir, videoFile);
    }
  } catch (error) {
    console.error('Error reading download directory:', error);
  }
  return null;
});

// Open download folder in file explorer
ipcMain.handle('open-download-folder', async () => {
  const downloadDir = getDownloadPath();
  await ensureDownloadDir(downloadDir);
  shell.openPath(downloadDir);
  return { success: true };
});


