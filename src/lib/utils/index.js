// Import specific utilities
import { createPulseAnimation, springConfig } from './motion.js';
import { analyzeAudio } from './audio-analyzer.js';
import { optimizeLayout } from './layout-optimizer.js';
import { BREAKPOINTS, THEME_COLORS } from './constants.js';

// Export them individually
export const motion = {
    createPulseAnimation,
    springConfig
};

export const audio = {
    analyzeAudio
};

export const layout = {
    optimizeLayout,
    BREAKPOINTS,
    THEME_COLORS
};
	export { BREAKPOINTS, THEME_COLORS, analyzeAudio } from './constants.js';