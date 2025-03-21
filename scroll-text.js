class ScrollText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.elements = [];
  }

  static get observedAttributes() {
    return [
      'text', 'font-size', 'font-family', 'font-color', 
      'background-start', 'background-end', 'heading-tag', 
      'tween-distance', 'text-alignment'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.handleScroll = () => this.animateScroll();
    window.addEventListener('scroll', this.handleScroll);
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  move(element, distance) {
    element.style.transform = `translateY(${distance}px)`;
  }

  fadeOut(element, scrollDistance, tweenDistance) {
    element.style.opacity = (tweenDistance - scrollDistance) / tweenDistance;
  }

  animateScroll() {
    const topDistance = window.pageYOffset;
    const tweenDistance = parseFloat(this.getAttribute('tween-distance')) || 300;

    this.elements.forEach((element) => {
      const movement = -(topDistance * parseFloat(element.dataset.speed));
      this.move(element, movement);
      this.fadeOut(element, topDistance, tweenDistance);
    });
  }

  render() {
    const text = this.getAttribute('text') || 'Scroll Magic';
    const fontSize = parseFloat(this.getAttribute('font-size')) || 4; // In vw
    const fontFamily = this.getAttribute('font-family') || 'Roboto';
    const fontColor = this.getAttribute('font-color') || '#E8EAF6';
    const backgroundStart = this.getAttribute('background-start') || '#1A237E';
    const backgroundEnd = this.getAttribute('background-end') || '#7986CB';
    const headingTag = this.getAttribute('heading-tag') || 'h1';
    const tweenDistance = parseFloat(this.getAttribute('tween-distance')) || 300;
    const textAlignment = this.getAttribute('text-alignment') || 'center';

    // Clear previous elements
    this.elements = [];

    // Split text into letters, filter out spaces
    const letters = text.split('').filter(letter => letter.trim() !== '');

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        :host {
          width: 100vw;
          height: 100vh;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(90deg, ${backgroundStart}, ${backgroundEnd});
          overflow: hidden;
        }

        .headline-container {
          position: relative;
          text-align: ${text-alignment};
          max-width: 80vw; /* For wrapping */
        }

        .headline {
          margin: 0;
          opacity: 0; /* Starts hidden, fades in on scroll */
          font-weight: 700;
          color: ${fontColor};
          text-transform: uppercase;
          display: inline-block;
        }

        .headline span {
          display: inline-block;
          box-sizing: border-box;
          padding: 0 0.2vw; /* Adjusted for responsiveness */
          font-size: ${fontSize}vw;
          font-family: ${fontFamily}, sans-serif;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
      </style>
      <div class="headline-container">
        <${headingTag} class="headline"></${headingTag}>
      </div>
    `;

    const headline = this.shadowRoot.querySelector('.headline');
    letters.forEach((letter) => {
      const element = document.createElement('span');
      element.innerText = letter;
      element.dataset.speed = Math.random().toFixed(2); // Random speed between 0 and 1
      headline.appendChild(element);
      this.elements.push(element);
    });

    // Trigger initial animation
    this.animateScroll();
  }
}

customElements.define('scroll-text', ScrollText);
