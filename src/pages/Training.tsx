import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Target, 
  CheckCircle,
  Clock,
  Trophy,
  Users,
  Star,
  PlayCircle,
  BookOpen,
  Zap,
  Brain,
  Award
} from 'lucide-react';

const Training = () => {
  const [selectedTab, setSelectedTab] = useState("courses");

  const courses = [
    {
      id: 1,
      title: "Fundamentals Mastery",
      description: "Master the core mechanics and basic strategies",
      instructor: "ProTrainer_Mike",
      duration: "4 hours",
      lessons: 12,
      completed: 8,
      difficulty: "Beginner",
      category: "Fundamentals",
      rating: 4.9,
      students: 1247,
      price: "Free"
    },
    {
      id: 2,
      title: "Advanced Strategy",
      description: "Deep dive into complex strategies and game theory",
      instructor: "StrategyGuru",
      duration: "8 hours",
      lessons: 24,
      completed: 3,
      difficulty: "Advanced",
      category: "Strategy",
      rating: 4.8,
      students: 543,
      price: "$49"
    },
    {
      id: 3,
      title: "Psychology of Gaming",
      description: "Mental frameworks for peak performance",
      instructor: "MindCoach_Pro",
      duration: "6 hours",
      lessons: 18,
      completed: 0,
      difficulty: "Intermediate",
      category: "Psychology",
      rating: 4.7,
      students: 892,
      price: "$29"
    }
  ];

  const skills = [
    {
      name: "Reaction Time",
      level: 78,
      maxLevel: 100,
      category: "Mechanics"
    },
    {
      name: "Strategic Thinking",
      level: 65,
      maxLevel: 100,
      category: "Strategy"
    },
    {
      name: "Team Communication",
      level: 82,
      maxLevel: 100,
      category: "Social"
    },
    {
      name: "Resource Management",
      level: 54,
      maxLevel: 100,
      category: "Strategy"
    },
    {
      name: "Adaptability",
      level: 71,
      maxLevel: 100,
      category: "Mental"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Fast Learner",
      description: "Complete 5 courses in a month",
      progress: 3,
      total: 5,
      unlocked: false,
      icon: GraduationCap
    },
    {
      id: 2,
      title: "Skill Master",
      description: "Reach level 80 in any skill",
      progress: 82,
      total: 80,
      unlocked: true,
      icon: Target
    },
    {
      id: 3,
      title: "Community Mentor",
      description: "Help 10 other players",
      progress: 7,
      total: 10,
      unlocked: false,
      icon: Users
    }
  ];

  const practiceModules = [
    {
      id: 1,
      title: "Aim Training",
      description: "Improve your accuracy and reaction time",
      duration: "15 min",
      bestScore: 1247,
      category: "Mechanics",
      difficulty: "All Levels"
    },
    {
      id: 2,
      title: "Decision Making",
      description: "Practice quick strategic decisions",
      duration: "20 min",
      bestScore: 892,
      category: "Strategy",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Resource Optimization",
      description: "Master efficient resource management",
      duration: "25 min",
      bestScore: 1056,
      category: "Strategy",
      difficulty: "Advanced"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-accent text-accent-foreground';
      case 'Intermediate': return 'bg-secondary text-secondary-foreground';
      case 'Advanced': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSkillLevelColor = (level: number) => {
    if (level >= 80) return 'text-accent';
    if (level >= 60) return 'text-secondary';
    return 'text-primary';
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Skill <span className="text-gradient">Training</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Structured learning paths, practice modules, and skill tracking to help you 
            become a better player through focused training.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">156</div>
              <div className="text-sm text-muted-foreground">Courses Available</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">47h</div>
              <div className="text-sm text-muted-foreground">Training Time</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <CheckCircle className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">12</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient mb-1">85%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="courses" className="space-y-6">
                {courses.map((course) => {
                  const progressPercentage = (course.completed / course.lessons) * 100;
                  return (
                    <Card 
                      key={course.id} 
                      className="group bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-smooth"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl mb-2">{course.title}</h3>
                            <p className="text-muted-foreground mb-3">{course.description}</p>
                            <p className="text-sm text-muted-foreground mb-3">
                              by <span className="text-primary">{course.instructor}</span>
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge className={getDifficultyColor(course.difficulty)}>
                                {course.difficulty}
                              </Badge>
                              <Badge variant="outline">{course.category}</Badge>
                              <Badge variant={course.price === "Free" ? "secondary" : "outline"}>
                                {course.price}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              <Star className="h-4 w-4 text-accent fill-current" />
                              <span className="text-sm font-medium">{course.rating}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{course.students} students</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{course.duration} • {course.lessons} lessons</span>
                            <span>{course.completed}/{course.lessons} completed</span>
                          </div>
                          
                          <Progress value={progressPercentage} className="h-2" />
                          
                          <div className="flex space-x-3">
                            <Button 
                              variant={course.completed > 0 ? "gaming" : "secondary"} 
                              className="flex-1"
                            >
                              <PlayCircle className="h-4 w-4 mr-2" />
                              {course.completed > 0 ? "Continue" : "Start Course"}
                            </Button>
                            <Button variant="outline">
                              Preview
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
              
              <TabsContent value="practice" className="space-y-6">
                {practiceModules.map((module) => (
                  <Card 
                    key={module.id} 
                    className="group bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-smooth"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-xl mb-2">{module.title}</h3>
                          <p className="text-muted-foreground mb-3">{module.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getDifficultyColor(module.difficulty)}>
                              {module.difficulty}
                            </Badge>
                            <Badge variant="outline">{module.category}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Duration: {module.duration}</span>
                          <span className="text-muted-foreground">
                            Best Score: <span className="text-accent font-medium">{module.bestScore}</span>
                          </span>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button variant="gaming" className="flex-1">
                            <Target className="h-4 w-4 mr-2" />
                            Start Practice
                          </Button>
                          <Button variant="outline">
                            View Stats
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="achievements" className="space-y-6">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  const progressPercentage = (achievement.progress / achievement.total) * 100;
                  
                  return (
                    <Card 
                      key={achievement.id} 
                      className={`group bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-smooth ${
                        achievement.unlocked ? 'border-accent/50 bg-accent/5' : ''
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${
                            achievement.unlocked ? 'bg-accent/20' : 'bg-muted/20'
                          }`}>
                            <Icon className={`h-6 w-6 ${
                              achievement.unlocked ? 'text-accent' : 'text-muted-foreground'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-bold text-lg">{achievement.title}</h3>
                              {achievement.unlocked && (
                                <CheckCircle className="h-5 w-5 text-accent" />
                              )}
                            </div>
                            <p className="text-muted-foreground mb-4">{achievement.description}</p>
                            
                            {!achievement.unlocked && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span>{achievement.progress}/{achievement.total}</span>
                                </div>
                                <Progress value={progressPercentage} className="h-2" />
                              </div>
                            )}
                            
                            {achievement.unlocked && (
                              <Badge className="bg-accent/20 text-accent">
                                <Award className="h-3 w-3 mr-1" />
                                Unlocked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skill Progress */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Skill Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className={`text-sm font-bold ${getSkillLevelColor(skill.level)}`}>
                          {skill.level}/{skill.maxLevel}
                        </span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{skill.category}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Daily Challenge */}
            <Card className="bg-gradient-secondary/10 border-secondary/20">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-secondary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Daily Challenge</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete 30 minutes of practice to earn bonus XP
                </p>
                <Progress value={67} className="mb-4" />
                <Button variant="neon" className="w-full">
                  Continue Challenge
                </Button>
              </CardContent>
            </Card>
            
            {/* Learning Path */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Recommended Path</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-background/30 border-l-2 border-primary">
                    <p className="font-medium text-sm">Complete Fundamentals</p>
                    <p className="text-xs text-muted-foreground">4 lessons remaining</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/30 opacity-60">
                    <p className="font-medium text-sm">Start Reaction Training</p>
                    <p className="text-xs text-muted-foreground">Unlock next</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/30 opacity-60">
                    <p className="font-medium text-sm">Advanced Strategies</p>
                    <p className="text-xs text-muted-foreground">Coming up</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;