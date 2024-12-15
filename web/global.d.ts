declare module "virtual:svg-icons-register";

declare global {
  interface Window {
    DeskApi: {
      Win_quit: () => void;
      Win_hide: () => void;
      Win_max: () => void;
    };
  }
}

export {};
