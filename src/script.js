// main.js
import gsap from "gsap";

class SceneManager {
  constructor() {
    this.scene = document.querySelector(".scene");
    this.progressBar = document.querySelector(".progress-bar");
    this.progress = document.querySelector(".progress");
    this.buttons = document.querySelectorAll(".btn");
    this.treeElement = document.querySelector(".tree");
    this.cityscapeElement = document.querySelector(".cityscape");
    this.emotionElement = document.querySelector(".emotion");
    this.currentScene = "tree";
    this.timeline = null;

    this.initializeScenes();
    this.setupEventListeners();
    this.switchScene("tree");
  }

  initializeScenes() {
    this.initializeTree();
    this.initializeCityscape();
  }

  initializeTree() {
    const branches = document.querySelector(".branches");
    branches.innerHTML = "";
    for (let i = 0; i < 50; i++) {
      const branch = document.createElement("div");
      branch.className = "branch";
      branch.style.width = `${Math.random() * 40 + 20}px`;
      branch.style.height = `${Math.random() * 40 + 20}px`;
      branch.style.left = `${Math.random() * 200 - 100}px`;
      branch.style.bottom = `${Math.random() * 300}px`;
      branches.appendChild(branch);
    }
  }

  initializeCityscape() {
    const cityscape = document.querySelector(".buildings-container");
    cityscape.innerHTML = "";
    for (let i = 0; i < 15; i++) {
      const building = document.createElement("div");
      building.className = "building";
      building.style.height = "0";
      cityscape.appendChild(building);
    }
  }

  createTreeTimeline() {
    const tl = gsap.timeline({ paused: true });
    tl.to(".trunk", { height: 200, duration: 2, ease: "power2.out" })
      .to(".branches", { opacity: 1, duration: 1 }, "-=1")
      .to(".branch", {
        scale: 1,
        opacity: 1,
        stagger: { amount: 2, from: "random" },
        ease: "power2.out",
      });
    return tl;
  }

  createCityTimeline() {
    const tl = gsap.timeline({ paused: true });
    tl.to(".building", {
      height: () => Math.random() * 200 + 100,
      duration: 2,
      stagger: { amount: 1.5, from: "center" },
      ease: "power2.out",
    });
    return tl;
  }

  createEmotionTimeline() {
    const tl = gsap.timeline({ paused: true });
    const emotions = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];

    emotions.forEach((color) => {
      tl.to(".emotion", {
        backgroundColor: color,
        scale: 1.2,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      }).to(".emotion", {
        scale: 1,
        duration: 1,
        ease: "power2.inOut",
      });
    });

    return tl;
  }

  switchScene(sceneName) {
    // Reset all scenes
    this.treeElement.classList.remove("active");
    this.cityscapeElement.classList.remove("active");
    this.emotionElement.classList.remove("active");

    // Reset animations
    gsap.set(".trunk", { height: 0 });
    gsap.set(".branch", { scale: 0, opacity: 0 });
    gsap.set(".branches", { opacity: 0 });
    gsap.set(".building", { height: 0 });
    gsap.set(".emotion", { opacity: 0, scale: 1 });

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

    this.updateProgress(0);
  }

  updateProgress(value) {
    if (this.timeline) {
      this.timeline.progress(value);
      this.progress.style.width = `${value * 100}%`;
    }
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
      const rect = this.progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const progressValue = x / rect.width;
      this.updateProgress(Math.min(1, Math.max(0, progressValue)));
    });
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new SceneManager();
});
