
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Brain, FileUp, Lock, MessageSquare, Rocket, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const HomePage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "ExpertEye - Intelligent Document Analysis";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="border-b py-4 px-6 bg-background">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">ExpertEye</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Testimonials</a>
            <Button variant="outline" onClick={() => navigate("/login")}>Log In</Button>
            <Button onClick={() => navigate("/signup")}>Get Started</Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <i className="ri-menu-line"></i>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-6 bg-gradient-to-br from-background via-background to-expertEye-50">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your Business with Expert AI Insights
              </h1>
              <p className="text-xl text-muted-foreground">
                Leverage cutting-edge AI to make smarter decisions, faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate("/signup")} className="gap-2">
                  Start Using ExpertEye <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/chat")}>
                  Try AI Assistant
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                alt="AI data analysis visualization" 
                className="rounded-lg shadow-xl w-full object-cover aspect-video animate-fade-in"
              />
              <div className="absolute -bottom-6 -right-6 bg-expertEye-500 text-white p-4 rounded-lg shadow-lg">
                <p className="text-sm font-medium">Trusted by 500+ companies</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-6 bg-secondary/30">
          <div className="container mx-auto text-center max-w-3xl space-y-6">
            <h2 className="text-3xl font-bold">About ExpertEye</h2>
            <p className="text-lg text-muted-foreground">
              ExpertEye is an advanced AI-powered platform designed to deliver actionable insights, 
              automate workflows, and optimize decision-making processes for businesses across industries.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="font-bold">Innovative</h3>
                <p className="text-sm text-muted-foreground">Cutting-edge AI algorithms for superior results</p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="font-bold">Accurate</h3>
                <p className="text-sm text-muted-foreground">Precise analysis with 99.8% accuracy rate</p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="font-bold">Scalable</h3>
                <p className="text-sm text-muted-foreground">Grows with your business needs seamlessly</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-expertEye-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <BarChart2 className="text-expertEye-700" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Real-Time Insights</h3>
                  <p className="text-muted-foreground">Instant data-driven reports and recommendations to keep you ahead.</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-expertEye-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <Rocket className="text-expertEye-700" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Predictive Analytics</h3>
                  <p className="text-muted-foreground">Predict future trends using advanced machine learning algorithms.</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-expertEye-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <Lock className="text-expertEye-700" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Seamless Integration</h3>
                  <p className="text-muted-foreground">Easily integrates with your existing systems and workflows.</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-expertEye-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <Zap className="text-expertEye-700" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Scalable</h3>
                  <p className="text-muted-foreground">Suitable for businesses of all sizes – from startups to enterprises.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 px-6 bg-secondary/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary/20 mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <FileUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Upload Your Data</h3>
                <p className="text-muted-foreground">Simple data input to get started with your analysis.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/20 mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. AI-Driven Analysis</h3>
                <p className="text-muted-foreground">ExpertEye's AI processes and analyzes the data.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/20 mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Get Insights</h3>
                <p className="text-muted-foreground">Receive detailed insights or recommendations instantly.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/20 mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">4. Take Action</h3>
                <p className="text-muted-foreground">Implement solutions to drive business outcomes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-expertEye-50 border-none shadow-sm">
                <CardContent className="pt-6">
                  <p className="italic mb-4">
                    "ExpertEye has revolutionized the way we make decisions, turning complex data into clear insights."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-expertEye-200 flex items-center justify-center">
                      <span className="font-bold text-expertEye-700">JD</span>
                    </div>
                    <div>
                      <p className="font-bold">John Doe</p>
                      <p className="text-sm text-muted-foreground">CEO, Tech Solutions Inc.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-expertEye-50 border-none shadow-sm">
                <CardContent className="pt-6">
                  <p className="italic mb-4">
                    "The predictive analytics have given us a competitive edge in our market. Well worth the investment."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-expertEye-200 flex items-center justify-center">
                      <span className="font-bold text-expertEye-700">AS</span>
                    </div>
                    <div>
                      <p className="font-bold">Anna Smith</p>
                      <p className="text-sm text-muted-foreground">CTO, Global Enterprises</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-expertEye-50 border-none shadow-sm">
                <CardContent className="pt-6">
                  <p className="italic mb-4">
                    "Our team has saved countless hours since implementing ExpertEye. The AI is genuinely intelligent."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-expertEye-200 flex items-center justify-center">
                      <span className="font-bold text-expertEye-700">RL</span>
                    </div>
                    <div>
                      <p className="font-bold">Robert Lee</p>
                      <p className="text-sm text-muted-foreground">Data Director, Innovate Corp</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-xl font-bold mb-4">Trusted By</h3>
              <div className="flex flex-wrap justify-center gap-8 opacity-60">
                <div className="h-8">Company 1</div>
                <div className="h-8">Company 2</div>
                <div className="h-8">Company 3</div>
                <div className="h-8">Company 4</div>
                <div className="h-8">Company 5</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-primary text-primary-foreground">
          <div className="container mx-auto text-center max-w-3xl space-y-6">
            <h2 className="text-3xl font-bold">Ready to Transform Your Business?</h2>
            <p className="text-lg">
              Join thousands of companies using ExpertEye to drive better decisions.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate("/signup")}
              className="mt-4"
            >
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">ExpertEye</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced AI solutions for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#how-it-works" className="text-muted-foreground hover:text-foreground">How It Works</a></li>
                <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 ExpertEye, All Rights Reserved
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <i className="ri-linkedin-fill"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <i className="ri-twitter-fill"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <i className="ri-facebook-fill"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <i className="ri-instagram-fill"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="lg" 
          className="rounded-full h-16 w-16 shadow-lg"
          onClick={() => navigate("/chat")}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
