import gsap from "gsap";

const DESCRIPTIONS = {
  tree: {
    title: "Organic Growth Visualization",
    text: "Watch as nature comes to life in this mesmerizing visualization of organic growth. A simple seed transforms into a majestic tree, with branches emerging in a mathematically-inspired pattern based on the golden ratio. This animation demonstrates the beauty of natural patterns and fractal geometry.",
  },
  city: {
    title: "Urban Evolution",
    text: "Experience the dynamic evolution of a cityscape, where buildings rise from the ground in a carefully orchestrated sequence. This visualization represents urban development patterns, with building heights following real-world architectural distributions and growth patterns inspired by actual city development.",
  },
  emotion: {
    title: "Emotional Spectrum",
    text: "Dive into a visual journey through human emotions, represented through color theory and fluid dynamics. Each transformation represents different emotional states, with colors chosen based on psychological research and movements inspired by natural phenomena.",
  },
};

class SceneManager {
  constructor() {
    this.initializeDOMElements();

    if (this.checkElements()) {
      this.currentScene = "tree";
      this.timeline = null;
      this.progress = 0;

      this.initializeScenes();
      this.setupEventListeners();
      this.switchScene("tree");
      this.startAutoProgress();
    }
  }

  initializeDOMElements() {
    // ... (previous DOM element initialization)
    this.descriptionElement = document.querySelector(".description");
    this.progressValue = document.querySelector(".progress-value");
  }

  updateDescription(sceneName) {
    const description = DESCRIPTIONS[sceneName];
    if (this.descriptionElement && description) {
      this.descriptionElement.classList.remove("active");

      gsap.to(this.descriptionElement, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          this.descriptionElement.innerHTML = `
                        <h2>${description.title}</h2>
                        <p>${description.text}</p>
                    `;

          gsap.to(this.descriptionElement, {
            opacity: 1,
            y: 0,
            duration: 0.5,
          });
        },
      });
    }
  }

  createTreeTimeline() {
    const tl = gsap.timeline({ paused: true });

    // Enhanced tree growth animation
    tl.to(this.treeElement, {
      opacity: 1,
      visibility: "visible",
      duration: 0.1,
    })
      .to(".trunk", {
        height: 200,
        duration: 2,
        ease: "elastic.out(1, 0.75)",
      })
      .to(
        ".branches",
        {
          opacity: 1,
          duration: 0.5,
        },
        "-=1.5"
      )
      .to(
        ".branch",
        {
          scale: 1,
          opacity: 1,
          rotation: "random(-45, 45)",
          duration: 1.5,
          stagger: {
            amount: 2,
            from: "random",
            ease: "power2.out",
          },
        },
        "-=1"
      );

    return tl;
  }

  createCityTimeline() {
    const tl = gsap.timeline({ paused: true });

    tl.to(this.cityscapeElement, {
      opacity: 1,
      visibility: "visible",
      duration: 0.1,
    }).to(".building", {
      height: () => Math.random() * 200 + 100,
      duration: 2,
      stagger: {
        amount: 1.5,
        from: "center",
        ease: "power4.out",
      },
      ease: "elastic.out(1, 0.75)",
    });

    return tl;
  }

  createEmotionTimeline() {
    const tl = gsap.timeline({ paused: true });
    const emotions = [
      { color: "#FF6B6B", scale: 1.4 },
      { color: "#4ECDC4", scale: 1.2 },
      { color: "#45B7D1", scale: 1.6 },
      { color: "#96CEB4", scale: 1.3 },
      { color: "#FFEEAD", scale: 1.5 },
    ];

    tl.to(this.emotionElement, {
      opacity: 1,
      visibility: "visible",
      duration: 0.1,
    });

    emotions.forEach(({ color, scale }) => {
      tl.to(this.emotionElement, {
        backgroundColor: color,
        scale,
        duration: 1,
        ease: "sine.inOut",
      }).to(this.emotionElement, {
        scale: 1,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      });
    });

    return tl;
  }

  startAutoProgress() {
    gsap.to(this, {
      progress: 1,
      duration: 5,
      ease: "none",
      onUpdate: () => this.updateProgress(this.progress),
      onComplete: () => {
        this.progress = 0;
        this.startAutoProgress();
      },
    });
  }

  updateProgress(value) {
    if (this.timeline && this.progress) {
      this.timeline.progress(value);
      this.progress.style.width = `${value * 100}%`;
      this.progressValue.textContent = `${Math.round(value * 100)}%`;
    }
  }

  // ... (rest of your existing methods)
}
