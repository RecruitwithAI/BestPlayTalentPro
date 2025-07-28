import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Users, 
  Trophy, 
  GraduationCap,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Activity,
  Star,
  PlayCircle,
  Brain
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: "Skills Mastered", value: 12, total: 20, icon: GraduationCap, color: "text-primary" },
    { label: "Contests Won", value: 8, total: 15, icon: Trophy, color: "text-accent" },
    { label: "AI Tools Used", value: 25, total: 50, icon: Zap, color: "text-secondary" },
    { label: "Jam Sessions", value: 34, total: 50, icon: Users, color: "text-primary" },
  ];

  const recentActivities = [
    { action: "Completed Advanced Strategy Training", time: "2 hours ago", icon: GraduationCap },
    { action: "Won Weekly Speed Contest", time: "1 day ago", icon: Trophy },
    { action: "Joined Live Jam Session", time: "2 days ago", icon: Users },
    { action: "Used AI Skill Analyzer", time: "3 days ago", icon: Brain },
  ];

  const upcomingEvents = [
    { name: "Monthly Championship", date: "Tomorrow", participants: "500+" },
    { name: "AI Workshop", date: "This Weekend", participants: "50+" },
    { name: "Community Jam", date: "Next Week", participants: "200+" },
  ];

  const quickActions = [
    { title: "AI Strategy Coach", description: "Get personalized gameplay tips", icon: Brain, href: "/ai-tools" },
    { title: "Join Live Session", description: "Connect with players now", icon: PlayCircle, href: "/live-jam" },
    { title: "Enter Contest", description: "Compete for prizes", icon: Trophy, href: "/contests" },
    { title: "Continue Training", description: "Complete your modules", icon: Target, href: "/training" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="text-gradient">TA Pro</span>! 🎮
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to level up? Here's what's happening in your Talent Acquisition journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const percentage = (stat.value / stat.total) * 100;
            return (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                    <Badge variant="secondary" className="text-xs">
                      {stat.value}/{stat.total}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}% Complete</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>
                  Jump into your favorite activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 justify-start bg-background/50 border-border/50 hover:bg-accent/50 group"
                        asChild
                      >
                        <a href={action.href}>
                          <div className="flex items-start space-x-3">
                            <Icon className="h-6 w-6 text-primary mt-1 group-hover:scale-110 transition-transform" />
                            <div className="text-left">
                              <p className="font-medium">{action.title}</p>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                          </div>
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-secondary" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-smooth">
                        <Icon className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Chart */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <span>Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Skill Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-accent fill-current" />
                      <span className="font-bold text-gradient">1,847</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Global Rank</span>
                    <Badge variant="secondary">#2,156</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Win Rate</span>
                    <span className="font-bold text-accent">73.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-smooth">
                      <p className="font-medium text-sm">{event.name}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                      <p className="text-xs text-accent">{event.participants} players</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card className="bg-gradient-primary/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Level Up!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete 3 more training modules to unlock Elite status
                </p>
                <Button variant="gaming" size="sm">
                  Continue Training
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;