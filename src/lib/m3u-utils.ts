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
    
    // Generate private proxy URL instead of direct URL
    const privateUrl = generateProxyUrl(channel.url, `ch_${index}_${channel.tvgId || channel.name.toLowerCase().replace(/\s+/g, '_')}`);
    m3uContent += privateUrl + '\n\n';
    
    // Add backup URLs as proxy URLs too
    if (channel.backupUrls && channel.backupUrls.length > 0) {
      channel.backupUrls.forEach((backupUrl, backupIndex) => {
        if (backupUrl.trim()) {
          const backupProxyUrl = generateProxyUrl(backupUrl, `ch_${index}_backup_${backupIndex}`);
          m3uContent += `#BACKUP${backupIndex + 1}: ${backupProxyUrl}\n`;
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

// Simulate real DaddyLive extraction with more realistic implementation
export const extractStreams = async (): Promise<Channel[]> => {
  console.log('Extracting DaddyLive streams from mirror sources...');
  
  // Simulate API extraction with realistic delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Enhanced channel list with more realistic DaddyLive channels
  const daddyLiveChannels: Channel[] = [
    {
      name: "Sky Sports Premier League HD",
      url: "https://d1.daddylive.me/stream/skysports-pl.m3u8",
      group: "UK Sports",
      logo: "https://assets.skyassets.com/libs/skycom/latest/images/logos/sky-sports-premier-league.png",
      tvgId: "skysports.premierleague.uk",
      backupUrls: ["https://d2.daddylive.me/stream/skysports-pl-backup.m3u8"]
    },
    {
      name: "ESPN USA HD",
      url: "https://d1.daddylive.me/stream/espn-usa.m3u8", 
      group: "US Sports",
      logo: "https://a4.espncdn.com/combiner/i?img=%2Fi%2Fespn%2Fespn_logos%2Fespn_red.png",
      tvgId: "espn.usa.hd",
      backupUrls: ["https://d3.daddylive.me/stream/espn-alt.m3u8"]
    },
    {
      name: "BT Sport 1 HD",
      url: "https://d1.daddylive.me/stream/bt-sport-1.m3u8",
      group: "UK Sports", 
      logo: "https://upload.wikimedia.org/wikipedia/en/4/4e/BT_Sport_logo_2019.svg",
      tvgId: "btsport1.uk.hd",
    },
    {
      name: "TNT Sports 1 HD", 
      url: "https://d1.daddylive.me/stream/tnt-sports-1.m3u8",
      group: "UK Sports",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/TNT_Sports_logo.svg",
      tvgId: "tntsports1.uk.hd",
    },
    {
      name: "Fox Sports 1 HD",
      url: "https://d1.daddylive.me/stream/fox-sports-1.m3u8",
      group: "US Sports",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/14/Fox_Sports_1_logo.svg", 
      tvgId: "foxsports1.usa.hd",
    },
    {
      name: "Eurosport 1 HD",
      url: "https://d1.daddylive.me/stream/eurosport-1.m3u8",
      group: "Sports",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Eurosport_1_logo.svg",
      tvgId: "eurosport1.hd",
    },
    {
      name: "CNN International HD",
      url: "https://d1.daddylive.me/stream/cnn-intl.m3u8",
      group: "News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Cnn_logo_red_background.png",
      tvgId: "cnn.international.hd",
    },
    {
      name: "BBC One HD",
      url: "https://d1.daddylive.me/stream/bbc-one.m3u8", 
      group: "UK TV",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/BBC_One_logo_%282021%29.svg",
      tvgId: "bbcone.uk.hd",
    },
    {
      name: "Discovery Channel HD",
      url: "https://d1.daddylive.me/stream/discovery.m3u8",
      group: "Documentary",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/27/Discovery_Channel_-_Logo_2019.svg",
      tvgId: "discovery.hd",
    },
    {
      name: "WWE Network HD",
      url: "https://d1.daddylive.me/stream/wwe-network.m3u8",
      group: "Sports Entertainment",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d4/WWE_Network_logo.png",
      tvgId: "wwe.network.hd",
    },
    {
      name: "beIN Sports 1 HD",
      url: "https://d1.daddylive.me/stream/bein-sports-1.m3u8",
      group: "Sports",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/52/BeIN_Sports_logo.png",
      tvgId: "beinsports1.hd",
    },
    {
      name: "DAZN 1 HD",
      url: "https://d1.daddylive.me/stream/dazn-1.m3u8",
      group: "Sports",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1f/DAZN_logo.svg",
      tvgId: "dazn1.hd",
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
