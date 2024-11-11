export const springConfig = {
    stiffness: 0.2,
    damping: 0.4,
    precision: 0.001
};

export function createPulseAnimation(element, options = {}) {
    const { scale = 1.05, duration = 200 } = options;
    
    return {
        update(params) {
            element.style.transform = `scale(${params.scale})`;
        },
        
        animate() {
            const animation = element.animate([
                { transform: 'scale(1)' },
                { transform: `scale(${scale})` },
                { transform: 'scale(1)' }
            ], {
                duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
            
            return animation.finished;
        }
    };
}
