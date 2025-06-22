
export interface Channel {
  name: string;
  url: string;
  group?: string;
  logo?: string;
  tvgId?: string;
  backupUrls?: string[];
  attributes?: string;
}

export const generateM3U = (channels: Channel[]): string => {
  let m3uContent = '#EXTM3U\n\n';
  
  channels.forEach((channel) => {
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
    m3uContent += channel.url + '\n\n';
    
    // Add backup URLs as comments for reference
    if (channel.backupUrls && channel.backupUrls.length > 0) {
      channel.backupUrls.forEach((backupUrl, index) => {
        if (backupUrl.trim()) {
          m3uContent += `#BACKUP${index + 1}: ${backupUrl}\n`;
        }
      });
      m3uContent += '\n';
    }
  });
  
  return m3uContent;
};

export const extractStreams = async (url: string): Promise<Channel[]> => {
  // This is a mock implementation for demonstration
  // In a real application, you would implement actual stream extraction logic
  
  console.log('Extracting streams from:', url);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock extracted channels
  const mockChannels: Channel[] = [
    {
      name: "CNN International",
      url: "https://example.com/streams/cnn.m3u8",
      group: "News",
      logo: "https://example.com/logos/cnn.png",
      tvgId: "cnn.international",
    },
    {
      name: "ESPN HD",
      url: "https://example.com/streams/espn.m3u8",
      group: "Sports",
      logo: "https://example.com/logos/espn.png",
      tvgId: "espn.hd",
      backupUrls: ["https://backup1.example.com/espn.m3u8"]
    },
    {
      name: "BBC World News",
      url: "https://example.com/streams/bbc.m3u8",
      group: "News",
      logo: "https://example.com/logos/bbc.png",
      tvgId: "bbc.world",
    },
    {
      name: "Discovery Channel",
      url: "https://example.com/streams/discovery.m3u8",
      group: "Documentary",
      logo: "https://example.com/logos/discovery.png",
      tvgId: "discovery.channel",
    },
    {
      name: "MTV Music",
      url: "https://example.com/streams/mtv.m3u8",
      group: "Music",
      logo: "https://example.com/logos/mtv.png",
      tvgId: "mtv.music",
    }
  ];
  
  return mockChannels;
};

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

export const generateProxyUrl = (originalUrl: string, channelId: string): string => {
  // Generate proxy URL to mask original stream source
  const baseUrl = window.location.origin;
  return `${baseUrl}/api/stream?id=${encodeURIComponent(channelId)}&url=${encodeURIComponent(originalUrl)}`;
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
