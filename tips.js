// Button Tooltips with Fun Messages
class ButtonTooltips {
  constructor() {
    this.tooltipContainer = null;
    this.activeTooltip = null;

    this.tooltipMessages = {
      default: [
        "Click me, I'm magic!",
        "I'm a friendly button!",
        "Push me, please!",
        "I don't bite, promise!",
        "Let's go on an adventure!"
      ],
      createVault: [
        "Ready to save memories?",
        "Time travel starts here!",
        "Future you will be thankful!",
        "Make your future self smile!",
        "Memories going into the vault!"
      ],
      signin: [
        "Welcome back, time traveler!",
        "Your memories await!",
        "Unlock your time capsules!",
        "The key to your memories!",
        "Time to revisit the past!"
      ],
      signup: [
        "Join the time travelers!",
        "Start your memory journey!",
        "Future you will thank you!",
        "Become a memory keeper!",
        "First step to time travel!"
      ],
      unlockDate: [
        "When will the magic happen?",
        "Pick a date for future you!",
        "Shhh, it's a secret until then!",
        "Time machine is warming up!",
        "When should this appear again?"
      ]
    };

    this.initialize();
  }

  initialize() {
    this.createTooltipContainer();
    this.setupEventListeners();
    this.injectAnimations();
  }

  createTooltipContainer() {
    this.tooltipContainer = document.createElement('div');
    this.tooltipContainer.className = 'button-tooltip-container';
    this.tooltipContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10000;
    `;
    document.body.appendChild(this.tooltipContainer);
  }

  setupEventListeners() {
    const buttons = document.querySelectorAll('a.hand-drawn-button, a.cta-button, button, .create-button');

    buttons.forEach(button => {
      let messageType = 'default';
      const btnText = button.textContent.trim().toLowerCase();

      if (btnText.includes('create') || button.id === 'create-vault-btn') {
        messageType = 'createVault';
      } else if (btnText.includes('sign in') || button.href?.includes('signin')) {
        messageType = 'signin';
      } else if (btnText.includes('sign up') || button.href?.includes('signup')) {
        messageType = 'signup';
      }

      button.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target, messageType);
      });

      button.addEventListener('mouseleave', () => {
        this.hideTooltip(); 
      });

      button.addEventListener('mousemove', (e) => {
        if (this.activeTooltip) {
          const offset = 20;
          this.activeTooltip.style.left = `${e.clientX + offset}px`;
          this.activeTooltip.style.top = `${e.clientY + offset}px`;
        }
      });
    });

    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
      input.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target, 'unlockDate');
      });

      input.addEventListener('mouseleave', () => {
        this.hideTooltip(); // instantly remove
      });

      input.addEventListener('mousemove', (e) => {
        if (this.activeTooltip) {
          this.activeTooltip.style.left = `${e.clientX + 20}px`;
          this.activeTooltip.style.top = `${e.clientY + 20}px`;
        }
      });
    });
  }

  showTooltip(element, messageType) {
    if (!this.activeTooltip) {
      this.activeTooltip = document.createElement('div');
      this.activeTooltip.className = 'button-tooltip';
      this.tooltipContainer.appendChild(this.activeTooltip);
    }

    const messages = this.tooltipMessages[messageType] || this.tooltipMessages.default;
    const message = messages[Math.floor(Math.random() * messages.length)];

    this.activeTooltip.textContent = message;

    // Reset default style
    this.activeTooltip.style.backgroundColor = '#FFFFFF';
    this.activeTooltip.style.color = '#333333';
    this.activeTooltip.style.animation = 'tooltipBounce 0.3s forwards';

    // Special background for types
    if (messageType === 'unlockDate') {
      this.activeTooltip.style.backgroundColor = '#FFD1DC';
    } else if (messageType === 'createVault') {
      this.activeTooltip.style.backgroundColor = '#6BD3D7';
      this.activeTooltip.style.color = '#FFFFFF';
    }

    const rect = element.getBoundingClientRect();
    this.activeTooltip.style.left = `${rect.right + 10}px`;
    this.activeTooltip.style.top = `${rect.top}px`;
  }

  hideTooltip() {
    if (this.activeTooltip && this.activeTooltip.parentNode) {
      this.activeTooltip.style.animation = 'tooltipFadeOut 0.2s forwards';

      setTimeout(() => {
        if (this.activeTooltip && this.activeTooltip.parentNode) {
          this.activeTooltip.parentNode.removeChild(this.activeTooltip);
          this.activeTooltip = null;
        }
      }, 200);
    }
  }

  injectAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes tooltipBounce {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.1); opacity: 0.9; }
        100% { transform: scale(1); opacity: 1; }
      }

      @keyframes tooltipFadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    new ButtonTooltips();
  }, 500); 
});
