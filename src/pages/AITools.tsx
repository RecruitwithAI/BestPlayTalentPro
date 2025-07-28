import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  Zap, 
  TrendingUp,
  Eye,
  BarChart3,
  Lightbulb,
  Bot,
  Sparkles
} from 'lucide-react';

const AITools = () => {
  const tools = [
    {
      id: 1,
      name: "Strategy Analyzer",
      description: "AI-powered analysis of your recruiting patterns and strategic decisions",
      icon: Brain,
      category: "Analysis",
      features: ["Recruiting Pattern Recognition", "Strategic Recommendations", "Performance Metrics"],
      status: "Available",
      premium: false
    },
    {
      id: 2,
      name: "Skill Predictor",
      description: "Predict your performance in upcoming contests based on current form",
      icon: Target,
      category: "Prediction",
      features: ["Match Outcome Prediction", "Skill Rating Forecast", "Improvement Timeline"],
      status: "Available",
      premium: true
    },
    {
      id: 3,
      name: "Real-time Coach",
      description: "Live AI coaching during recruiting simulation contest with instant feedback and tips",
      icon: Zap,
      category: "Coaching",
      features: ["Live Feedback", "Tactical Suggestions", "Decision Support"],
      status: "Beta",
      premium: true
    },
    {
      id: 4,
      name: "Performance Insights",
      description: "Deep dive analytics into your recruiting performance trends",
      icon: TrendingUp,
      category: "Analytics",
      features: ["Trend Analysis", "Weakness Identification", "Progress Tracking"],
      status: "Available",
      premium: false
    },
    {
      id: 5,
      name: "Opponent Scanner",
      description: "Analyze opponent patterns",
      icon: Eye,
      category: "Reconnaissance",
      features: ["Player Profiling", "Behavior Prediction", "Counter-strategy Generation"],
      status: "Coming Soon",
      premium: true
    },
    {
      id: 6,
      name: "Meta Tracker",
      description: "Stay ahead of game meta changes with AI-powered trend detection",
      icon: BarChart3,
      category: "Trends",
      features: ["Meta Analysis", "Trend Forecasting", "Adaptation Strategies"],
      status: "Available",
      premium: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-accent text-accent-foreground';
      case 'Beta': return 'bg-secondary text-secondary-foreground';
      case 'Coming Soon': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleToolLaunch = (toolName: string) => {
    // This would integrate with your AI backend
    console.log(`Launching ${toolName}...`);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI-Powered <span className="text-gradient">Recruiting AI Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Harness the power of artificial intelligence to analyze, predict, and enhance 
            your gaming performance like never before.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Bot className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">25+</div>
              <div className="text-sm text-muted-foreground">AI Tools</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Brain className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">Analyses Run</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">89%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Lightbulb className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">1M+</div>
              <div className="text-sm text-muted-foreground">Insights Generated</div>
            </CardContent>
          </Card>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={tool.id} 
                className="group bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-smooth hover:transform hover:scale-105 hover:glow-primary"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(tool.status)}>
                        {tool.status}
                      </Badge>
                      {tool.premium && (
                        <Badge variant="outline" className="text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl mb-2">{tool.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Key Features:</p>
                      <ul className="space-y-1">
                        {tool.features.map((feature, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-center">
                            <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={() => handleToolLaunch(tool.name)}
                      disabled={tool.status === 'Coming Soon'}
                      variant={tool.premium ? "gaming" : "secondary"}
                      className="w-full"
                    >
                      {tool.status === 'Coming Soon' ? 'Coming Soon' : 
                       tool.status === 'Beta' ? 'Try Beta' : 'Launch Tool'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-primary/10 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                Need a Custom AI Tool?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our AI development team can create specialized tools tailored to your 
                specific reruitment needs and strategies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gaming">
                  Request Custom Tool
                </Button>
                <Button variant="outline">
                  Join AI Beta Program
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AITools;