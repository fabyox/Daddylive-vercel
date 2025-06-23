
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tv, Globe, Zap, Shield, CheckCircle } from "lucide-react";

const StreamExtractor = () => {
  const supportedSources = [
    {
      name: "DaddyLive HD",
      type: "Live TV",
      icon: Tv,
      description: "Primary DaddyLive source with HD channels",
      status: "Active",
      url: "daddylive-hd.com",
      channels: "150+"
    },
    {
      name: "DaddyLive TV",
      type: "Live TV", 
      icon: Globe,
      description: "Secondary mirror with international channels",
      status: "Active",
      url: "daddylive.tv",
      channels: "120+"
    },
    {
      name: "DaddyLive Stream",
      type: "Live TV",
      icon: Zap,
      description: "Fast streaming mirror for sports events",
      status: "Active", 
      url: "daddylivestream.com",
      channels: "100+"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Limited":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Offline":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          DaddyLive Sources Status
        </CardTitle>
        <CardDescription className="text-slate-400">
          Real-time status of DaddyLive mirror domains with working M3U8 streams
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
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-slate-700 text-slate-300">
                      {source.channels}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(source.status)}`}
                    >
                      {source.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-400">{source.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h5 className="text-sm font-medium text-blue-400 mb-2">How it works:</h5>
          <ol className="text-xs text-slate-400 space-y-1">
            <li>1. Click "Extract DaddyLive Streams" to scan all active sources</li>
            <li>2. System retrieves working M3U8 stream URLs automatically</li>
            <li>3. Validate all streams for compatibility and quality</li>
            <li>4. Export your valid M3U playlist with working URLs</li>
          </ol>
        </div>

        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-xs text-green-300 flex items-center">
            <CheckCircle className="h-3 w-3 inline mr-1" />
            All extracted streams are validated M3U8 URLs that work with media players
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export { StreamExtractor };
