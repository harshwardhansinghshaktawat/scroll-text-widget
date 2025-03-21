class ScrollText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.elements = [];
    this.headlineOffset = 0;
    this.topDistance = 0;
    this.movement = 0;
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
    // Use the original scroll listener logic
    this.handleScroll = () => this.animateScroll();
    window.addEventListener('scroll', this.handleScroll);
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  move(element, distance) {
    const translate3d = `translate3d(0, ${distance}px, 0)`;
    element.style['-webkit-transform'] = translate3d;
    element.style['-moz-transform'] = translate3d;
    element.style['-ms-transform'] = translate3d;
    element.style['-o-transform'] = translate3d;
    element.style.transform = translate3d;
  }

  fadeOut(element, scrollDistance, tweenDistance) {
    element.style.opacity = (tweenDistance - scrollDistance) / tweenDistance;
  }

  animateScroll() {
    const tweenDistance = parseFloat(this.getAttribute('tween-distance')) || this.tweenDistance;
    this.topDistance = window.scrollY; // Original uses pageYOffset, scrollY is equivalent
    this.movement = this.topDistance * 2;

    this.elements.forEach((element) => {
      this.movement = -(this.topDistance * element.dataset.speed);
      this.move(element, this.movement);
      this.fadeOut(element, this.topDistance, tweenDistance);
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
    this.tweenDistance = parseFloat(this.getAttribute('tween-distance')) || this.getRandomArbitrary(200, 400);
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
          text-align: ${textAlignment};
          max-width: 80vw; /* For wrapping */
        }

        .headline {
          margin: 0;
          font-weight: 700;
          color: ${fontColor};
          text-transform: uppercase;
          display: inline-block;
          opacity: 1; /* Ensure text is visible initially */
        }

        .headline span {
          display: inline-block;
          box-sizing: border-box;
          padding: 0 0.2vw;
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
    this.headlineOffset = headline.offsetTop; // Store initial offset

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
