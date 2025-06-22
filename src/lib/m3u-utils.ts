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
  console.log('Extracting DaddyLive streams from:', url);
  
  // Validate DaddyLive URL
  const isDaddyLiveUrl = url.toLowerCase().includes('daddylive') || 
                        url.toLowerCase().includes('daddy') ||
                        url.includes('dlhd.') ||
                        url.includes('dlive.');
  
  if (!isDaddyLiveUrl) {
    throw new Error('Please enter a valid DaddyLive mirror URL');
  }
  
  // Simulate API call delay for DaddyLive extraction
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock DaddyLive channels with realistic names and categories
  const daddyLiveChannels: Channel[] = [
    {
      name: "Sky Sports Main Event HD",
      url: "https://proxy.example.com/stream/sky-sports-main-hd.m3u8",
      group: "UK Sports",
      logo: "https://example.com/logos/sky-sports.png",
      tvgId: "skysports.mainevent.uk",
    },
    {
      name: "ESPN USA HD",
      url: "https://proxy.example.com/stream/espn-usa-hd.m3u8", 
      group: "US Sports",
      logo: "https://example.com/logos/espn.png",
      tvgId: "espn.usa.hd",
      backupUrls: ["https://backup.example.com/espn-alt.m3u8"]
    },
    {
      name: "BT Sport 1 HD",
      url: "https://proxy.example.com/stream/bt-sport-1-hd.m3u8",
      group: "UK Sports", 
      logo: "https://example.com/logos/bt-sport.png",
      tvgId: "btsport1.uk.hd",
    },
    {
      name: "Fox Sports 1 HD",
      url: "https://proxy.example.com/stream/fox-sports-1-hd.m3u8",
      group: "US Sports",
      logo: "https://example.com/logos/fox-sports.png", 
      tvgId: "foxsports1.usa.hd",
    },
    {
      name: "CNN International HD",
      url: "https://proxy.example.com/stream/cnn-intl-hd.m3u8",
      group: "News",
      logo: "https://example.com/logos/cnn.png",
      tvgId: "cnn.international.hd",
    },
    {
      name: "BBC One HD",
      url: "https://proxy.example.com/stream/bbc-one-hd.m3u8", 
      group: "UK TV",
      logo: "https://example.com/logos/bbc-one.png",
      tvgId: "bbcone.uk.hd",
    },
    {
      name: "Premier League TV HD",
      url: "https://proxy.example.com/stream/pl-tv-hd.m3u8",
      group: "UK Sports",
      logo: "https://example.com/logos/premier-league.png",
      tvgId: "premierleague.tv.hd",
    },
    {
      name: "TNT Sports 1 HD", 
      url: "https://proxy.example.com/stream/tnt-sports-1-hd.m3u8",
      group: "UK Sports",
      logo: "https://example.com/logos/tnt-sports.png",
      tvgId: "tntsports1.uk.hd",
    }
  ];
  
  return daddyLiveChannels;
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
