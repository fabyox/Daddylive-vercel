
import { Channel } from '../types/channel';

export const parseExistingM3U = (content: string): Channel[] => {
  const channels: Channel[] = [];
  const lines = content.split('\n');
  let currentChannel: Partial<Channel> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      // Parse EXTINF line
      const match = line.match(/#EXTINF:(-?\d+)(?:\s+(.+?))?,(.+)/);
      if (match) {
        const attributes = match[2] || '';
        const name = match[3] || 'Unknown Channel';
        
        currentChannel = { name };
        
        // Parse attributes
        const tvgIdMatch = attributes.match(/tvg-id="([^"]+)"/);
        if (tvgIdMatch) currentChannel.tvgId = tvgIdMatch[1];
        
        const groupMatch = attributes.match(/group-title="([^"]+)"/);
        if (groupMatch) currentChannel.group = groupMatch[1];
        
        const logoMatch = attributes.match(/tvg-logo="([^"]+)"/);
        if (logoMatch) currentChannel.logo = logoMatch[1];
      }
    } else if (line && !line.startsWith('#') && currentChannel.name) {
      // This is the URL line
      currentChannel.url = line;
      channels.push(currentChannel as Channel);
      currentChannel = {};
    }
  }
  
  return channels;
};

export const validateM3U = (content: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!content.startsWith('#EXTM3U')) {
    errors.push('M3U file must start with #EXTM3U header');
  }
  
  const lines = content.split('\n');
  let channelCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      channelCount++;
      // Check if next non-comment line is a URL
      let foundUrl = false;
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.startsWith('#')) {
          if (nextLine.startsWith('http') || nextLine.includes('://')) {
            foundUrl = true;
          }
          break;
        }
      }
      
      if (!foundUrl) {
        errors.push(`Channel ${channelCount} is missing a valid URL`);
      }
    }
  }
  
  if (channelCount === 0) {
    errors.push('No channels found in M3U file');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
