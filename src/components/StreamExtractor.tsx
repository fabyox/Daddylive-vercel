
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Tv, Radio, Film } from "lucide-react";

const StreamExtractor = () => {
  const supportedSources = [
    {
      name: "DaddyLive Mirrors",
      type: "Live TV",
      icon: Tv,
      description: "Extract live TV channel streams",
      status: "Supported"
    },
    {
      name: "M3U Playlists",
      type: "Playlist",
      icon: Radio,
      description: "Parse existing M3U files",
      status: "Supported"
    },
    {
      name: "Stream Directories",
      type: "Directory",
      icon: Globe,
      description: "Crawl streaming directories",
      status: "Beta"
    },
    {
      name: "Video Platforms",
      type: "Platform",
      icon: Film,
      description: "Extract from video platforms",
      status: "Coming Soon"
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
        <CardTitle className="text-white">Supported Sources</CardTitle>
        <CardDescription className="text-slate-400">
          Currently supported streaming sources and formats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <p className="text-sm text-slate-400">{source.type}</p>
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
      </CardContent>
    </Card>
  );
};

export { StreamExtractor };
