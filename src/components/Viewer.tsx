import { useState } from 'react';

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
  status: 'queued' | 'processing' | 'done';
  triageLevel: string | null;
  confidence: number | null;
  heatmapData: any[] | null;
  uploadedAt: string;
  aiReasoning?: AIReasoning;
  customNotes?: string;
  reasoningLoading?: boolean;
  reasoningError?: string;
}

interface ViewerProps {
  scan?: Scan;
  onUpdateNotes?: (scanId: string, notes: string) => void;
  onRegenerateReasoning?: (scanId: string) => void;
}

function Viewer({ scan, onUpdateNotes, onRegenerateReasoning }: ViewerProps) {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [heatmapIntensity, setHeatmapIntensity] = useState(0.7);
  const [notes, setNotes] = useState('');

  if (!scan) {
    return (
      <div className="bg-card border border-border rounded-lg h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-medium">No scan selected</p>
          <p className="text-xs mt-1">Upload images or select from the queue</p>
        </div>
      </div>
    );
  }

  const getTriageBadgeColor = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-critical text-critical-foreground';
      case 'URGENT':
        return 'bg-urgent text-urgent-foreground';
      case 'STABLE':
        return 'bg-stable text-stable-foreground';
      case 'NON-URGENT':
        return 'bg-non-urgent text-non-urgent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    if (onUpdateNotes) {
      onUpdateNotes(scan.id, value);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{scan.fileName}</h2>
          <p className="text-xs text-muted-foreground">
            Uploaded: {new Date(scan.uploadedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Triage Badge */}
          {scan.triageLevel && (
            <div className={`px-4 py-2 rounded-lg font-bold text-sm ${getTriageBadgeColor(scan.triageLevel)}`}>
              {scan.triageLevel}
              {scan.confidence && (
                <span className="ml-2 opacity-90 font-normal">
                  {Math.round(scan.confidence * 100)}%
                </span>
              )}
            </div>
          )}

          {/* Status Badge */}
          {scan.status === 'processing' && (
            <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
              Processing...
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Image Viewer */}
        <div className="p-4 flex items-center justify-center bg-muted/30 relative min-h-[300px]">
          {scan.imageData ? (
            <div className="relative max-w-full">
              <img
                src={scan.imageData}
                alt={scan.fileName}
                className="max-w-full max-h-[500px] rounded-lg shadow-lg"
              />

              {/* Heatmap Overlay */}
              {scan.status === 'done' && showHeatmap && scan.heatmapData && (
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ opacity: heatmapIntensity }}
                >
                  <defs>
                    {scan.heatmapData.map((spot, idx) => (
                      <radialGradient key={idx} id={`heatmap-${idx}`}>
                        <stop offset="0%" stopColor={spot.color} stopOpacity="0.8" />
                        <stop offset="50%" stopColor={spot.color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={spot.color} stopOpacity="0" />
                      </radialGradient>
                    ))}
                  </defs>
                  {scan.heatmapData.map((spot, idx) => (
                    <ellipse
                      key={idx}
                      cx={`${spot.x}%`}
                      cy={`${spot.y}%`}
                      rx={`${spot.radius}%`}
                      ry={`${spot.radius}%`}
                      fill={`url(#heatmap-${idx})`}
                    />
                  ))}
                </svg>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">No image data available</div>
          )}
        </div>

        {/* Heatmap Controls */}
        {scan.status === 'done' && (
          <div className="px-4 pb-4 border-b border-border space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
                aria-label="Toggle heatmap overlay"
              />
              <span className="text-sm font-medium text-foreground">Show Heatmap</span>
            </label>
            
            {showHeatmap && (
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground whitespace-nowrap">
                  Intensity:
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="0.9"
                  step="0.1"
                  value={heatmapIntensity}
                  onChange={(e) => setHeatmapIntensity(parseFloat(e.target.value))}
                  className="flex-1 accent-primary"
                  aria-label="Heatmap intensity"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {Math.round(heatmapIntensity * 100)}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* AI Reasoning Panel */}
        {scan.status === 'done' && (
          <div className="p-4 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-foreground flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Analysis
              </h3>
              {onRegenerateReasoning && (
                <button
                  onClick={() => onRegenerateReasoning(scan.id)}
                  disabled={scan.reasoningLoading}
                  className="text-xs px-3 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary font-medium transition disabled:opacity-50"
                >
                  {scan.reasoningLoading ? 'Analyzing...' : 'Regenerate'}
                </button>
              )}
            </div>

            {scan.reasoningLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Generating AI analysis...
              </div>
            )}

            {scan.reasoningError && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {scan.reasoningError}
              </div>
            )}

            {scan.aiReasoning && !scan.reasoningLoading && (
              <div className="space-y-4">
                {/* Explanation */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Clinical Explanation
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    {scan.aiReasoning.explanation}
                  </p>
                </div>

                {/* Key Findings */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Key Findings
                  </h4>
                  <ul className="space-y-1">
                    {scan.aiReasoning.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Recommended Actions
                  </h4>
                  <ul className="space-y-2">
                    {scan.aiReasoning.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className={`mt-0.5 ${
                          scan.triageLevel === 'CRITICAL' ? 'text-critical' :
                          scan.triageLevel === 'URGENT' ? 'text-urgent' : 'text-stable'
                        }`}>
                          {scan.triageLevel === 'CRITICAL' || scan.triageLevel === 'URGENT' ? '🔴' : '🟡'}
                        </span>
                        <span className="text-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Confidence Analysis */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="text-xs font-semibold text-primary uppercase mb-2">
                    Confidence Analysis
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    {scan.aiReasoning.confidenceAnalysis}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Notes */}
        {scan.status === 'done' && (
          <div className="p-4 space-y-3">
            <h3 className="text-md font-semibold text-foreground flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Radiologist Notes
            </h3>
            <textarea
              value={notes || scan.customNotes || ''}
              onChange={(e) => {
                setNotes(e.target.value);
                handleNotesChange(e.target.value);
              }}
              placeholder="Add your observations, patient context, or override AI suggestions..."
              className="w-full min-h-[100px] p-3 rounded-lg border border-border bg-background text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Custom notes for this scan"
            />
            <p className="text-xs text-muted-foreground">
              Notes auto-save and will be included in exported reports
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Viewer;
