export async function loadSessions() {
  // Simulated data for demonstration
  return [
    {
      id: 1,
      title: "Sweet Child O' Mine Practice",
      timestamp: Date.now() - 86400000,
      progress: 85,
      tags: ["Guitar Solo", "Rock"],
      video: "path/to/video",
      transcription: {}
    },
    {
      id: 2,
      title: "Blues Scale Exercise",
      timestamp: Date.now() - 172800000,
      progress: 100,
      tags: ["Blues", "Scale Practice"],
      video: "path/to/video",
      transcription: {}
    }
  ];
}
