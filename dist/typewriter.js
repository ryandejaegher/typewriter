(function () {
    const template = document.createElement("template");
    template.innerHTML = `
  
  <style>
  
  :host {
  display: inline-flex;
  }
  

  
 :host([cursor]) .cursor:after {
    content: '|';
    animation: cursor 0.5s ease infinite alternate;
    display: inline-block;
    transform: translateY(0px) scale(1.3);
  }
  
  .typewriter {
    display: flex;
  }
  
  @keyframes cursor {
    0% {
      opacity: 0;
    }
  
    100% {
      opacity: 1;
    }
  }
  
  </style>
  
  
  <div class="typewriter">
      <span class="cursor"><slot></slot></span>
  </div>
  `;
  
    class Typewriter extends HTMLElement {
      constructor() {
        super();
  
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.text = this.textContent;
        this.timers = [];
        this.observerConfig = {
          root: document,
          rootMargin: "0% 0% -10% 0%",
          threshold: 1
        };
  
        this.observer = new IntersectionObserver(
          this.obCallback.bind(this),
          this.observerConfig
        );
        this.observer.observe(this);
      }
  
      get timing() {
        return this.hasAttribute("timing");
      }
  
      set timing(val) {
        if (val) {
          this.setAttribute("timing", val);
        } else {
          this.removeAttribute("timing");
        }
      }
  
      clearTimers(timers) {
        timers.map((item) => {
          clearTimeout(item);
        });
        this.timers = [];
      }
  
      typewriteText(element) {
        this.clearTimers(this.timers);
        var timing = element.getAttribute("timing");
        var word = this.text;
        var itemLetters = word.split("");
        console.log(word);
  
        this.clearText(element);
  
        itemLetters.forEach((letter, index) => {
          var totalLetters = itemLetters.length;
          var delay = timing / totalLetters;
          var step = delay * (index + 1);
          let timer = setTimeout(function () {
            element.textContent += letter;
          }, step);
          this.timers.push(timer);
        });
      }
  
      clearText(element) {
        element.textContent = "";
      }
  
      obCallback(entry) {
        if (entry[0].isIntersecting === true) {
          this.typewriteText(this);
          this.observer.unobserve(this);
        } else {
          console.log("out of view");
        }
      }
  
      connectedCallback() {
        this.clearText(this);
      }
    }
    window.customElements.define("typewrite-text", Typewriter);
  })();