/**
 * Shared Position Manager
 * Single debounced scroll/resize handler shared by all sticky notes
 * Prevents performance issues with many event listeners
 */

type PositionCallback = () => void;

class PositionManager {
  private callbacks = new Set<PositionCallback>();
  private isListening = false;
  private rafId: number | null = null;
  private pendingUpdate = false;

  /**
   * Subscribe to position updates
   * @returns Unsubscribe function
   */
  subscribe(callback: PositionCallback): () => void {
    this.callbacks.add(callback);

    // Start listening when first subscriber added
    if (!this.isListening) {
      this.startListening();
    }

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);

      // Stop listening when last subscriber removed
      if (this.callbacks.size === 0) {
        this.stopListening();
      }
    };
  }

  private startListening(): void {
    if (this.isListening) return;

    window.addEventListener("scroll", this.handleEvent, true);
    window.addEventListener("resize", this.handleEvent);
    this.isListening = true;
  }

  private stopListening(): void {
    if (!this.isListening) return;

    window.removeEventListener("scroll", this.handleEvent, true);
    window.removeEventListener("resize", this.handleEvent);

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.isListening = false;
    this.pendingUpdate = false;
  }

  /**
   * Debounced event handler using requestAnimationFrame
   * Batches all scroll/resize events into a single update per frame
   */
  private handleEvent = (): void => {
    if (this.pendingUpdate) return;

    this.pendingUpdate = true;
    this.rafId = requestAnimationFrame(() => {
      this.pendingUpdate = false;
      this.notifySubscribers();
    });
  };

  private notifySubscribers(): void {
    this.callbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Position update callback error:", error);
      }
    });
  }

  /**
   * Force an immediate position update for all subscribers
   */
  forceUpdate(): void {
    this.notifySubscribers();
  }

  /**
   * Get current subscriber count (useful for debugging)
   */
  get subscriberCount(): number {
    return this.callbacks.size;
  }
}

// Singleton instance
export const positionManager = new PositionManager();
