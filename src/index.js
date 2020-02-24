/**
 * Web Component based transformation with actions
 */
class CloudinaryTransformation extends HTMLElement {
  constructor() {
    super();
    // we can also iterate over all children, and listen to type 'ACTION' to be more generic
    this.children[0].addEventListener('RESIZE', (event) => {
      let transEvent = new CustomEvent('TRANSFORMATION', {detail: event.detail});
      this.dispatchEvent(transEvent);
    });
  }
}

class Resize extends HTMLElement {
  constructor() {
    super();
    // attributes from the HTML
    let width = this.attributes.width.value;
    let height = this.attributes.height.value;

    // potential things we can do with resize, naive implementation
    let comps = [
      width && `w_${width}`,
      height && `h_${height}`,
    ];

    // remove things that aren't defined
    let str = comps.filter((a) => {
      return a;
    }).join(',');

    let resizeEvent = new CustomEvent('RESIZE', {detail: str}, {bubbles: false});
    this.dispatchEvent(resizeEvent);
  }
}

class CloudinaryImage extends HTMLElement {
  constructor() {
    super();

    // we could also iterate over all children and set up events on each of them
    this.children[0].addEventListener('TRANSFORMATION', (event) => {
      let transformation = event.detail;
      let img = document.createElement('img');

      let publicID = this.attributes.publicID.value;
      let cloud = this.attributes.cloud.value;

      let URL = `https://res.cloudinary.com/${cloud}/image/upload/${transformation}/${publicID}`;
      let shadowRoot = this.attachShadow({mode: 'open'});

      // remove all children once we're done
      this.innerHTML = '';
      img.setAttribute('src', URL);
      shadowRoot.appendChild(img);
    });
  }
}

// this is the order by which they're executed.. order matters!
customElements.define('cld-image', CloudinaryImage);
customElements.define('cld-transform', CloudinaryTransformation);
customElements.define('cld-resize', Resize);
