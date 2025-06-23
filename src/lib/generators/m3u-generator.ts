
import { Channel } from '../types/channel';

export const generateM3U = (channels: Channel[]): string => {
  let m3uContent = '#EXTM3U\n\n';
  
  channels.forEach((channel, index) => {
    // Build EXTINF line with attributes
    let extinf = '#EXTINF:-1';
    
    const attributes: string[] = [];
    
    if (channel.tvgId) {
      attributes.push(`tvg-id="${channel.tvgId}"`);
    }
    
    if (channel.group) {
      attributes.push(`group-title="${channel.group}"`);
    }
    
    if (channel.logo) {
      attributes.push(`tvg-logo="${channel.logo}"`);
    }
    
    if (attributes.length > 0) {
      extinf += ' ' + attributes.join(' ');
    }
    
    extinf += `,${channel.name}`;
    
    m3uContent += extinf + '\n';
    
    // Use the original URL directly - these are working M3U8 streams
    m3uContent += channel.url + '\n\n';
    
    // Add backup URLs if available
    if (channel.backupUrls && channel.backupUrls.length > 0) {
      channel.backupUrls.forEach((backupUrl, backupIndex) => {
        if (backupUrl.trim()) {
          m3uContent += `#BACKUP${backupIndex + 1}: ${backupUrl}\n`;
        }
      });
      m3uContent += '\n';
    }
  });
  
  return m3uContent;
};

// Generate secure proxy URLs that mask the original DaddyLive sources
export const generateProxyUrl = (originalUrl: string, channelId: string): string => {
  // Create a secure proxy endpoint that masks the original stream source
  const baseUrl = window.location.origin;
  const encodedChannelId = btoa(channelId).replace(/[+/=]/g, (match) => {
    return { '+': '-', '/': '_', '=': '' }[match] || match;
  });
  
  // Generate a private streaming endpoint that doesn't expose the original URL
  return `${baseUrl}/api/stream/${encodedChannelId}`;
};
