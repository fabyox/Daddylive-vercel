import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, Globe, Play, Settings, AlertTriangle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChannelCustomizer } from "@/components/ChannelCustomizer";
import { M3UPreview } from "@/components/M3UPreview";
import { StreamExtractor } from "@/components/StreamExtractor";
import { generateM3U, extractStreams, Channel } from "@/lib/m3u-utils";

const Index = () => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [m3uContent, setM3uContent] = useState('');
  const [activeTab, setActiveTab] = useState('extract');
  const { toast } = useToast();

  const handleExtractStreams = async () => {
    if (!sourceUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid DaddyLive mirror URL to extract streams from.",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    try {
      const extractedChannels = await extractStreams(sourceUrl);
      setChannels(extractedChannels);
      const generatedM3U = generateM3U(extractedChannels);
      setM3uContent(generatedM3U);
      setActiveTab('customize');
      
      toast({
        title: "DaddyLive Streams Extracted",
        description: `Found ${extractedChannels.length} channels from DaddyLive`,
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "Unable to extract streams from the provided DaddyLive URL.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const updateChannel = (index: number, updatedChannel: Channel) => {
    const newChannels = [...channels];
    newChannels[index] = updatedChannel;
    setChannels(newChannels);
    setM3uContent(generateM3U(newChannels));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(m3uContent);
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
    const blob = new Blob([m3uContent], { type: 'application/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daddylive-playlist.m3u';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "DaddyLive M3U playlist file downloaded successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Play className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              DaddyLive M3U Generator
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Extract streaming URLs from DaddyLive mirrors, customize channel metadata, and generate professional M3U playlists
          </p>
        </div>

        {/* Disclaimer */}
        <Alert className="mb-8 border-amber-500/20 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            ⚠️ For educational or metadata testing only. This site does not host or stream any content.
          </AlertDescription>
        </Alert>

        {/* Main Interface */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
              <TabsTrigger value="extract" className="data-[state=active]:bg-blue-600">
                <Globe className="h-4 w-4 mr-2" />
                Extract
              </TabsTrigger>
              <TabsTrigger value="customize" disabled={channels.length === 0} className="data-[state=active]:bg-blue-600">
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={!m3uContent} className="data-[state=active]:bg-blue-600">
                <Play className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="export" disabled={!m3uContent} className="data-[state=active]:bg-blue-600">
                <Download className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="extract" className="space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    DaddyLive Stream Extraction
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Enter a DaddyLive mirror URL to extract M3U stream URLs and channel information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-url" className="text-white">DaddyLive Mirror URL</Label>
                    <Input
                      id="source-url"
                      placeholder="https://daddylive-hd.com or any DaddyLive mirror"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <Button 
                    onClick={handleExtractStreams}
                    disabled={isExtracting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isExtracting ? 'Extracting DaddyLive Streams...' : 'Extract DaddyLive Streams'}
                  </Button>
                </CardContent>
              </Card>

              <StreamExtractor />
            </TabsContent>

            <TabsContent value="customize" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">Channel Customization</h3>
                  <p className="text-slate-400">Customize channel names, logos, and metadata</p>
                </div>
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  {channels.length} Channels
                </Badge>
              </div>
              
              <ChannelCustomizer 
                channels={channels}
                onUpdateChannel={updateChannel}
              />
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">M3U Preview</h3>
                  <p className="text-slate-400">Live preview of your generated playlist</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" onClick={downloadM3U}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <M3UPreview content={m3uContent} />
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Export Options</CardTitle>
                  <CardDescription className="text-slate-400">
                    Download or deploy your M3U playlist
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={downloadM3U} className="h-20 flex-col">
                      <Download className="h-8 w-8 mb-2" />
                      Download M3U File
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col border-slate-600 hover:bg-slate-700"
                      onClick={() => window.open('https://vercel.com/new', '_blank')}
                    >
                      <ExternalLink className="h-8 w-8 mb-2" />
                      Deploy to Vercel
                    </Button>
                  </div>
                  
                  <Separator className="bg-slate-700" />
                  
                  <div className="space-y-3">
                    <Label className="text-white">Quick Actions</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy to Clipboard
                      </Button>
                      <Button size="sm" variant="secondary">
                        Generate QR Code
                      </Button>
                      <Button size="sm" variant="secondary">
                        Share Link
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
