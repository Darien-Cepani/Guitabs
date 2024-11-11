export const videoValidators = {
  maxSize: 100 * 1024 * 1024, // 100MB
  allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  
  validateFile(file) {
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error('Unsupported video format');
    }
    
    if (file.size > this.maxSize) {
      throw new Error('File size exceeds 100MB limit');
    }
    
    return true;
  }
};
