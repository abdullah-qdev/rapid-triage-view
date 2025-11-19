import { Link } from "react-router-dom";
import { Upload, Activity, Zap, Shield, Brain, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-orange-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-orange-400/20 text-primary px-5 py-2.5 rounded-full text-sm font-semibold border border-primary/20 backdrop-blur-sm animate-scale-in">
            <Sparkles className="w-4 h-4" />
            AI-Powered Medical Triage
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-tight tracking-tight">
            Offline Multi-Modal
            <br />
            <span className="bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent animate-fade-in">
              Radiology Triage
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AI-powered medical imaging prioritization for humanitarian response. 
            Process radiology scans offline with real-time AI analysis and batch processing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg" className="text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90">
              <Link to="/upload">
                <Upload className="mr-2 h-5 w-5" />
                Start Triaging Scans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 py-7 rounded-full hover:bg-primary/5 transition-all duration-300 hover:scale-105 border-2">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative container mx-auto px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for Humanitarian Medical Response
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI-powered tools designed for critical medical situations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 animate-fade-in">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Offline-First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Works completely offline using Web Workers and IndexedDB. No internet required for core triage functionality.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 animate-fade-in animation-delay-100">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">AI-Driven Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Powered by Google Gemini AI to provide detailed clinical explanations, key findings, and actionable recommendations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 animate-fade-in animation-delay-200">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Real ONNX Inference</h3>
              <p className="text-muted-foreground leading-relaxed">
                Uses ONNX Runtime Web with WebGL acceleration for real-time triage classification of radiology scans.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 animate-fade-in animation-delay-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Batch Processing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Process multiple scans simultaneously with multi-select and batch processing capabilities for efficiency.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 animate-fade-in animation-delay-400">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Heatmap Visualization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Interactive attention heatmaps show which regions of the scan influenced the AI's triage decision.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 animate-fade-in animation-delay-500">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Custom Notes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Add radiologist notes, export comprehensive reports, and maintain full audit trails for each scan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-primary/5 to-orange-500/10 backdrop-blur-sm border-2 border-primary/20 rounded-3xl p-16 text-center space-y-8 shadow-2xl animate-scale-in">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            Ready to Deploy
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Ready to Start Triaging?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload your radiology scans and let AI assist with intelligent prioritization for faster medical response.
          </p>
          <Button asChild size="lg" className="text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90">
            <Link to="/upload">
              <Upload className="mr-2 h-5 w-5" />
              Start Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 backdrop-blur-sm px-6 py-10 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-sm text-muted-foreground">
            Datathon MVP Demo • Offline-capable • For demonstration purposes only
          </p>
          <p className="text-xs text-muted-foreground/70">
            Powered by ONNX Runtime Web & Google Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}
