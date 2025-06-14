// Sparkle Trail Effect
class SparkleTrail {
  constructor() {
    this.sparkles = [];
    this.maxSparkles = 20;
    this.lastX = 0;
    this.lastY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.sparkleContainer = null;
    this.sparkleSize = { min: 5, max: 15 };
    this.interactiveElements = ['.hand-drawn-button', '.create-button', 'button', 'a', '.toggle-switch', '.file-drop-area'];
    
    this.colors = [
      '#6BD3D7', // cyan/teal
      '#FFD166', // gold
      '#FF6B6B', // coral
      '#FFA6C9', // pink
      '#83D483', // green
      '#E6E6FA', // lavender
      '#FFFFFF'  // white
    ];

    this.initialize();
  }

  initialize() {
    this.createSparkleContainer();
    this.setupEventListeners();
    this.animate();
  }

  createSparkleContainer() {
    this.sparkleContainer = document.createElement('div');
    this.sparkleContainer.className = 'sparkle-container';
    this.sparkleContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    document.body.appendChild(this.sparkleContainer);
  }

  setupEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.lastX = this.currentX;
      this.lastY = this.currentY;
      this.currentX = e.clientX;
      this.currentY = e.clientY;

      const element = document.elementFromPoint(this.currentX, this.currentY);
      if (element) {
        const isInteractive = this.interactiveElements.some(selector =>
          element.matches(selector) || element.closest(selector)
        );
        
        if (isInteractive) {
          this.createSparkle(true);
          this.sparkleSize = { min: 8, max: 20 };
        } else {
          this.sparkleSize = { min: 5, max: 15 };
        }
      }

      if (Math.hypot(this.currentX - this.lastX, this.currentY - this.lastY) > 5) {
        this.createSparkle();
      }
    });
  }

  createSparkle(isEnhanced = false) {
    if (this.sparkles.length >= this.maxSparkles) {
      const oldSparkle = this.sparkles.shift();
      if (oldSparkle.element?.parentNode) {
        oldSparkle.element.parentNode.removeChild(oldSparkle.element);
      }
    }

    const sparkle = document.createElement('div');
    const size = this.getRandomSize(isEnhanced);
    const color = this.getRandomColor();
    
    sparkle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border-radius: 50%;
      left: ${this.currentX}px;
      top: ${this.currentY}px;
      transform: translate(-50%, -50%);
      pointer-events: none;
      opacity: 0.8;
      box-shadow: 0 0 ${size / 2}px ${color};
      filter: blur(1px);
    `;
    
    this.sparkleContainer.appendChild(sparkle);
    
    this.sparkles.push({
      element: sparkle,
      size,
      color,
      x: this.currentX,
      y: this.currentY,
      speed: 0.8 + Math.random() * 0.4,
      angle: Math.random() * Math.PI * 2,
      opacity: 0.8,
      spin: Math.random() * 10 - 5,
      created: Date.now()
    });
  }

  getRandomSize(isEnhanced) {
    const { min, max } = this.sparkleSize;
    return min + Math.random() * (max - min) * (isEnhanced ? 1.5 : 1);
  }

  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  animate() {
    for (let i = 0; i < this.sparkles.length; i++) {
      const sparkle = this.sparkles[i];
      const age = (Date.now() - sparkle.created) / 1000;
      
      sparkle.x += Math.cos(sparkle.angle) * sparkle.speed;
      sparkle.y += Math.sin(sparkle.angle) * sparkle.speed + 1;
      sparkle.opacity = Math.max(0, 0.8 - age * 1.2);

      if (sparkle.element) {
        sparkle.element.style.left = `${sparkle.x}px`;
        sparkle.element.style.top = `${sparkle.y}px`;
        sparkle.element.style.opacity = sparkle.opacity;
        sparkle.element.style.transform = `translate(-50%, -50%) rotate(${sparkle.spin * age}deg)`;
      }

      if (sparkle.opacity <= 0) {
        if (sparkle.element?.parentNode) {
          sparkle.element.parentNode.removeChild(sparkle.element);
        }
        this.sparkles.splice(i, 1);
        i--;
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize sparkle trail when document is ready
document.addEventListener('DOMContentLoaded', () => {
  new SparkleTrail();
});
