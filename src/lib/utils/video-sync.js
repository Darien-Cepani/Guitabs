export class VideoSynchronizer {
  constructor(videos) {
    this.videos = videos;
    this.masterVideo = videos[0];
    this.tolerance = 0.1;
  }

  sync() {
    const masterTime = this.masterVideo.currentTime;
    this.videos.forEach(video => {
      if (video !== this.masterVideo) {
        if (Math.abs(video.currentTime - masterTime) > this.tolerance) {
          video.currentTime = masterTime;
        }
      }
    });
  }

  play() {
    this.videos.forEach(video => video.play());
  }

  pause() {
    this.videos.forEach(video => video.pause());
  }
}
