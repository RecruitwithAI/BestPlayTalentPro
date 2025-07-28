import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Target,
  Clock,
  Award,
  Star,
  Zap,
  Crown,
  Gift,
  TrendingUp
} from 'lucide-react';

const Contests = () => {
  const [selectedTab, setSelectedTab] = useState("active");

  const activeContests = [
    {
      id: 1,
      title: "Weekly Speed Challenge",
      description: "Complete objectives in the fastest time possible",
      prize: "$500 + Gaming Gear",
      participants: 234,
      maxParticipants: 500,
      timeLeft: "2 days 14 hours",
      difficulty: "Medium",
      category: "Speed",
      entryFee: "Free",
      status: "Active"
    },
    {
      id: 2,
      title: "Strategy Masters Tournament",
      description: "Advanced strategic gameplay competition",
      prize: "$2,000 + Pro Gaming Setup",
      participants: 89,
      maxParticipants: 100,
      timeLeft: "6 hours",
      difficulty: "Expert",
      category: "Strategy",
      entryFee: "$10",
      status: "Closing Soon"
    },
    {
      id: 3,
      title: "Community Showcase",
      description: "Show off your best gameplay moments",
      prize: "Recognition + $200",
      participants: 156,
      maxParticipants: 1000,
      timeLeft: "1 week",
      difficulty: "All Levels",
      category: "Showcase",
      entryFee: "Free",
      status: "Active"
    }
  ];

  const upcomingContests = [
    {
      id: 4,
      title: "Monthly Championship",
      description: "The biggest tournament of the month",
      prize: "$10,000 + Championship Title",
      startDate: "Next Monday",
      difficulty: "Expert",
      category: "Championship"
    },
    {
      id: 5,
      title: "Rookie Cup",
      description: "Tournament for new players",
      prize: "$500 + Training Package",
      startDate: "This Weekend",
      difficulty: "Beginner",
      category: "Rookie"
    }
  ];

  const myContests = [
    {
      id: 6,
      title: "Speed Challenge #23",
      position: 12,
      totalParticipants: 234,
      status: "In Progress",
      timeLeft: "2 days"
    },
    {
      id: 7,
      title: "Strategy Tournament #8",
      position: 3,
      totalParticipants: 89,
      status: "Completed",
      prize: "Bronze Medal + $50"
    }
  ];

  const leaderboard = [
    { rank: 1, name: "ChampionPlayer", points: 2847, streak: 12 },
    { rank: 2, name: "GameMaster_Pro", points: 2156, streak: 8 },
    { rank: 3, name: "SkillSeeker", points: 1923, streak: 5 },
    { rank: 4, name: "You", points: 1847, streak: 3 },
    { rank: 5, name: "ProGamer", points: 1734, streak: 7 },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-accent text-accent-foreground';
      case 'Medium': return 'bg-secondary text-secondary-foreground';
      case 'Expert': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-accent text-accent-foreground';
      case 'Closing Soon': return 'bg-destructive text-destructive-foreground animate-pulse';
      case 'In Progress': return 'bg-secondary text-secondary-foreground';
      case 'Completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Epic <span className="text-gradient">Contests</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compete against the best players worldwide. Win prizes, earn recognition, 
            and climb the global leaderboards.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">127</div>
              <div className="text-sm text-muted-foreground">Active Contests</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">15.2K</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Gift className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">$125K</div>
              <div className="text-sm text-muted-foreground">Total Prizes</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Crown className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">#2,156</div>
              <div className="text-sm text-muted-foreground">Your Rank</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
                <TabsTrigger value="active">Active Contests</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="my-contests">My Contests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-6">
                {activeContests.map((contest) => (
                  <Card 
                    key={contest.id} 
                    className="group bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-smooth"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-xl mb-2">{contest.title}</h3>
                          <p className="text-muted-foreground mb-3">{contest.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getDifficultyColor(contest.difficulty)}>
                              {contest.difficulty}
                            </Badge>
                            <Badge variant="outline">{contest.category}</Badge>
                            <Badge 
                              variant={contest.entryFee === "Free" ? "secondary" : "outline"}
                            >
                              {contest.entryFee}
                            </Badge>
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(contest.status)}>
                          {contest.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center space-x-1 text-muted-foreground">
                            <Gift className="h-4 w-4" />
                            <span>Prize: <strong className="text-accent">{contest.prize}</strong></span>
                          </span>
                          <span className="flex items-center space-x-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{contest.timeLeft} left</span>
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Participants</span>
                            <span>{contest.participants}/{contest.maxParticipants}</span>
                          </div>
                          <Progress 
                            value={(contest.participants / contest.maxParticipants) * 100} 
                            className="h-2"
                          />
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button variant="gaming" className="flex-1">
                            <Target className="h-4 w-4 mr-2" />
                            Enter Contest
                          </Button>
                          <Button variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="upcoming" className="space-y-6">
                {upcomingContests.map((contest) => (
                  <Card 
                    key={contest.id} 
                    className="group bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-smooth"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-xl mb-2">{contest.title}</h3>
                          <p className="text-muted-foreground mb-3">{contest.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getDifficultyColor(contest.difficulty)}>
                              {contest.difficulty}
                            </Badge>
                            <Badge variant="outline">{contest.category}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center space-x-1 text-muted-foreground">
                            <Gift className="h-4 w-4" />
                            <span>Prize: <strong className="text-accent">{contest.prize}</strong></span>
                          </span>
                          <span className="flex items-center space-x-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Starts {contest.startDate}</span>
                          </span>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button variant="secondary" className="flex-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            Set Reminder
                          </Button>
                          <Button variant="outline">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="my-contests" className="space-y-6">
                {myContests.map((contest) => (
                  <Card 
                    key={contest.id} 
                    className="group bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-smooth"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-xl mb-2">{contest.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Position: <strong className="text-accent">#{contest.position}</strong></span>
                            <span>of {contest.totalParticipants} players</span>
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(contest.status)}>
                          {contest.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        {contest.status === "Completed" && contest.prize && (
                          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                            <div className="flex items-center space-x-2">
                              <Award className="h-5 w-5 text-accent" />
                              <span className="text-accent font-medium">Reward: {contest.prize}</span>
                            </div>
                          </div>
                        )}
                        
                        {contest.status === "In Progress" && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Time remaining</span>
                            <span className="font-medium">{contest.timeLeft}</span>
                          </div>
                        )}
                        
                        <div className="flex space-x-3">
                          <Button variant="outline" className="flex-1">
                            View Details
                          </Button>
                          {contest.status === "In Progress" && (
                            <Button variant="gaming">
                              Continue
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Global Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((player, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-smooth ${
                        player.name === "You" 
                          ? "bg-primary/10 border border-primary/20" 
                          : "bg-background/30 hover:bg-background/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                        {player.rank <= 3 ? (
                          <Crown className="h-4 w-4 text-primary" />
                        ) : (
                          <span className="text-sm font-bold">{player.rank}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{player.name}</p>
                        <p className="text-xs text-muted-foreground">{player.points} points</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-3 w-3 text-accent" />
                        <span className="text-xs">{player.streak}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Achievement */}
            <Card className="bg-gradient-primary/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Achievement Unlocked!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Win 3 more contests to unlock "Contest Champion" badge
                </p>
                <Progress value={66} className="mb-4" />
                <Button variant="gaming" size="sm" className="w-full">
                  View All Achievements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contests;