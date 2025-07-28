import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Play, 
  Clock, 
  Globe,
  Mic,
  MicOff,
  Video,
  VideoOff,
  UserPlus,
  Settings,
  Heart,
  MessageCircle,
  Calendar
} from 'lucide-react';

const LiveJam = () => {
  const [isInSession, setIsInSession] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const liveSessions = [
    {
      id: 1,
      title: "Pro Strategy Breakdown",
      host: "GameMaster_Pro",
      participants: 47,
      maxParticipants: 50,
      game: "Competitive FPS",
      duration: "2h 15m",
      status: "Live",
      tags: ["Strategy", "Advanced", "Coaching"],
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Beginner-Friendly Practice",
      host: "TeachGaming101",
      participants: 23,
      maxParticipants: 30,
      game: "MOBA",
      duration: "1h 30m",
      status: "Live",
      tags: ["Beginner", "Practice", "Learning"],
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Speed Running Techniques",
      host: "SpeedDemon",
      participants: 15,
      maxParticipants: 20,
      game: "Platformer",
      duration: "45m",
      status: "Live",
      tags: ["Speedrun", "Techniques", "Advanced"],
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Team Building Workshop",
      host: "CoachCommunity",
      participants: 8,
      maxParticipants: 12,
      game: "Team Sports",
      duration: "Starting Soon",
      status: "Starting Soon",
      tags: ["Teamwork", "Communication", "Workshop"],
      avatar: "/placeholder.svg"
    }
  ];

  const upcomingEvents = [
    {
      title: "Weekly Tournament Prep",
      time: "Tomorrow 7:00 PM",
      host: "TournamentKing"
    },
    {
      title: "Meta Discussion",
      time: "Friday 6:00 PM", 
      host: "MetaAnalyst"
    },
    {
      title: "Community Showcase",
      time: "Saturday 3:00 PM",
      host: "ShowcaseHost"
    }
  ];

  const joinSession = (sessionId: number) => {
    setIsInSession(true);
    console.log(`Joining session ${sessionId}`);
  };

  const leaveSession = () => {
    setIsInSession(false);
  };

  if (isInSession) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-8">
        <div className="container mx-auto px-6">
          {/* Live Session Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Video Area */}
            <div className="lg:col-span-3">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-6">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Live Gaming Session</h3>
                      <p className="text-muted-foreground">Pro Strategy Breakdown in progress</p>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant={isMuted ? "destructive" : "secondary"}
                        size="icon"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant={!isVideoOn ? "destructive" : "secondary"}
                        size="icon"
                        onClick={() => setIsVideoOn(!isVideoOn)}
                      >
                        {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">47 participants</span>
                      </div>
                      <Button variant="destructive" onClick={leaveSession}>
                        Leave Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Chat & Participants */}
            <div className="space-y-6">
              {/* Participants */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Participants (47)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>P{i + 1}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Player_{i + 1}</span>
                        {i === 0 && <Badge variant="secondary" className="text-xs">Host</Badge>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Chat */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 h-64 overflow-y-auto mb-4">
                    <div className="text-sm">
                      <span className="font-medium text-primary">GameMaster_Pro:</span>
                      <span className="ml-2">Welcome everyone! Let's start with positioning basics.</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-secondary">Player_23:</span>
                      <span className="ml-2">Great session so far!</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-accent">SkillSeeker:</span>
                      <span className="ml-2">Can you explain the rotation strategy again?</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-background/50 border border-border rounded-md text-sm"
                    />
                    <Button size="sm">Send</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Live <span className="text-gradient">Jam Sessions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join live gaming sessions with players worldwide. Learn, practice, and compete 
            in real-time collaborative environments.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">1,247</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Play className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">23</div>
              <div className="text-sm text-muted-foreground">Live Sessions</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Globe className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">45</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Always Active</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Sessions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Live Sessions</h2>
              <Button variant="gaming">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Session
              </Button>
            </div>
            
            <div className="space-y-6">
              {liveSessions.map((session) => (
                <Card 
                  key={session.id} 
                  className="group bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-smooth"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={session.avatar} />
                          <AvatarFallback>{session.host[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg mb-1">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Hosted by <span className="text-primary">{session.host}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">{session.game}</p>
                        </div>
                      </div>
                      
                      <Badge 
                        className={session.status === 'Live' ? 'bg-accent text-accent-foreground animate-pulse' : 'bg-secondary text-secondary-foreground'}
                      >
                        {session.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {session.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{session.participants}/{session.maxParticipants}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{session.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant={session.status === 'Live' ? 'gaming' : 'secondary'}
                          onClick={() => joinSession(session.id)}
                          disabled={session.participants >= session.maxParticipants}
                        >
                          {session.status === 'Live' ? 'Join Live' : 'Join When Ready'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-smooth">
                      <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                      <p className="text-xs text-muted-foreground mb-1">{event.time}</p>
                      <p className="text-xs text-primary">by {event.host}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Join */}
            <Card className="bg-gradient-secondary/10 border-secondary/20">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-secondary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Quick Match</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Jump into the next available session that matches your skill level
                </p>
                <Button variant="neon" className="w-full">
                  Find Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveJam;