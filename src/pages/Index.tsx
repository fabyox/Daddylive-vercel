import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, Play, Settings, AlertTriangle, ExternalLink, Tv } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChannelCustomizer } from "@/components/ChannelCustomizer";
import { M3UPreview } from "@/components/M3UPreview";
import { StreamExtractor } from "@/components/StreamExtractor";
import { generateM3U, extractStreams, Channel } from "@/lib/m3u-utils";

const Index = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [m3uContent, setM3uContent] = useState('');
  const [activeTab, setActiveTab] = useState('extract');
  const [extractionProgress, setExtractionProgress] = useState(0);
  const { toast } = useToast();

  const handleExtractStreams = async () => {
    setIsExtracting(true);
    setExtractionProgress(0);
    
    try {
      // Simulate extraction progress
      const progressInterval = setInterval(() => {
        setExtractionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const extractedChannels = await extractStreams();
      
      clearInterval(progressInterval);
      setExtractionProgress(100);
      
      setChannels(extractedChannels);
      const generatedM3U = generateM3U(extractedChannels);
      setM3uContent(generatedM3U);
      
      setTimeout(() => {
        setActiveTab('customize');
        toast({
          title: "✅ Extraction Complete!",
          description: `Successfully extracted ${extractedChannels.length} live channels from DaddyLive sources`,
        });
      }, 500);
      
    } catch (error) {
      toast({
        title: "❌ Extraction Failed",
        description: error instanceof Error ? error.message : "Unable to extract streams from DaddyLive sources.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsExtracting(false);
        setExtractionProgress(0);
      }, 1000);
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
            Professional M3U playlist generator for DaddyLive channels with real-time extraction
          </p>
        </div>

        {/* Disclaimer */}
        <Alert className="mb-8 border-amber-500/20 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            ⚠️ For educational and metadata testing purposes only. This application does not host or distribute any content.
          </AlertDescription>
        </Alert>

        {/* Main Interface */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
              <TabsTrigger value="extract" className="data-[state=active]:bg-blue-600">
                <Tv className="h-4 w-4 mr-2" />
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
                    <Tv className="h-5 w-5" />
                    DaddyLive Stream Extraction
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Extract live stream URLs and channel data from active DaddyLive mirror sources
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleExtractStreams}
                    disabled={isExtracting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg"
                  >
                    {isExtracting ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Extracting DaddyLive Streams... {extractionProgress}%
                      </div>
                    ) : 'Extract DaddyLive Streams'}
                  </Button>
                  
                  {channels.length > 0 && (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-400 text-sm font-medium">
                        ✅ Successfully extracted {channels.length} live channels from DaddyLive sources
                      </p>
                      <p className="text-green-300 text-xs mt-1">
                        Channels include: Sports, News, Entertainment, and International content
                      </p>
                    </div>
                  )}
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
                    <div className="text-white font-medium">Quick Actions</div>
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
