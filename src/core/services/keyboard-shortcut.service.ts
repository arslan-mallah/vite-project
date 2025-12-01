/**
 * Keyboard Shortcut Service
 * Manages keyboard shortcuts for the application
 */

export interface KeyboardShortcut {
  id: string;
  name: string;
  keys: string[];
  description: string;
  action: () => void;
  enabled: boolean;
  category: 'navigation' | 'editing' | 'global' | 'custom';
}

export interface ShortcutConfig {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  key: string;
}

class KeyboardShortcutService {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private listeners: Map<string, Set<() => void>> = new Map();
  private isListening: boolean = false;

  /**
   * Initialize the keyboard shortcut listener and load default shortcuts
   */
  public init(): void {
    if (this.isListening) return;

    // Load default shortcuts if none exist
    if (this.shortcuts.size === 0) {
      this.loadDefaultShortcuts();
    }

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.isListening = true;
  }

  /**
   * Load default keyboard shortcuts
   */
  private loadDefaultShortcuts(): void {
    const defaultShortcuts: KeyboardShortcut[] = [
      {
        id: 'save-document',
        name: 'Save Document',
        keys: ['ctrl', 's'],
        description: 'Save the current document',
        action: () => console.log('Save document shortcut triggered'),
        enabled: true,
        category: 'global',
      },
      {
        id: 'new-document',
        name: 'New Document',
        keys: ['ctrl', 'n'],
        description: 'Create a new document',
        action: () => console.log('New document shortcut triggered'),
        enabled: true,
        category: 'global',
      },
      {
        id: 'open-document',
        name: 'Open Document',
        keys: ['ctrl', 'o'],
        description: 'Open an existing document',
        action: () => console.log('Open document shortcut triggered'),
        enabled: true,
        category: 'global',
      },
      {
        id: 'undo-action',
        name: 'Undo',
        keys: ['ctrl', 'z'],
        description: 'Undo the last action',
        action: () => console.log('Undo shortcut triggered'),
        enabled: true,
        category: 'editing',
      },
      {
        id: 'redo-action',
        name: 'Redo',
        keys: ['ctrl', 'shift', 'z'],
        description: 'Redo the last undone action',
        action: () => console.log('Redo shortcut triggered'),
        enabled: true,
        category: 'editing',
      },
      {
        id: 'select-all',
        name: 'Select All',
        keys: ['ctrl', 'a'],
        description: 'Select all content',
        action: () => console.log('Select all shortcut triggered'),
        enabled: true,
        category: 'editing',
      },
      {
        id: 'copy-content',
        name: 'Copy',
        keys: ['ctrl', 'c'],
        description: 'Copy selected content',
        action: () => console.log('Copy shortcut triggered'),
        enabled: true,
        category: 'editing',
      },
      {
        id: 'paste-content',
        name: 'Paste',
        keys: ['ctrl', 'v'],
        description: 'Paste from clipboard',
        action: () => console.log('Paste shortcut triggered'),
        enabled: true,
        category: 'editing',
      },
      {
        id: 'go-home',
        name: 'Go to Home',
        keys: ['alt', 'h'],
        description: 'Navigate to home page',
        action: () => console.log('Go to home shortcut triggered'),
        enabled: true,
        category: 'navigation',
      },
      {
        id: 'go-users',
        name: 'Go to Users',
        keys: ['alt', 'u'],
        description: 'Navigate to users page',
        action: () => console.log('Go to users shortcut triggered'),
        enabled: true,
        category: 'navigation',
      },
    ];

    defaultShortcuts.forEach((shortcut) => this.register(shortcut));
  }

  /**
   * Destroy the keyboard shortcut listener
   */
  public destroy(): void {
    if (!this.isListening) return;

    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.isListening = false;
  }

  /**
   * Register a new keyboard shortcut
   */
  public register(shortcut: KeyboardShortcut): void {
    if (this.shortcuts.has(shortcut.id)) {
      console.warn(`Shortcut with id "${shortcut.id}" already exists`);
      return;
    }

    this.shortcuts.set(shortcut.id, shortcut);
  }

