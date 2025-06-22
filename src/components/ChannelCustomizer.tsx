
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Edit3, Image, Link, Trash2, Plus } from "lucide-react";
import { Channel } from "@/lib/m3u-utils";

interface ChannelCustomizerProps {
  channels: Channel[];
  onUpdateChannel: (index: number, channel: Channel) => void;
}

const ChannelCustomizer = ({ channels, onUpdateChannel }: ChannelCustomizerProps) => {
  const [expandedChannel, setExpandedChannel] = useState<number | null>(null);

  const handleChannelUpdate = (index: number, field: keyof Channel, value: string) => {
    const updatedChannel = { ...channels[index], [field]: value };
    onUpdateChannel(index, updatedChannel);
  };

  const addBackupUrl = (channelIndex: number) => {
    const channel = channels[channelIndex];
    const updatedChannel = {
      ...channel,
      backupUrls: [...(channel.backupUrls || []), '']
    };
    onUpdateChannel(channelIndex, updatedChannel);
  };

  const updateBackupUrl = (channelIndex: number, backupIndex: number, url: string) => {
    const channel = channels[channelIndex];
    const backupUrls = [...(channel.backupUrls || [])];
    backupUrls[backupIndex] = url;
    const updatedChannel = { ...channel, backupUrls };
    onUpdateChannel(channelIndex, updatedChannel);
  };

  const removeBackupUrl = (channelIndex: number, backupIndex: number) => {
    const channel = channels[channelIndex];
    const backupUrls = (channel.backupUrls || []).filter((_, i) => i !== backupIndex);
    const updatedChannel = { ...channel, backupUrls };
    onUpdateChannel(channelIndex, updatedChannel);
  };

  if (channels.length === 0) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Edit3 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No channels to customize yet</p>
            <p className="text-sm text-slate-500">Extract streams first to start customizing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {channels.map((channel, index) => (
        <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center overflow-hidden">
                  {channel.logo ? (
                    <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
                  ) : (
                    <Image className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-white text-lg">{channel.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-slate-700 text-slate-300">
                      {channel.group || 'General'}
                    </Badge>
                    {channel.tvgId && (
                      <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                        EPG: {channel.tvgId}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedChannel(expandedChannel === index ? null : index)}
                className="text-slate-400 hover:text-white"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {expandedChannel === index && (
            <CardContent className="pt-0">
              <Separator className="mb-4 bg-slate-700" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`name-${index}`} className="text-white text-sm">Channel Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={channel.name}
                      onChange={(e) => handleChannelUpdate(index, 'name', e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`group-${index}`} className="text-white text-sm">Group</Label>
                    <Input
                      id={`group-${index}`}
                      value={channel.group || ''}
                      onChange={(e) => handleChannelUpdate(index, 'group', e.target.value)}
                      placeholder="e.g., Sports, News, Entertainment"
                      className="bg-slate-700/50 border-slate-600 text-white mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`tvgId-${index}`} className="text-white text-sm">TVG ID (EPG)</Label>
                    <Input
                      id={`tvgId-${index}`}
                      value={channel.tvgId || ''}
                      onChange={(e) => handleChannelUpdate(index, 'tvgId', e.target.value)}
                      placeholder="Electronic Program Guide ID"
                      className="bg-slate-700/50 border-slate-600 text-white mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`logo-${index}`} className="text-white text-sm">Logo URL</Label>
                    <Input
                      id={`logo-${index}`}
                      value={channel.logo || ''}
                      onChange={(e) => handleChannelUpdate(index, 'logo', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="bg-slate-700/50 border-slate-600 text-white mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`url-${index}`} className="text-white text-sm">Stream URL</Label>
                    <Textarea
                      id={`url-${index}`}
                      value={channel.url}
                      onChange={(e) => handleChannelUpdate(index, 'url', e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white mt-1 h-20 resize-none"
                      placeholder="Stream URL"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white text-sm">Backup URLs</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addBackupUrl(index)}
                    className="border-slate-600 hover:bg-slate-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Backup
                  </Button>
                </div>
                
                {(channel.backupUrls || []).map((backupUrl, backupIndex) => (
                  <div key={backupIndex} className="flex gap-2 mb-2">
                    <Input
                      value={backupUrl}
                      onChange={(e) => updateBackupUrl(index, backupIndex, e.target.value)}
                      placeholder={`Backup URL ${backupIndex + 1}`}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeBackupUrl(index, backupIndex)}
                      className="border-slate-600 hover:bg-red-500/20 hover:border-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export { ChannelCustomizer };
