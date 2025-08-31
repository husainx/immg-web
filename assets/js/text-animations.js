class TextAnimations {
  constructor() {
    this.isInitialized = false;
    this.animatedElements = new Set();
    this.defaultDuration = 0.8;
    this.defaultEase = "power2.out";
    this.protectedSelectors = new Set();

    // Animation type configurations
    this.animationTypes = {
      fadeInUp: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
      },
      fadeInDown: {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0 },
      },
      fadeInLeft: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
      },
      fadeInRight: {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
      },
      slideInUp: {
        initial: { opacity: 0, y: 100, clipPath: "inset(100% 0 0 0)" },
        animate: { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" },
      },
      typewriter: {
        initial: { width: 0, opacity: 1 },
        animate: { width: "100%" },
      },
      reveal: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
      },
      bounceIn: {
        initial: { opacity: 0, scale: 0.3 },
        animate: { opacity: 1, scale: 1 },
      },
      flipIn: {
        initial: { opacity: 0, rotationX: 90 },
        animate: { opacity: 1, rotationX: 0 },
      },
      letterSpacing: {
        initial: { opacity: 0, letterSpacing: "0.2em" },
        animate: { opacity: 1, letterSpacing: "normal" },
      },
    };

    // Element type to animation mapping
    this.elementAnimations = {
      h1: "fadeInUp",
      h2: "fadeInUp",
      h3: "fadeInLeft",
      h4: "fadeInRight",
      h5: "fadeInUp",
      h6: "fadeInUp",
      p: "fadeInUp",
      span: "reveal",
      div: "fadeInUp",
      li: "fadeInLeft",
      blockquote: "slideInUp",
      figcaption: "fadeInUp",
      label: "fadeInRight",
    };

    this.init();
  }

  init() {
    if (this.isInitialized) return;

    // Wait for DOM and GSAP to be ready
    if (typeof gsap === "undefined") {
      console.warn("GSAP not found. Loading from CDN...");
      this.loadGSAP().then(() => {
        this.setupAnimations();
      });
    } else {
      this.setupAnimations();
    }

    this.isInitialized = true;
  }

  loadGSAP() {
    return new Promise((resolve, reject) => {
      if (typeof gsap !== "undefined") {
        resolve();
        return;
      }

      // Load GSAP
      const gsapScript = document.createElement("script");
      gsapScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      gsapScript.onload = () => {
        // Load ScrollTrigger
        const scrollTriggerScript = document.createElement("script");
        scrollTriggerScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
        scrollTriggerScript.onload = () => {
          gsap.registerPlugin(ScrollTrigger);
          resolve();
        };
        scrollTriggerScript.onerror = reject;
        document.head.appendChild(scrollTriggerScript);
      };
      gsapScript.onerror = reject;
      document.head.appendChild(gsapScript);
    });
  }

  setupAnimations() {
    // Set up intersection observer for better performance
    this.setupIntersectionObserver();

    // Delay initial animation to avoid conflicts with page-specific animations
    setTimeout(() => {
      // Animate existing elements
      this.animateAllTextElements();
    }, 300);

    // Set up mutation observer for dynamic content
    this.setupMutationObserver();

    // Handle page navigation and component loading
    this.setupNavigationHandlers();
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -10% 0px",
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.animateElement(entry.target);
          this.intersectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
  }

  setupMutationObserver() {
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.processNewElement(node);
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  setupNavigationHandlers() {
    // Handle component loading (for header, footer, etc.)
    document.addEventListener("DOMContentLoaded", () => {
      // Re-scan after a delay to catch dynamically loaded components
      setTimeout(() => {
        this.animateAllTextElements();
      }, 500);
    });

    // Handle potential Alpine.js components
    document.addEventListener("alpine:init", () => {
      setTimeout(() => {
        this.animateAllTextElements();
      }, 100);
    });
  }

  processNewElement(element) {
    // Check if the element itself should be animated
    if (this.shouldAnimateElement(element)) {
      this.intersectionObserver.observe(element);
    }

    // Check child elements
    const textElements = element.querySelectorAll(this.getTextSelectors());
    textElements.forEach((el) => {
      if (this.shouldAnimateElement(el)) {
        this.intersectionObserver.observe(el);
      }
    });
  }

  getTextSelectors() {
    return 'h1, h2, h3, h4, h5, h6, p, span, div[class*="text"], li, blockquote, figcaption, label, .animate-text';
  }

  shouldAnimateElement(element) {
    // Skip if already animated
    if (this.animatedElements.has(element)) return false;

    // Skip if element has no text content
    if (!element.textContent.trim()) return false;

    // Skip if element is hidden
    if (element.offsetParent === null) return false;

    // Skip if element has data-no-animate attribute
    if (element.hasAttribute("data-no-animate")) return false;

    // Skip if inside a parent that shouldn't be animated
    if (element.closest("[data-no-animate]")) return false;

    // Skip script and style elements
    if (["SCRIPT", "STYLE", "META", "LINK"].includes(element.tagName))
      return false;

    // Skip elements that are part of existing GSAP animations
    if (this.hasExistingGSAPAnimation(element)) return false;

    // Skip elements in specific animated sections
    if (this.isInAnimatedSection(element)) return false;

    return true;
  }

  hasExistingGSAPAnimation(element) {
    // Check if element has GSAP animation data
    if (element._gsap) return true;

    // Check if any parent has GSAP animation data (up to 3 levels)
    let parent = element.parentElement;
    let level = 0;
    while (parent && level < 3) {
      if (parent._gsap) return true;
      parent = parent.parentElement;
      level++;
    }

    return false;
  }

  isInAnimatedSection(element) {
    // List of selectors for sections with custom animations
    const animatedSectionSelectors = [
      ".timeline-item",
      ".document-slide",
      ".document-content",
      ".document-image-container",
      ".comparison-row",
      ".comparison-card",
      "#passport-timeline",
      "#passport-documents",
      ".passport-slideshow",
      ".hero-content",
      ".hero-passports",
      ".card-container",
      ".large-card",
      ".security-card",
      ".security-sub-features",
      ".imuga-card", // From the card animations
      "[x-data]", // Alpine.js components that might have their own animations
    ];

    // Add any dynamically registered protected selectors
    const allSelectors = [
      ...animatedSectionSelectors,
      ...this.protectedSelectors,
    ];

    // Check if element or its parents match any animated section
    for (const selector of allSelectors) {
      if (element.matches && element.matches(selector)) return true;
      if (element.closest && element.closest(selector)) return true;
    }

    return false;
  }

  // Public method to add protected selectors
  addProtectedSelector(selector) {
    this.protectedSelectors.add(selector);
  }

  // Public method to remove protected selectors
  removeProtectedSelector(selector) {
    this.protectedSelectors.delete(selector);
  }

  animateAllTextElements() {
    const textElements = document.querySelectorAll(this.getTextSelectors());

    textElements.forEach((element) => {
      if (this.shouldAnimateElement(element)) {
        this.intersectionObserver.observe(element);
      }
    });
  }

  getAnimationType(element) {
    // Check for custom animation type
    const customType = element.getAttribute("data-animation");
    if (customType && this.animationTypes[customType]) {
      return customType;
    }

    // Check for animation class
    const classList = Array.from(element.classList);
    for (const className of classList) {
      if (
        className.startsWith("animate-") &&
        this.animationTypes[className.replace("animate-", "")]
      ) {
        return className.replace("animate-", "");
      }
    }

    // Use default based on element type
    const tagName = element.tagName.toLowerCase();
    return this.elementAnimations[tagName] || "fadeInUp";
  }

  getAnimationDelay(element, index = 0) {
    // Check for custom delay
    const customDelay = element.getAttribute("data-delay");
    if (customDelay) return parseFloat(customDelay);

    // Auto-stagger based on element position
    return index * 0.1;
  }

  getAnimationDuration(element) {
    // Check for custom duration
    const customDuration = element.getAttribute("data-duration");
    if (customDuration) return parseFloat(customDuration);

    // Different durations based on element type
    const tagName = element.tagName.toLowerCase();
    switch (tagName) {
      case "h1":
        return 1.0;
      case "h2":
        return 0.9;
      case "h3":
        return 0.8;
      case "h4":
      case "h5":
      case "h6":
        return 0.7;
      case "p":
        return 0.8;
      case "span":
        return 0.5;
      default:
        return this.defaultDuration;
    }
  }

  animateElement(element, index = 0) {
    if (this.animatedElements.has(element)) return;

    const animationType = this.getAnimationType(element);
    const animation = this.animationTypes[animationType];
    const delay = this.getAnimationDelay(element, index);
    const duration = this.getAnimationDuration(element);

    // Mark as animated
    this.animatedElements.add(element);

    // Set initial state
    gsap.set(element, animation.initial);

    // Create animation timeline
    const tl = gsap.timeline({
      delay: delay,
      onComplete: () => {
        element.style.willChange = "auto";
      },
    });

    // Add will-change for performance
    element.style.willChange = "transform, opacity";

    // Handle special animation types
    if (animationType === "typewriter") {
      this.createTypewriterAnimation(element, tl, duration);
    } else if (animationType === "bounceIn") {
      tl.to(element, {
        ...animation.animate,
        duration: duration,
        ease: "back.out(1.7)",
      });
    } else if (animationType === "flipIn") {
      tl.to(element, {
        ...animation.animate,
        duration: duration,
        ease: "power2.out",
        transformOrigin: "center bottom",
      });
    } else {
      // Standard animation
      tl.to(element, {
        ...animation.animate,
        duration: duration,
        ease: this.defaultEase,
      });
    }

    // Add hover animations for interactive elements
    this.addHoverAnimations(element);
  }

  createTypewriterAnimation(element, timeline, duration) {
    const text = element.textContent;
    element.textContent = "";
    element.style.overflow = "hidden";
    element.style.whiteSpace = "nowrap";
    element.style.borderRight = "2px solid";
    element.style.animation = `blink 1s infinite`;

    // Add CSS for blinking cursor
    if (!document.querySelector("#typewriter-styles")) {
      const style = document.createElement("style");
      style.id = "typewriter-styles";
      style.textContent = `
        @keyframes blink {
          0%, 50% { border-color: transparent; }
          51%, 100% { border-color: currentColor; }
        }
      `;
      document.head.appendChild(style);
    }

    // Animate typing
    timeline.to(element, {
      duration: duration,
      ease: "none",
      onUpdate: function () {
        const progress = this.progress();
        const currentLength = Math.floor(progress * text.length);
        element.textContent = text.substring(0, currentLength);
      },
      onComplete: () => {
        element.style.borderRight = "none";
        element.style.animation = "none";
      },
    });
  }

  addHoverAnimations(element) {
    // Add hover effects for headings and interactive elements
    if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(element.tagName)) {
      element.addEventListener("mouseenter", () => {
        gsap.to(element, {
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      element.addEventListener("mouseleave", () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }
  }

  // Public methods for manual control
  animateElementsInContainer(container) {
    const textElements = container.querySelectorAll(this.getTextSelectors());
    textElements.forEach((element, index) => {
      if (this.shouldAnimateElement(element)) {
        setTimeout(() => {
          this.animateElement(element, index);
        }, index * 100);
      }
    });
  }

  resetAnimations() {
    this.animatedElements.clear();
    // Re-observe all elements
    this.animateAllTextElements();
  }

  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    this.animatedElements.clear();
    this.isInitialized = false;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Small delay to ensure all other scripts are loaded
  setTimeout(() => {
    window.textAnimations = new TextAnimations();
  }, 100);
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = TextAnimations;
}

// Global utility functions
window.animateText = {
  // Manually animate a specific element
  animate: (element, type = "fadeInUp", delay = 0) => {
    if (window.textAnimations) {
      element.setAttribute("data-animation", type);
      element.setAttribute("data-delay", delay);
      window.textAnimations.animateElement(element);
    }
  },

  // Animate all text elements in a container
  animateContainer: (container) => {
    if (window.textAnimations) {
      window.textAnimations.animateElementsInContainer(container);
    }
  },

  // Reset all animations
  reset: () => {
    if (window.textAnimations) {
      window.textAnimations.resetAnimations();
    }
  },

  // Add protected selector to avoid conflicts
  protect: (selector) => {
    if (window.textAnimations) {
      window.textAnimations.addProtectedSelector(selector);
    }
  },

  // Remove protected selector
  unprotect: (selector) => {
    if (window.textAnimations) {
      window.textAnimations.removeProtectedSelector(selector);
    }
  },

  // Check if element would be animated
  wouldAnimate: (element) => {
    if (window.textAnimations) {
      return window.textAnimations.shouldAnimateElement(element);
    }
    return false;
  },
};
