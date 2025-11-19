import { Link } from "react-router-dom";
import { Upload, Activity, Zap, Shield, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
            <Zap className="w-4 h-4" />
            AI-Powered Medical Triage
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Offline Multi-Modal
            <br />
            <span className="text-primary">Radiology Triage</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered medical imaging prioritization for humanitarian response. 
            Process radiology scans offline with real-time AI analysis and batch processing capabilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/upload">
                <Upload className="mr-2 h-5 w-5" />
                Start Triaging Scans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Built for Humanitarian Medical Response
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Offline-First</h3>
              <p className="text-muted-foreground">
                Works completely offline using Web Workers and IndexedDB. No internet required for core triage functionality.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">AI-Driven Insights</h3>
              <p className="text-muted-foreground">
                Powered by Google Gemini AI to provide detailed clinical explanations, key findings, and actionable recommendations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Real ONNX Inference</h3>
              <p className="text-muted-foreground">
                Uses ONNX Runtime Web with WebGL acceleration for real-time triage classification of radiology scans.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Batch Processing</h3>
              <p className="text-muted-foreground">
                Process multiple scans simultaneously with multi-select and batch processing capabilities for efficiency.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Heatmap Visualization</h3>
              <p className="text-muted-foreground">
                Interactive attention heatmaps show which regions of the scan influenced the AI's triage decision.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Custom Notes</h3>
              <p className="text-muted-foreground">
                Add radiologist notes, export comprehensive reports, and maintain full audit trails for each scan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Start Triaging?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your radiology scans and let AI assist with intelligent prioritization.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to="/upload">
              <Upload className="mr-2 h-5 w-5" />
              Start Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        Datathon MVP Demo • Offline-capable • For demonstration purposes only
      </footer>
    </div>
  );
}
