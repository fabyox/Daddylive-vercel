
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Download, Eye, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface M3UPreviewProps {
  content: string;
}

const M3UPreview = ({ content }: M3UPreviewProps) => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "M3U content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadM3U = () => {
    const blob = new Blob([content], { type: 'application/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playlist.m3u';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "M3U playlist file downloaded successfully",
    });
  };

  const parseM3UContent = () => {
    const lines = content.split('\n');
    const channels = [];
    let currentChannel: any = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        // Parse channel info
        const match = line.match(/#EXTINF:(-?\d+)(?:\s+(.+?))?,(.+)/);
        if (match) {
          currentChannel = {
            duration: match[1],
            attributes: match[2] || '',
            name: match[3] || 'Unknown Channel'
          };
        }
      } else if (line && !line.startsWith('#') && currentChannel.name) {
        // This is the URL line
        currentChannel.url = line;
        channels.push(currentChannel);
        currentChannel = {};
      }
    }

    return channels;
  };

  const channels = parseM3UContent();

  if (!content) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Eye className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No M3U content to preview</p>
            <p className="text-sm text-slate-500">Generate content from extracted streams</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-white">M3U Preview</CardTitle>
              <Badge variant="outline" className="bg-slate-700 text-slate-300">
                {channels.length} Channels
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex border border-slate-600 rounded-lg p-1 bg-slate-700/30">
                <Button
                  size="sm"
                  variant={viewMode === 'formatted' ? 'default' : 'ghost'}
                  className="h-8 px-3"
                  onClick={() => setViewMode('formatted')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Formatted
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'raw' ? 'default' : 'ghost'}
                  className="h-8 px-3"
                  onClick={() => setViewMode('raw')}
                >
                  <Code className="h-4 w-4 mr-1" />
                  Raw
                </Button>
              </div>
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button size="sm" onClick={downloadM3U}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'formatted' ? (
            <ScrollArea className="h-96 w-full rounded-md border border-slate-600 bg-slate-900/50">
              <div className="p-4 space-y-3">
                {channels.map((channel, index) => (
                  <div key={index} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{channel.name}</h4>
                      <Badge variant="outline" className="text-xs bg-slate-700 text-slate-300">
                        Channel {index + 1}
                      </Badge>
                    </div>
                    {channel.attributes && (
                      <p className="text-sm text-slate-400 mb-2">{channel.attributes}</p>
                    )}
                    <div className="bg-slate-900/50 p-2 rounded text-xs text-green-400 font-mono break-all">
                      {channel.url}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <ScrollArea className="h-96 w-full rounded-md border border-slate-600 bg-slate-900/50">
              <pre className="p-4 text-sm text-slate-300 font-mono whitespace-pre-wrap">
                {content}
              </pre>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { M3UPreview };
