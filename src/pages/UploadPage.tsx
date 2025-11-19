import { useState, useEffect, useRef } from "react";
import Uploader from "@/components/Uploader";
import Viewer from "@/components/Viewer";
import QueuePanel from "@/components/QueuePanel";
import ThroughputCard from "@/components/ThroughputCard";
import { saveQueue, loadQueue } from "@/utils/indexeddb";

interface AIReasoning {
  explanation: string;
  keyFindings: string[];
  recommendations: string[];
  confidenceAnalysis: string;
}

interface Scan {
  id: string;
  fileName: string;
  imageData: string | null;
  status: "queued" | "processing" | "done";
  triageLevel: string | null;
  confidence: number | null;
  heatmapData: any[] | null;
  uploadedAt: string;
  aiReasoning?: AIReasoning;
  customNotes?: string;
  reasoningLoading?: boolean;
  reasoningError?: string;
}

interface Stats {
  processed: number;
  avgTimeMs: number;
  timeSavedEstimate: number;
}

export default function UploadPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [selectedScanIds, setSelectedScanIds] = useState<Set<string>>(new Set());
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [stats, setStats] = useState<Stats>({
    processed: 0,
    avgTimeMs: 0,
    timeSavedEstimate: 0,
  });
  const workerRef = useRef<Worker | null>(null);

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/inference.worker.js", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (e) => {
      const { scanId, result, error, processingTime } = e.data;

      if (error) {
        setScans((prev) =>
          prev.map((scan) =>
            scan.id === scanId
              ? {
                  ...scan,
                  status: "done",
                  triageLevel: "ERROR",
                  confidence: 0,
                  heatmapData: [],
                }
              : scan
          )
        );
        return;
      }

      setScans((prev) =>
        prev.map((scan) =>
          scan.id === scanId
            ? {
                ...scan,
                status: "done",
                triageLevel: result.triageLevel,
                confidence: result.confidence,
                heatmapData: result.heatmapData,
              }
            : scan
        )
      );

      fetchAIReasoning(scanId, result);

      setStats((prev) => {
        const newProcessed = prev.processed + 1;
        const newAvg =
          (prev.avgTimeMs * prev.processed + processingTime) / newProcessed;
        const timeSaved = newProcessed * 30;

        return {
          processed: newProcessed,
          avgTimeMs: newAvg,
          timeSavedEstimate: timeSaved,
        };
      });
    };

    loadQueue().then((savedScans) => {
      if (savedScans && savedScans.length > 0) {
        setScans(savedScans);
        savedScans.forEach((scan) => {
          if (scan.status === "processing") {
            workerRef.current?.postMessage({
              scanId: scan.id,
              imageData: scan.imageData,
            });
          }
        });
      }
    });

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const fetchAIReasoning = async (scanId: string, result: any) => {
    setScans((prev) =>
      prev.map((scan) =>
        scan.id === scanId ? { ...scan, reasoningLoading: true } : scan
      )
    );

    try {
      const scan = scans.find((s) => s.id === scanId);
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-scan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            triageLevel: result.triageLevel,
            confidence: result.confidence,
            heatmapData: result.heatmapData,
            fileName: scan?.fileName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.status}`);
      }

      const reasoning = await response.json();

      setScans((prev) =>
        prev.map((scan) =>
          scan.id === scanId
            ? { ...scan, aiReasoning: reasoning, reasoningLoading: false }
            : scan
        )
      );
    } catch (error) {
      console.error("Failed to fetch AI reasoning:", error);
      setScans((prev) =>
        prev.map((scan) =>
          scan.id === scanId
            ? {
                ...scan,
                reasoningError:
                  error instanceof Error ? error.message : "Analysis failed",
                reasoningLoading: false,
              }
            : scan
        )
      );
    }
  };

  const handleBatchProcess = () => {
    const queuedScans = scans.filter(
      (scan) => selectedScanIds.has(scan.id) && scan.status === "queued"
    );

    queuedScans.forEach((scan) => {
      setScans((prev) =>
        prev.map((s) =>
          s.id === scan.id ? { ...s, status: "processing" } : s
        )
      );

      workerRef.current?.postMessage({
        scanId: scan.id,
        imageData: scan.imageData,
      });
    });

    setSelectedScanIds(new Set());
  };

  const handleUpdateNotes = (scanId: string, notes: string) => {
    setScans((prev) =>
      prev.map((scan) =>
        scan.id === scanId ? { ...scan, customNotes: notes } : scan
      )
    );
  };

  const handleRegenerateReasoning = (scanId: string) => {
    const scan = scans.find((s) => s.id === scanId);
    if (scan && scan.triageLevel && scan.confidence !== null) {
      fetchAIReasoning(scanId, {
        triageLevel: scan.triageLevel,
        confidence: scan.confidence,
        heatmapData: scan.heatmapData,
      });
    }
  };

  useEffect(() => {
    if (scans.length > 0) {
      saveQueue(scans);
    }
  }, [scans]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleFilesAdded = (files: File[]) => {
    const newScans = files.map((file) => {
      const reader = new FileReader();
      const scanId = `scan-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      reader.onload = (e) => {
        const imageData = e.target?.result as string;

        setScans((prev) =>
          prev.map((scan) =>
            scan.id === scanId
              ? { ...scan, imageData, status: "processing" as const }
              : scan
          )
        );

        if (workerRef.current) {
          workerRef.current.postMessage({
            scanId,
            imageData,
          });
        }
      };

      reader.readAsDataURL(file);

      return {
        id: scanId,
        fileName: file.name,
        imageData: null,
        status: "queued" as const,
        triageLevel: null,
        confidence: null,
        heatmapData: null,
        uploadedAt: new Date().toISOString(),
      };
    });

    setScans((prev) => [...prev, ...newScans]);

    if (!selectedScanId && newScans.length > 0) {
      setSelectedScanId(newScans[0].id);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "u" || e.key === "U") {
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        fileInput?.click();
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, []);

  const selectedScan = scans.find((s) => s.id === selectedScanId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border px-8 py-6 shadow-sm">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-orange-600 tracking-wide">
              Humanitarian Radiology AI
            </span>

            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Offline Multi-Modal Radiology Triage
            </h1>

            <p className="text-sm text-gray-600">
              AI-powered medical imaging prioritization for humanitarian response
            </p>
          </div>

          <div className="flex gap-4">
            {isOffline && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 border border-red-300">
                <span className="w-2 h-2 bg-red-700 rounded-full animate-pulse"></span>
                Offline Mode
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-screen-2xl mx-auto w-full gap-6 p-6">
        <div className="lg:w-80 flex flex-col gap-6">
          <Uploader onFilesAdded={handleFilesAdded} />
          <ThroughputCard stats={stats} />

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2 text-foreground">
              Keyboard Shortcuts
            </h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>
                <kbd className="bg-muted px-1.5 py-0.5 rounded">U</kbd> Open
                uploader
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[500px]">
          <Viewer scan={selectedScan} />
        </div>

        <div className="lg:w-80">
          <QueuePanel
            scans={scans}
            selectedScanId={selectedScanId}
            selectedScanIds={selectedScanIds}
            onSelectScan={setSelectedScanId}
            onToggleSelect={setSelectedScanIds}
            onBatchProcess={handleBatchProcess}
          />
        </div>
      </main>

      <footer className="bg-card border-t border-border px-6 py-3 text-center text-xs text-muted-foreground">
        Datathon MVP Demo • Offline-capable • For demonstration purposes only
      </footer>
    </div>
  );
}
