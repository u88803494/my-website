/**
 * Type declaration for DaisyUI plugin
 *
 * DaisyUI is used via Tailwind CSS 4.0's @plugin directive in CSS files,
 * not imported directly in TypeScript. This declaration prevents TypeScript
 * from throwing "Cannot find module" errors during compilation.
 *
 * @see {@link https://daisyui.com/docs/install/}
 */
declare module "daisyui" {
  interface DaisyUIConfig {
    themes?: string[] | Record<string, unknown>;
    darkTheme?: string;
    base?: boolean;
    styled?: boolean;
    utils?: boolean;
    prefix?: string;
    logs?: boolean;
    themeRoot?: string;
  }

  const daisyui: {
    handler: () => void;
    config?: Partial<DaisyUIConfig>;
  };

  export default daisyui;
}
