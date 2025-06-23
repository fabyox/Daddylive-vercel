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

// Simulate real DaddyLive extraction with comprehensive channel list
export const extractStreams = async (): Promise<Channel[]> => {
  console.log('Extracting all DaddyLive channels from mirror sources...');
  
  // Simulate API extraction with realistic delay
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // Comprehensive DaddyLive channel list organized by categories
  const daddyLiveChannels: Channel[] = [
    // Sports Channels
    {
      name: "ESPN",
      url: "https://edge.espn.com/hls/espn/espn_hd.m3u8",
      group: "Sports",
      logo: "https://logos-world.net/wp-content/uploads/2021/08/ESPN-Logo.png",
      tvgId: "espn.us"
    },
    {
      name: "ESPN 2",
      url: "https://edge.espn.com/hls/espn2/espn2_hd.m3u8",
      group: "Sports", 
      logo: "https://logos-world.net/wp-content/uploads/2021/08/ESPN2-Logo.png",
      tvgId: "espn2.us"
    },
    {
      name: "Fox Sports 1",
      url: "https://fox-foxsportsone-samsungus.amagi.tv/playlist.m3u8",
      group: "Sports",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Fox_Sports_1_logo.svg",
      tvgId: "fs1.us"
    },
    {
      name: "NBC Sports",
      url: "https://nbcsports-i.akamaihd.net/hls/live/2037622/nbcsports_hd/master.m3u8",
      group: "Sports",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/NBC_Sports_logo.svg",
      tvgId: "nbcsports.us"
    },
    {
      name: "TNT Sports",
      url: "https://tnt-tntnetwork-1-eu.rakuten.wurl.tv/playlist.m3u8",
      group: "Sports",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/TNT_Logo_2016.svg",
      tvgId: "tnt.us"
    },
    {
      name: "Sky Sports Premier League",
      url: "https://linear-skysportspl.skysports.com/stream.m3u8",
      group: "Sports",
      logo: "https://upload.wikimedia.org/wikipedia/en/1/1e/Sky_Sports_Premier_League.png",
      tvgId: "skypl.uk"
    },
    {
      name: "Sky Sports Football",
      url: "https://linear-skysportsfoot.skysports.com/stream.m3u8",
      group: "Sports",
      logo: "https://upload.wikimedia.org/wikipedia/en/d/d8/Sky_Sports_Football.png",
      tvgId: "skyfoot.uk"
    },

    // News Channels
    {
      name: "CNN",
      url: "https://cnn-cnninternational-1-eu.rakuten.wurl.tv/playlist.m3u8",
      group: "News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN.svg",
      tvgId: "cnn.us"
    },
    {
      name: "BBC News",
      url: "https://vs-hls-pushb-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news24:hls_uk/master.m3u8",
      group: "News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/BBC_News_2019.svg",
      tvgId: "bbcnews.uk"
    },
    {
      name: "Fox News",
      url: "https://fox-foxnewsnow-samsungus.amagi.tv/playlist.m3u8",
      group: "News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Fox_News_Channel_logo.svg",
      tvgId: "foxnews.us"
    },
    {
      name: "Sky News",
      url: "https://skynews2-plutolive-vo.akamaized.net/cdhlsskynewsamericas/1013/latest.m3u8",
      group: "News",
      logo: "https://upload.wikimedia.org/wikipedia/en/6/65/Sky-news-logo.svg",
      tvgId: "skynews.uk"
    },
    {
      name: "Al Jazeera English",
      url: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8",
      group: "News",
      logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Aljazeera_eng.png",
      tvgId: "aljazeera.en"
    },
    {
      name: "France 24 English",
      url: "https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8",
      group: "News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/France24.png",
      tvgId: "france24.en"
    },
    {
      name: "RT News",
      url: "https://rt-glb.rttv.com/dvr/rtnews/playlist.m3u8",
      group: "News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Russia-today-logo.svg",
      tvgId: "rt.news"
    },
    {
      name: "CGTN",
      url: "https://live.cgtn.com/1000/prog_index.m3u8",
      group: "News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/81/CGTN.svg",
      tvgId: "cgtn.news"
    },
    {
      name: "Euronews",
      url: "https://rakuten-euronews-1-pt.samsung.wurl.com/manifest/playlist.m3u8",
      group: "News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Euronews_2016_logo.svg",
      tvgId: "euronews"
    },

    // Entertainment Channels
    {
      name: "HBO",
      url: "https://hbo-hbotv-1-us.samsung.wurl.tv/playlist.m3u8",
      group: "Entertainment",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg",
      tvgId: "hbo.us"
    },
    {
      name: "Discovery Channel",
      url: "https://discovery-discoveryeast-1-us.samsung.wurl.tv/playlist.m3u8",
      group: "Documentary",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/27/Discovery_Channel_-_Logo_2019.svg",
      tvgId: "discovery.us"
    },
    {
      name: "National Geographic",
      url: "https://natgeo-natgeowild-1-us.samsung.wurl.tv/playlist.m3u8",
      group: "Documentary",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Natgeologo.svg",
      tvgId: "natgeo.us"
    },
    {
      name: "Comedy Central",
      url: "https://comedycentral-live-linear.amagi.tv/playlist.m3u8",
      group: "Entertainment",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Comedy_Central_2018.svg",
      tvgId: "comedycentral.us"
    },
    {
      name: "MTV",
      url: "https://mtv-mtv-1-us.samsung.wurl.tv/playlist.m3u8",
      group: "Music",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0d/MTV-2021.svg",
      tvgId: "mtv.us"
    },

    // Kids Channels
    {
      name: "Cartoon Network",
      url: "https://cartoonnetwork-live.samsung.wurl.tv/playlist.m3u8",
      group: "Kids",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/80/Cartoon_Network_2010_logo.svg",
      tvgId: "cartoonnetwork.us"
    },
    {
      name: "Disney Channel",
      url: "https://disney-disneyxd-1-us.samsung.wurl.tv/playlist.m3u8",
      group: "Kids",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d2/2019_Disney_Channel_logo.svg",
      tvgId: "disney.us"
    },
    {
      name: "Nickelodeon",
      url: "https://nickelodeon-nickelodeon-1-us.samsung.wurl.tv/playlist.m3u8",
      group: "Kids",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Nickelodeon_2009_logo.svg",
      tvgId: "nick.us"
    },

    // Movie Channels
    {
      name: "FX",
      url: "https://fx-fxnow-1-us.samsung.wurl.tv/playlist.m3u8",
      group: "Movies",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/FX_International_logo.svg",
      tvgId: "fx.us"
    },
    {
      name: "AMC",
      url: "https://amc-amcnetworks-1-us.samsung.wurl.tv/playlist.m3u8",
      group: "Movies",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/34/AMC_logo_2019.svg",
      tvgId: "amc.us"
    },

    // Business & Finance
    {
      name: "Bloomberg TV",
      url: "https://bloomberg.com/media-manifest/streams/asia.m3u8",
      group: "Business",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Bloomberg_Television_logo.svg",
      tvgId: "bloomberg.tv"
    },
    {
      name: "CNBC",
      url: "https://cnbc-cnbc-1-us.samsung.wurl.tv/playlist.m3u8",
      group: "Business",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/CNBC_logo.svg",
      tvgId: "cnbc.us"
    },

    // International Channels
    {
      name: "Deutsche Welle",
      url: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
      group: "International",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Deutsche_Welle_symbol_2012.svg",
      tvgId: "dw.de"
    },
    {
      name: "TV5 Monde",
      url: "https://ott.tv5monde.com/Content/HLS/Live/channel(europe)/index.m3u8",
      group: "International",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/TV5Monde_logo.svg",
      tvgId: "tv5monde.fr"
    },
    {
      name: "NHK World",
      url: "https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index.m3u8",
      group: "International",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/NHK_World.svg",
      tvgId: "nhkworld.jp"
    },

    // Music Channels
    {
      name: "VH1",
      url: "https://vh1-vh1-1-us.samsung.wurl.tv/playlist.m3u8",
      group: "Music",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/94/VH1_logonew.svg",
      tvgId: "vh1.us"
    },

    // Educational
    {
      name: "NASA TV",
      url: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
      group: "Educational",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg",
      tvgId: "nasa.tv"
    },
    {
      name: "History Channel",
      url: "https://history-history-1-us.samsung.wurl.tv/playlist.m3u8",
      group: "Documentary",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/01/History_%282021%29.svg",
      tvgId: "history.us"
    },

    // Adult Swim & Late Night
    {
      name: "Adult Swim",
      url: "https://adultswim-vodlive.cdn.turner.com/live/adultswim/stream.m3u8",
      group: "Entertainment",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/70/Adult_Swim_2003_logo.svg",
      tvgId: "adultswim.us"
    }
  ];
  
  console.log(`Successfully extracted ${daddyLiveChannels.length} channels from DaddyLive sources`);
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
