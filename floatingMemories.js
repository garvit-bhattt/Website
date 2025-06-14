// Floating Memories Background Effect
class FloatingMemories {
  constructor() {
    this.memories = [];
    this.memoryCount = 15;
    this.memoryContainer = null;
    this.memoryTypes = ['balloon', 'bubble', 'plane', 'photo', 'letter'];
    this.colors = ['#6BD3D7', '#FF6B6B', '#FFD166', '#83D483', '#FFD1DC', '#FFA6C9', '#E6E6FA'];
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.initialize();
  }

  initialize() {
    this.createMemoryContainer();
    this.createInitialMemories();
    this.setupEventListeners();
    this.animate();
  }

  createMemoryContainer() {
    this.memoryContainer = document.createElement('div');
    this.memoryContainer.className = 'floating-memories-container';
    this.memoryContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    `;
    document.body.appendChild(this.memoryContainer);
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    });

    document.addEventListener('click', (e) => {
      if (Math.random() < 0.3) {
        const memoryType = this.memoryTypes[Math.floor(Math.random() * this.memoryTypes.length)];
        this.createMemory(memoryType, e.clientX, e.clientY);
      }
    });
  }

  createInitialMemories() {
    for (let i = 0; i < this.memoryCount; i++) {
      const memoryType = this.memoryTypes[Math.floor(Math.random() * this.memoryTypes.length)];
      const x = Math.random() * this.windowWidth;
      const y = Math.random() * this.windowHeight;
      this.createMemory(memoryType, x, y);
    }
  }

  createMemory(type, x, y) {
    const memory = document.createElement('div');
    memory.className = `floating-memory memory-${type}`;

    const size = 30 + Math.random() * 40;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];

    memory.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      opacity: ${0.2 + Math.random() * 0.4};
      pointer-events: none;
      z-index: -1;
    `;

    switch (type) {
      case 'balloon':
        memory.innerHTML = `
          <div style="position: relative; width: 100%; height: 100%;">
            <div style="position: absolute; width: 100%; height: 90%; background-color: ${color}; border-radius: 50%; bottom: 0;"></div>
            <div style="position: absolute; width: 2px; height: 30px; background-color: #888; bottom: -25px; left: 50%; transform: translateX(-50%);"></div>
          </div>
        `;
        break;

      case 'bubble':
        memory.style.borderRadius = '50%';
        memory.style.border = `1px solid ${color}`;
        memory.style.backgroundColor = `${color}20`;
        memory.style.boxShadow = `0 0 5px ${color}40, inset 0 0 10px ${color}30`;
        break;

      case 'plane':
        memory.innerHTML = `
          <div style="position: relative; width: 100%; height: 100%; transform: rotate(${Math.random() * 360}deg);">
            <div style="position: absolute; width: 100%; height: 40%; background-color: ${color}; transform: rotate(-15deg); top: 10%; left: 0;"></div>
            <div style="position: absolute; width: 100%; height: 40%; background-color: ${color}; transform: rotate(15deg); bottom: 10%; left: 0;"></div>
          </div>
        `;
        break;

      case 'photo':
        memory.style.border = '2px solid #FFF';
        memory.style.backgroundColor = color;
        memory.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        memory.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
        break;

      case 'letter':
        memory.style.backgroundColor = '#FFFDF7';
        memory.style.border = '1px solid #DDD';
        memory.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        memory.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
        memory.innerHTML = `
          <div style="font-size: 8px; padding: 5px; color: #888; font-family: 'Comic Neue', cursive;">
            Dear Future...
          </div>
        `;
        break;
    }

    this.memoryContainer.appendChild(memory);

    this.memories.push({
      element: memory,
      type,
      x,
      y,
      size,
      speedX: Math.random() * 1 - 0.5,
      speedY: -0.5 - Math.random() * 1,
      rotation: Math.random() * 4 - 2,
      oscillation: {
        amplitude: Math.random() * 10,
        frequency: 0.001 + Math.random() * 0.005,
        offset: Math.random() * 1000
      }
    });
  }

  animate() {
    const now = Date.now();

    for (let i = 0; i < this.memories.length; i++) {
      const memory = this.memories[i];

      const oscillation = memory.oscillation.amplitude *
        Math.sin((now + memory.oscillation.offset) * memory.oscillation.frequency);

      memory.x += memory.speedX + oscillation;
      memory.y += memory.speedY;

      if (memory.element) {
        memory.element.style.left = `${memory.x}px`;
        memory.element.style.top = `${memory.y}px`;

        if (memory.type === 'photo' || memory.type === 'letter') {
          const currentRotation = parseFloat(memory.element.style.transform.replace(/[^0-9\-\.]/g, '') || 0);
          memory.element.style.transform = `rotate(${currentRotation + memory.rotation * 0.05}deg)`;
        }
      }

      if (
        memory.y < -memory.size * 2 ||
        memory.y > this.windowHeight + memory.size ||
        memory.x < -memory.size * 2 ||
        memory.x > this.windowWidth + memory.size
      ) {
        if (memory.element && memory.element.parentNode) {
          memory.element.parentNode.removeChild(memory.element);
        }

        const memoryType = this.memoryTypes[Math.floor(Math.random() * this.memoryTypes.length)];
        const x = Math.random() * this.windowWidth;
        const y = this.windowHeight + Math.random() * 100;
        this.createMemory(memoryType, x, y);

        this.memories.splice(i, 1);
        i--;
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new FloatingMemories();
});
