import type { AIProvider } from "./ai.provider.js";
import { GroqProvider } from "./groq.provider.js";



export type ProviderConstructor = new () => AIProvider;

export class AiProviderRegistry {
  private static providers = new Map<string, ProviderConstructor>();

  // Register a provider class with a unique key
  static register(name: string, providerClass: ProviderConstructor): void {
    this.providers.set(name.toLowerCase(), providerClass);
  }

  // Get a fresh instance of the requested provider
  static getProvider(name: string): AIProvider {
    const ProviderClass = this.providers.get(name.toLowerCase());

    if (!ProviderClass) {
      const available = Array.from(this.providers.keys()).join(", ");
      throw new Error(
        `Provider "${name}" is not registered. Available providers: [${available}]`
      );
    }

    return new ProviderClass();
  }

  // Check if a provider is registered
  static has(name: string): boolean {
    return this.providers.has(name.toLowerCase());
  }
}

AiProviderRegistry.register("groq",GroqProvider);