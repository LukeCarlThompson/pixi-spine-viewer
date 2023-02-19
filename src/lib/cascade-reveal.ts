// TODO: Make some options be able to be passed in to the use:action directive

interface StoreItemProps {
  target: Element;
  docTop: number;
  docLeft: number;
}

let store: StoreItemProps[] = [];

let ready = true;

const itemDelay = 50;

const animateNext = () => {
  if (store.length > 0 && ready) {
    ready = false;

    setTimeout(() => {
      // Sort the list based on distance from the top of the node to the top of the document
      store.sort((a, b) => {
        if (a.docTop === b.docTop) {
          return a.docLeft - b.docLeft;
        } else {
          return a.docTop - b.docTop;
        }
      });

      // Get the next item
      const nextItem = store[0]?.target;
      // Check if item still exists just in case it unmounted before the timeout
      if (nextItem) {
        // and remove it from the store
        store = [...store.slice(1)];
        // Set it to in view
        nextItem.setAttribute('data-in-view', 'true');
      }

      // Ready for the next one
      ready = true;

      // Trigger the next one
      animateNext();
    }, itemDelay);
  }
};

const inViewCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Remove item from observer
      observer.unobserve(entry.target);

      // If item is not already in the list then add it to the end
      const notInStore = store.filter((item) => item.target === entry.target).length === 0;

      if (notInStore) {
        const storeEntry: StoreItemProps = {
          target: entry.target,
          // Add the distance to the top of the document from the element
          docTop: entry.boundingClientRect.y + window.pageYOffset,
          docLeft: entry.boundingClientRect.x,
        };

        // Add the item to the global store
        store.push(storeEntry);

        // Kick start the animation cascade
        animateNext();
      }
    }
  });
};

interface observerOptionsProps {
  rootMargin?: string;
  threshold?: number;
}

const observerDefaultOptions = {
  root: null,
  rootMargin: '0px 50px 0px 50px',
  threshold: 0,
};

const reveal = (node: HTMLElement, options?: observerOptionsProps) => {
  const iOSupport =
    'IntersectionObserver' in window ||
    'IntersectionObserverEntry' in window ||
    'intersectionRatio' in (window as any).IntersectionObserverEntry.prototype;

  if (iOSupport) {
    const observer = new IntersectionObserver(inViewCallback, {
      ...observerDefaultOptions,
      ...options,
    });

    observer.observe(node);
    // destroy runs when node is unmounted
    return {
      destroy() {
        // Remove the node from the observer
        observer.unobserve(node);
      },
    };
  } else {
    // No intersection observer so just animate everything in now
    node.setAttribute('data-in-view', 'true');
  }
};

export { reveal };
