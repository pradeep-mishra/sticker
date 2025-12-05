/**
 * Generate a CSS selector for an element that can be used to re-find it later.
 * Prioritizes: ID > unique class combinations > nth-child path
 */
export const generateSelector = (element: Element): string => {
  // If element has an ID, use it (most reliable)
  if (element.id) {
    return `#${CSS.escape(element.id)}`;
  }

  const path: string[] = [];
  let current: Element | null = element;

  while (
    current &&
    current !== document.body &&
    current !== document.documentElement
  ) {
    let selector = current.tagName.toLowerCase();

    // Try using ID if available
    if (current.id) {
      path.unshift(`#${CSS.escape(current.id)}`);
      break;
    }

    // Try using unique class combination
    const uniqueClass = getUniqueClassSelector(current);
    if (uniqueClass) {
      selector = uniqueClass;
    } else {
      // Use nth-child for disambiguation
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          (child) => child.tagName === current!.tagName
        );
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          selector += `:nth-of-type(${index})`;
        }
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  // Add body prefix for full path
  if (path.length > 0 && !path[0].startsWith("#")) {
    path.unshift("body");
  }

  return path.join(" > ");
};

/**
 * Try to find a unique class combination for the element
 */
const getUniqueClassSelector = (element: Element): string | null => {
  const classes = Array.from(element.classList);
  if (classes.length === 0) return null;

  const tag = element.tagName.toLowerCase();

  // Try single classes first
  for (const cls of classes) {
    const selector = `${tag}.${CSS.escape(cls)}`;
    const matches = document.querySelectorAll(selector);
    if (matches.length === 1 && matches[0] === element) {
      return selector;
    }
  }

  // Try combinations of 2 classes
  if (classes.length >= 2) {
    for (let i = 0; i < classes.length; i++) {
      for (let j = i + 1; j < classes.length; j++) {
        const selector = `${tag}.${CSS.escape(classes[i])}.${CSS.escape(classes[j])}`;
        const matches = document.querySelectorAll(selector);
        if (matches.length === 1 && matches[0] === element) {
          return selector;
        }
      }
    }
  }

  return null;
};

/**
 * Find an element by its selector
 * Returns null if element not found (orphan note case)
 */
export const findElement = (selector: string): Element | null => {
  try {
    return document.querySelector(selector);
  } catch {
    // Invalid selector
    return null;
  }
};

