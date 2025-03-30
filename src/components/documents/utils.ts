
/**
 * Format file size in bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + ' KB';
  const mb = kb / 1024;
  if (mb < 1024) return mb.toFixed(1) + ' MB';
  const gb = mb / 1024;
  return gb.toFixed(1) + ' GB';
};

/**
 * Check if a file is valid based on type and size
 */
export const validateFile = (
  file: File, 
  supportedExtensions: string[] = ['.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.sas'],
  maxSize: number = 100 * 1024 * 1024
): { valid: boolean; reason?: string } => {
  // Check file extension
  const extension = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
  
  if (!supportedExtensions.includes(extension)) {
    return { 
      valid: false, 
      reason: `Unsupported file type. Supported types: ${supportedExtensions.join(', ')}` 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      reason: `File size exceeds ${formatFileSize(maxSize)}`
    };
  }
  
  return { valid: true };
};