  /**
   * Unregister a keyboard shortcut
   */
  public unregister(shortcutId: string): void {
    this.shortcuts.delete(shortcutId);
  }

  /**
   * Update an existing shortcut
   */
  public update(shortcutId: string, updates: Partial<KeyboardShortcut>): void {
    const shortcut = this.shortcuts.get(shortcutId);
    if (!shortcut) {
      console.warn(`Shortcut with id "${shortcutId}" not found`);
      return;
    }

    Object.assign(shortcut, updates);
  }

  /**
   * Enable a shortcut
   */
  public enable(shortcutId: string): void {
    const shortcut = this.shortcuts.get(shortcutId);
    if (shortcut) {
      shortcut.enabled = true;
    }
  }

  /**
   * Disable a shortcut
   */
  public disable(shortcutId: string): void {
    const shortcut = this.shortcuts.get(shortcutId);
    if (shortcut) {
      shortcut.enabled = false;
    }
  }

  /**
   * Get all registered shortcuts
   */
  public getAll(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Get shortcuts by category
   */
  public getByCategory(category: KeyboardShortcut['category']): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values()).filter(
      (shortcut) => shortcut.category === category
    );
  }

  /**
   * Get a specific shortcut by id
   */
  public get(shortcutId: string): KeyboardShortcut | undefined {
    return this.shortcuts.get(shortcutId);
  }

  /**
   * Handle key down event and trigger matching shortcuts
   */
  private handleKeyDown(event: KeyboardEvent): void {
    for (const shortcut of this.shortcuts.values()) {
      if (!shortcut.enabled) continue;

      // Check if this keydown matches the shortcut
      if (this.matchesShortcut(event, shortcut)) {
        event.preventDefault();
        shortcut.action();

        // Trigger listeners
        const listeners = this.listeners.get(shortcut.id);
        if (listeners) {
          listeners.forEach((listener) => listener());
        }
      }
    }
  }

  /**
   * Check if a key event matches a shortcut configuration
   */
  private matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    const [baseKey, ...modifiers] = shortcut.keys;

    // Check if the main key matches
    if (event.key.toLowerCase() !== baseKey.toLowerCase()) {
      return false;
    }

    // Check modifiers
    const hasCtrl = modifiers.includes('ctrl');
    const hasShift = modifiers.includes('shift');
    const hasAlt = modifiers.includes('alt');
    const hasMeta = modifiers.includes('meta');

    return (
      event.ctrlKey === hasCtrl &&
      event.shiftKey === hasShift &&
      event.altKey === hasAlt &&
      event.metaKey === hasMeta
    );
  }

  /**
   * Subscribe to shortcut trigger events
   */
  public subscribe(shortcutId: string, callback: () => void): () => void {
    if (!this.listeners.has(shortcutId)) {
      this.listeners.set(shortcutId, new Set());
    }

    const listeners = this.listeners.get(shortcutId)!;
    listeners.add(callback);

    // Return unsubscribe function
    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(shortcutId);
      }
    };
  }

  /**
   * Create a shortcut configuration helper
   */
  public createShortcut(config: ShortcutConfig): string[] {
    const keys: string[] = [];

    if (config.ctrl) keys.push('ctrl');
    if (config.shift) keys.push('shift');
    if (config.alt) keys.push('alt');
    if (config.meta) keys.push('meta');

    keys.push(config.key.toUpperCase());

    return keys;
  }

  /**
   * Format shortcut keys for display (e.g., "Ctrl+S")
   */
  public formatShortcut(keys: string[]): string {
    const keyLabels: Record<string, string> = {
      ctrl: 'Ctrl',
      shift: 'Shift',
      alt: 'Alt',
      meta: 'Cmd',
    };

    return keys
      .map((key) => keyLabels[key.toLowerCase()] || key.toUpperCase())
      .join('+');
  }

  /**
   * Clear all shortcuts
   */
  public clear(): void {
    this.shortcuts.clear();
    this.listeners.clear();
  }
}

// Export singleton instance
export const keyboardShortcutService = new KeyboardShortcutService();
