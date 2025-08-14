# HyperPaper Manager

A modern Tauri 2 desktop app for managing wallpapers and Hyprpaper config, built with Preact, TypeScript, and Vite.

## Features

- **Pick a Pictures Folder:** User can select any folder containing images (supports PNG, JPG, JPEG, GIF, BMP, WEBP).
- **Image Listing:** All images in the selected folder are listed as thumbnails in a responsive grid.
- **Thumbnail Preview:** Hover over a thumbnail to see a larger preview and filename tooltip.
- **Image Selection:** Click a thumbnail to select it (for future wallpaper actions).
- **Persistent Settings:** The selected folder and timer settings are saved and restored automatically.
- **Tauri 2 Capabilities:** Uses Tauri's new plugin system for secure file system and dialog access.
- **Linux/Hyprland Focus:** Designed for Linux, with Hyprpaper integration planned.

## Usage

1. **Install dependencies:**
   ```sh
   bun install
   ```
2. **Run in development mode:**
   ```sh
   bun run dev
   # In another terminal:
   bun run tauri dev
   ```
3. **Pick your images folder:**
   - Click "Choose folder" in the UI and select your wallpapers directory.
   - Thumbnails will appear for all supported images.

## Tech Stack
- [Tauri 2](https://tauri.app/) (Rust backend, secure capabilities)
- [Preact](https://preactjs.com/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Bulma](https://bulma.io/) + Catppuccin theme
- Tauri plugins: `@tauri-apps/plugin-fs`, `@tauri-apps/plugin-dialog`, `@tauri-apps/plugin-opener`

## Roadmap
- Hyprpaper config editing and wallpaper switching
- Recursive folder scan
- Multi-select and batch actions
- Drag-and-drop support
- Hyprland-specific enhancements

## Development
- Recommended: VS Code + Tauri extension + rust-analyzer
- All config is persisted in `appConfig/hyperpaper-manager/config.json` (Tauri app config dir)

---

_This project is a template for modern Tauri 2 + Preact desktop apps with secure file access and image preview._
