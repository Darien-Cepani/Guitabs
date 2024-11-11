export function initializeWorkers() {
    return new Promise((resolve) => {
        // Initialize web workers for video and audio processing
        const videoWorker = new Worker('/workers/video-worker.js');
        const audioWorker = new Worker('/workers/audio-worker.js');
        
        resolve({ videoWorker, audioWorker });
    });
}
