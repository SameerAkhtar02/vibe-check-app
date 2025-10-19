/**
 * File processing utilities for the scan functionality
 */

// Valid file extensions for code scanning
const VALID_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.svelte', '.vue',
  '.json', '.html', '.css', '.scss', '.sass', '.less',
  '.py', '.java', '.php', '.rb', '.go', '.rs',
  '.cpp', '.c', '.h', '.hpp', '.cs', '.swift',
  '.kt', '.scala', '.clj', '.hs', '.ml', '.fs',
  '.r', '.m', '.pl', '.sh', '.bash', '.zsh',
  '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf',
  '.xml', '.sql', '.md', '.txt'
];

// Directories to skip during folder scanning
const EXCLUDED_DIRS = [
  'node_modules', '.git', 'dist', 'build', '.svelte-kit',
  '.next', 'vendor', '__pycache__', '.vscode', '.idea',
  'coverage', '.nyc_output', 'target', 'bin', 'obj',
  '.gradle', '.mvn', 'venv', 'env', '.env'
];

/**
 * Check if a file extension is valid for code scanning
 * @param {string} fileName - The file name to check
 * @returns {boolean} - True if file extension is valid
 */
export function isValidCodeFile(fileName) {
  if (!fileName || typeof fileName !== 'string') return false;
  
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return VALID_EXTENSIONS.includes(extension);
}

/**
 * Check if a path should be skipped during scanning
 * @param {string} path - The file/directory path to check
 * @returns {boolean} - True if path should be skipped
 */
export function shouldSkipPath(path) {
  if (!path || typeof path !== 'string') return true;
  
  const pathParts = path.toLowerCase().split('/');
  
  // Check if any part of the path matches excluded directories
  return pathParts.some(part => EXCLUDED_DIRS.includes(part));
}

/**
 * Read file content as text using FileReader
 * @param {File} file - The file to read
 * @returns {Promise<string>} - File content as string
 */
export function readFileContent(file) {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) {
      reject(new Error('Invalid file provided'));
      return;
    }

    // Check file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      reject(new Error(`File ${file.name} is too large (max 5MB)`));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        resolve(event.target.result);
      } catch (error) {
        reject(new Error(`Failed to read file ${file.name}: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error(`Failed to read file ${file.name}`));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Process uploaded files and extract valid code files
 * @param {FileList} fileList - List of uploaded files
 * @returns {Promise<Array>} - Array of processed file objects
 */
export async function processUploadedFiles(fileList) {
  if (!fileList || fileList.length === 0) {
    return [];
  }

  const maxFiles = 50;
  if (fileList.length > maxFiles) {
    throw new Error(`Too many files selected (max ${maxFiles})`);
  }

  const processedFiles = [];
  const errors = [];

  // Convert FileList to Array for easier processing
  const files = Array.from(fileList);

  for (const file of files) {
    try {
      // Skip if path should be excluded
      if (shouldSkipPath(file.webkitRelativePath || file.name)) {
        continue;
      }

      // Skip if not a valid code file
      if (!isValidCodeFile(file.name)) {
        continue;
      }

      // Read file content
      const content = await readFileContent(file);
      
      processedFiles.push({
        name: file.webkitRelativePath || file.name,
        size: file.size,
        content: content,
        lastModified: file.lastModified
      });

    } catch (error) {
      errors.push({
        fileName: file.name,
        error: error.message
      });
    }
  }

  // If there were errors, log them but don't fail completely
  if (errors.length > 0) {
    console.warn('Some files could not be processed:', errors);
  }

  if (processedFiles.length === 0) {
    throw new Error('No valid code files found in the upload');
  }

  return processedFiles;
}

/**
 * Calculate total size of files
 * @param {Array} files - Array of file objects
 * @returns {number} - Total size in bytes
 */
export function calculateTotalSize(files) {
  return files.reduce((total, file) => total + (file.size || 0), 0);
}

/**
 * Format file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size string
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
