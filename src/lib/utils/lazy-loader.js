export const lazyLoad = {
  videoProcessor: () => import(
    /* webpackChunkName: "video-processor" */
    '../processors/video-processor'
  ),
  
  transcriptionEngine: () => import(
    /* webpackChunkName: "transcription-engine" */
    '../processors/transcription-engine'
  ),
  
  notationRenderer: () => import(
    /* webpackChunkName: "notation-renderer" */
    '../renderers/notation-renderer'
  )
};
