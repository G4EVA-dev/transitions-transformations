import gsap from "gsap";

const DESCRIPTIONS = {
  tree: {
    title: "Organic Growth Visualization",
    text: "Watch as nature comes to life in this mesmerizing visualization of organic growth. A simple seed transforms into a majestic tree, with branches emerging in a mathematically-inspired pattern based on the golden ratio.",
  },
  city: {
    title: "Urban Evolution",
    text: "Experience the dynamic evolution of a cityscape, where buildings rise from the ground in a carefully orchestrated sequence. This visualization represents urban development patterns and growth.",
  },
  emotion: {
    title: "Emotional Spectrum",
    text: "Dive into a visual journey through human emotions, represented through color theory and fluid dynamics. Each transformation represents different emotional states.",
  },
};

class SceneManager {
  constructor() {
    this.initializeDOMElements();

    if (this.checkElements()) {
      this.currentScene = "tree";
      this.timeline = null;
      this.autoProgressTween = null;
      this.progressValue = 0;

      this.initializeScenes();
      this.setupEventListeners();
      this.switchScene("tree");
    } else {
      console.error("Required DOM elements not found");
    }
  }

  initializeDOMElements() {
    this.scene = document.querySelector(".scene");
    this.progressBar = document.querySelector(".progress-bar");
    this.progressElement = document.querySelector(".progress");
    this.progressValueElement = document.querySelector(".progress-value");
    this.buttons = document.querySelectorAll(".btn");
    this.treeElement = document.querySelector(".tree");
    this.cityscapeElement = document.querySelector(".cityscape");
    this.emotionElement = document.querySelector(".emotion");
    this.descriptionElement = document.querySelector(".description");
  }

  checkElements() {
    return (
      this.scene &&
      this.progressBar &&
      this.progressElement &&
      this.buttons.length &&
      this.treeElement &&
      this.cityscapeElement &&
      this.emotionElement &&
      this.descriptionElement
    );
  }

  initializeScenes() {
    this.initializeTree();
    this.initializeCityscape();
  }

  initializeTree() {
    const branches = this.treeElement.querySelector(".branches");
    if (!branches) return;

    branches.innerHTML = "";
    for (let i = 0; i < 50; i++) {
      const branch = document.createElement("div");
      branch.className = "branch";
      branch.style.width = `${Math.random() * 40 + 20}px`;
      branch.style.height = `${Math.random() * 40 + 20}px`;
      branch.style.left = `${Math.random() * 200 - 100}px`;
      branch.style.bottom = `${Math.random() * 300}px`;
      branch.style.transform = "scale(0)";
      branch.style.opacity = "0";
      branches.appendChild(branch);
    }
  }

  initializeCityscape() {
    const buildings = this.cityscapeElement.querySelector(
      ".buildings-container"
    );
    if (!buildings) return;

    buildings.innerHTML = "";
    for (let i = 0; i < 15; i++) {
      const building = document.createElement("div");
      building.className = "building";
      building.style.width = `${Math.random() * 30 + 20}px`;
      building.style.height = "0";
      building.style.left = `${i * 40}px`;
      buildings.appendChild(building);
    }
  }

  updateDescription(sceneName) {
    const description = DESCRIPTIONS[sceneName];
    if (this.descriptionElement && description) {
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

    tl.to(this.treeElement, {
      opacity: 1,
      visibility: "visible",
      duration: 0.1,
    })
      .to(this.treeElement.querySelector(".trunk"), {
        height: 200,
        duration: 2,
        ease: "elastic.out(1, 0.75)",
      })
      .to(
        this.treeElement.querySelector(".branches"),
        {
          opacity: 1,
          duration: 0.5,
        },
        "-=1.5"
      )
      .to(
        this.treeElement.querySelectorAll(".branch"),
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
    }).to(this.cityscapeElement.querySelectorAll(".building"), {
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
    if (this.autoProgressTween) {
      this.autoProgressTween.kill();
    }

    this.progressValue = 0;
    this.updateProgress(0);

    this.autoProgressTween = gsap.to(this, {
      progressValue: 1,
      duration: 10,
      ease: "none",
      onUpdate: () => this.updateProgress(this.progressValue),
      onComplete: () => {
        this.progressValue = 0;
        this.startAutoProgress();
      },
    });
  }

  updateProgress(value) {
    if (this.timeline && this.progressElement) {
      this.timeline.progress(value);
      this.progressElement.style.width = `${value * 100}%`;
      if (this.progressValueElement) {
        this.progressValueElement.textContent = `${Math.round(value * 100)}%`;
      }
    }
  }

  switchScene(sceneName) {
    if (!this.checkElements()) return;

    // Kill any existing auto-progress animation
    if (this.autoProgressTween) {
      this.autoProgressTween.kill();
    }

    // Reset all scenes
    this.treeElement.classList.remove("active");
    this.cityscapeElement.classList.remove("active");
    this.emotionElement.classList.remove("active");

    // Reset visibilities
    gsap.set([this.treeElement, this.cityscapeElement, this.emotionElement], {
      visibility: "hidden",
      opacity: 0,
    });

    // Reset specific elements
    gsap.set(this.treeElement.querySelector(".trunk"), { height: 0 });
    gsap.set(this.treeElement.querySelectorAll(".branch"), {
      scale: 0,
      opacity: 0,
    });
    gsap.set(this.treeElement.querySelector(".branches"), { opacity: 0 });
    gsap.set(this.cityscapeElement.querySelectorAll(".building"), {
      height: 0,
    });
    gsap.set(this.emotionElement, { scale: 1 });

    this.currentScene = sceneName;

    // Activate appropriate scene
    switch (sceneName) {
      case "tree":
        this.treeElement.classList.add("active");
        this.timeline = this.createTreeTimeline();
        break;
      case "city":
        this.cityscapeElement.classList.add("active");
        this.timeline = this.createCityTimeline();
        break;
      case "emotion":
        this.emotionElement.classList.add("active");
        this.timeline = this.createEmotionTimeline();
        break;
    }

    this.updateDescription(sceneName);
    this.startAutoProgress();
  }

  setupEventListeners() {
    this.buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.switchScene(btn.dataset.scene);
      });
    });

    this.progressBar.addEventListener("click", (e) => {
      if (this.autoProgressTween) {
        this.autoProgressTween.kill();
      }

      const rect = this.progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const progressValue = Math.min(1, Math.max(0, x / rect.width));
      this.updateProgress(progressValue);

      // Restart auto progress after manual interaction
      setTimeout(() => this.startAutoProgress(), 2000);
    });
  }
}

// Initialize when DOM is loaded
window.addEventListener("load", () => {
  new SceneManager();
});
