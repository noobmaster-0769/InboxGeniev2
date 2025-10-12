import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Sparkles, 
  Brain, 
  Shield, 
  Zap, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Classification",
      description: "Automatically categorize emails with advanced machine learning",
    },
    {
      icon: Shield,
      title: "Advanced Spam Protection",
      description: "99.9% spam detection accuracy with intelligent filtering",
    },
    {
      icon: Sparkles,
      title: "Smart Summaries",
      description: "Get instant AI-generated summaries of important emails",
    },
    {
      icon: Zap,
      title: "Quick AI Replies",
      description: "Generate contextual responses with customizable tone",
    },
  ];

  const benefits = [
    "Save 4+ hours per week on email management",
    "99.9% spam filtering accuracy",
    "Intelligent priority detection",
    "Seamless Gmail integration",
    "Real-time AI insights",
    "Customizable automation rules",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">InboxGenie</h1>
            </div>
            <Button 
              className="ai-button hover-glow"
              onClick={() => navigate("/dashboard")}
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-6">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-4 animate-pulse-glow">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Email Revolution
            </Badge>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Transform Your Email Experience with{" "}
              <span className="gradient-text">AI Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              InboxGenie uses advanced AI to intelligently organize, filter, and enhance your email workflow. 
              Say goodbye to email overload and hello to productivity.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-12">
            <Button 
              className="ai-button hover-glow text-lg px-8 py-3"
              onClick={() => navigate("/dashboard")}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Try InboxGenie
            </Button>
            <Button variant="outline" className="hover-lift text-lg px-8 py-3">
              <Users className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">4.2hrs</p>
              <p className="text-sm text-muted-foreground">Saved per week</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">99.9%</p>
              <p className="text-sm text-muted-foreground">Spam accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">85%</p>
              <p className="text-sm text-muted-foreground">Faster processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Intelligent Email Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by cutting-edge AI technology to revolutionize how you handle emails
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="inbox-card-ai p-6 hover-lift fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Why Choose <span className="gradient-text">InboxGenie?</span>
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit} 
                    className="flex items-center space-x-3 fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button 
                  className="ai-button hover-glow"
                  onClick={() => navigate("/dashboard")}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started Now
                </Button>
              </div>
            </div>

            <div className="relative">
              <Card className="inbox-card-ai p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">AI Processing</span>
                    <Badge className="bg-success text-success-foreground">Active</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary w-3/4 rounded-full animate-pulse-glow"></div>
                    </div>
                    <p className="text-sm text-muted-foreground">Processing 1,247 emails...</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold gradient-text">342</p>
                      <p className="text-xs text-muted-foreground">Spam Filtered</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold gradient-text">58</p>
                      <p className="text-xs text-muted-foreground">Priority Detected</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Inbox?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have revolutionized their email experience with AI
          </p>
          <Button 
            className="ai-button hover-glow text-lg px-12 py-4"
            onClick={() => navigate("/dashboard")}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Your AI Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Mail className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold gradient-text">InboxGenie</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-Powered Email Dashboard • Transforming Digital Communication
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;