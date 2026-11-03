import { useEffect } from "react";

const REVEAL_TARGETS = [
  "#mirae .mirae__title",
  "#history .history-head",
  "#history .history-block",
  "#jobs .jobs__header",
  "#jobs .jobs__item",
  "#jobs .jobs__more",
  "#news .news__header",
  "#news .news__item",
  "#welfare .welfare__header",
  "#welfare .welfare__item",
  "#tasks .tasks__intro",
  "#tasks .tasks__tab",
  "#tasks .tasks__card",
  "#requirement .requirement__title",
  "#requirement .requirement__tabs",
  "#requirement .requirement__candidate",
  "#requirement .requirement__bullets li",
  "#requirement .requirement__notice",
  "#requirement .requirement__process-group",
  "#exposition .exposition__intro",
  "#exposition .exposition__tab",
  "#exposition .exposition__region",
  "#exposition .exposition__day",
];

export function useScrollReveal(deps = []) {
  useEffect(() => {
    const delayByParent = new Map();
    const targetSelector = REVEAL_TARGETS.join(", ");
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                entry.target.classList.toggle("is-revealed", entry.isIntersecting);
              });
            },
            {
              root: null,
              rootMargin: "-20% 0px -20% 0px",
              threshold: 0,
            },
          )
        : null;

    function prepareTargets(newTargets) {
      const targets = newTargets.filter(
        (target) => !target.classList.contains("scroll-reveal"),
      );
      if (!targets.length) return;
      targets.forEach((target) => {
        const parent = target.parentElement;
        const delay = delayByParent.get(parent) || 0;
        target.style.setProperty("--reveal-delay", `${delay}ms`);
        delayByParent.set(parent, Math.min(delay + 70, 350));
        target.classList.add("scroll-reveal");
      });
      if (observer) {
        document.documentElement.offsetHeight;
        targets.forEach((target) => {
          target.classList.add("is-ready");
          observer.observe(target);
        });
      } else {
        targets.forEach((target) => {
          target.classList.add("is-revealed", "is-ready");
        });
      }
    }

    prepareTargets([...document.querySelectorAll(targetSelector)]);

    const exposition = document.querySelector("#exposition");
    let targetChanges;
    if (observer && exposition) {
      targetChanges = new MutationObserver((mutations) => {
        const addedTargets = [];
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;
            const removed = [];
            if (node.matches(".scroll-reveal")) removed.push(node);
            removed.push(...node.querySelectorAll(".scroll-reveal"));
            removed.forEach((target) => {
              if (!target.isConnected) observer.unobserve(target);
            });
          });
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;
            if (node.matches(targetSelector)) addedTargets.push(node);
            addedTargets.push(...node.querySelectorAll(targetSelector));
          });
        });
        prepareTargets(addedTargets);
      });
      targetChanges.observe(exposition, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      targetChanges?.disconnect();
    };
  }, deps);
}
