
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tv } from "lucide-react";

const StreamExtractor = () => {
  const supportedSources = [
    {
      name: "DaddyLive HD",
      type: "Live TV",
      icon: Tv,
      description: "Extract live TV channels from DaddyLive HD mirror",
      status: "Supported",
      url: "daddylive-hd.com"
    },
    {
      name: "DaddyLive TV",
      type: "Live TV", 
      icon: Tv,
      description: "Extract channels from DaddyLive TV mirror",
      status: "Supported",
      url: "daddylive.tv"
    },
    {
      name: "DaddyLive Stream",
      type: "Live TV",
      icon: Tv,
      description: "Extract from DaddyLive streaming mirror",
      status: "Supported", 
      url: "daddylivestream.com"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Supported":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Beta":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Coming Soon":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">DaddyLive Sources</CardTitle>
        <CardDescription className="text-slate-400">
          Supported DaddyLive mirror domains for stream extraction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {supportedSources.map((source, index) => {
            const IconComponent = source.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-600/50 rounded-lg">
                      <IconComponent className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{source.name}</h4>
                      <p className="text-sm text-slate-400">{source.url}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(source.status)}`}
                  >
                    {source.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">{source.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h5 className="text-sm font-medium text-blue-400 mb-2">How to use:</h5>
          <ol className="text-xs text-slate-400 space-y-1">
            <li>1. Enter any DaddyLive mirror URL above</li>
            <li>2. Click "Extract Streams" to crawl channel listings</li>
            <li>3. Customize channel names and metadata</li>
            <li>4. Export your personalized M3U playlist</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export { StreamExtractor };
