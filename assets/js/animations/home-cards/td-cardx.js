// assets/js/animations/home-cards/td-card.js

function getInitialResponsiveValues() {
  const w = window.innerWidth;
  if (w < 640) {
    return {
      plane: { xPercent: -10, yPercent: -10, scale: 1.1 },
      suitcase: { xPercent: 20, yPercent: 60, scale: 0.8 },
    };
  } else if (w < 1281) {
    return {
      plane: { xPercent: 20, yPercent: -130, scale: 1.3 },
      suitcase: { xPercent: 50, yPercent: 200, scale: 0.1 },
    };
  } else {
    return {
      plane: { xPercent: 0, yPercent: 0, scale: 1.3 },
      suitcase: { xPercent: 50, yPercent: 200, scale: 0.1 },
    };
  }
}

function setInitialState(card) {
  const { plane, suitcase } = getInitialResponsiveValues();
  gsap.set(card.querySelector(".imuga-plane"), {
    xPercent: plane.xPercent,
    yPercent: plane.yPercent,
    scale: plane.scale,
  });
  gsap.set(card.querySelector(".imuga-suitcase"), {
    opacity: 0,
    xPercent: suitcase.xPercent,
    yPercent: suitcase.yPercent,
    scale: suitcase.scale,
  });
  gsap.set(card.querySelector(".imuga-banner"), { opacity: 0, y: 0 });
  gsap.set(card.querySelector(".imuga-title"), {
    color: "#fff",
    y: 0,
  });
  gsap.set(card.querySelector(".imuga-apply"), { opacity: 0, y: 30 });
}

function getResponsiveValues() {
  const w = window.innerWidth;
  if (w < 640) {
    return {
      plane: { xPercent: -10, yPercent: -10, scale: 1.1 },
      suitcase: { xPercent: 20, yPercent: 60, scale: 0.8 },
    };
  } else if (w < 1024) {
    return {
      plane: { xPercent: -20, yPercent: -20, scale: 1.2 },
      suitcase: { xPercent: 40, yPercent: 80, scale: 0.9 },
    };
  } else {
    return {
      plane: { xPercent: -30, yPercent: -30, scale: 1 },
      suitcase: { xPercent: 50, yPercent: 100, scale: 1 },
    };
  }
}

function setupImugaCard(card) {
  setInitialState(card);

  card.addEventListener("mouseenter", () => {
    const { plane, suitcase } = getResponsiveValues();
    gsap.killTweensOf([
      card,
      card.querySelector(".imuga-banner"),
      card.querySelector(".imuga-plane"),
      card.querySelector(".imuga-suitcase"),
      card.querySelector(".imuga-title"),
      card.querySelector(".imuga-apply"),
    ]);
    gsap.to(card, {
      background: "linear-gradient(135deg, #4fd1c5 0%, #a7f3d0 100%)",
      duration: 0.5,
      overwrite: "auto",
    });
    gsap.to(card.querySelector(".imuga-banner"), {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power1.in",
    });
    gsap.to(card.querySelector(".imuga-plane"), {
      xPercent: plane.xPercent,
      yPercent: plane.yPercent,
      scale: plane.scale,
      duration: 0.3,
      ease: "power1.in",
    });
    gsap.to(card.querySelector(".imuga-suitcase"), {
      opacity: 1,
      xPercent: suitcase.xPercent,
      yPercent: suitcase.yPercent,
      scale: suitcase.scale,
      duration: 0.5,
      ease: "power1.in",
    });
    gsap.to(card.querySelector(".imuga-title"), {
      color: "#111",
      y: -30,
      duration: 0.3,
    });
    gsap.to(card.querySelector(".imuga-apply"), {
      opacity: 1,
      y: -40,
      duration: 0.1,
      delay: 0.2,
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.killTweensOf([
      card,
      card.querySelector(".imuga-banner"),
      card.querySelector(".imuga-plane"),
      card.querySelector(".imuga-suitcase"),
      card.querySelector(".imuga-title"),
      card.querySelector(".imuga-apply"),
    ]);
    setInitialState(card);
    gsap.to(card, {
      background: "linear-gradient(310deg, #0C286B 0%, #3266E2 99%)",
      duration: 0.5,
      overwrite: "auto",
    });
    gsap.to(card.querySelector(".imuga-banner"), {
      opacity: 0,
      y: 0,
      duration: 0.3,
    });
    gsap.to(card.querySelector(".imuga-title"), {
      color: "#fff",
      y: 0,
      duration: 0.3,
    });
    gsap.to(card.querySelector(".imuga-apply"), {
      opacity: 0,
      y: 30,
      duration: 0.2,
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".imuga-card").forEach(setupImugaCard);

  // Re-apply initial state for all cards on resize (debounced for performance)
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      document.querySelectorAll(".imuga-card").forEach(setInitialState);
    }, 100);
  });
});
