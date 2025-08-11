
import SignupLoginButton from '@/components/SignupLoginButton';
import { Card, CardContent } from '@/components/ui/card';
import ThreeBackground from '@/components/ThreeBackground';
import { 
  Zap, 
  Users, 
  Trophy, 
  GraduationCap,
  Sparkles,
  Play
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Tools",
      description: "Advanced AI tools to enhance your recruiting skills and candidate analysis",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Live Collaboration",
      description: "Real-time collaborative recruiting sessions with TA professionals worldwide",
      color: "text-secondary"
    },
    {
      icon: Trophy,
      title: "Recruiting Challenges",
      description: "Compete in contests and challenges to prove your recruiting expertise",
      color: "text-accent"
    },
    {
      icon: GraduationCap,
      title: "Skill Training",
      description: "Structured learning paths and training modules for all experience levels",
      color: "text-primary"
    }
  ];

  const stats = [
    { label: "Active Recruiters", value: "25K+", icon: Users },
    { label: "AI Tools", value: "50+", icon: Zap },
    { label: "Live Sessions", value: "1K+", icon: Play },
    { label: "Challenges Completed", value: "500+", icon: Trophy },
  ];

  return (
    <div className="min-h-screen">
      <ThreeBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="container mx-auto px-6 text-center z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6 animate-fade-in-up">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">The Ultimate Recruiting Community</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
              Level Up Your Recruiting with{' '}
              <span className="text-gradient-hero">TalentPro Hub</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up">
              Join the most advanced recruiting community platform. Master new skills with AI-powered tools, 
              compete in challenges, and connect with TA professionals worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up">
              <SignupLoginButton to="/register" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in-up">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-smooth">
                    <CardContent className="p-6 text-center">
                      <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gradient mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="text-gradient">Dominate</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with community-driven features 
              to create the ultimate recruiting experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-smooth hover:transform hover:scale-105 hover:glow-primary"
                >
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-smooth">
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to{' '}
              <span className="text-gradient-secondary">Join the Elite</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with recruiters across the globe, master new strategies with AI, 
              and compete in the most exciting recruiting challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignupLoginButton to="/register" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;