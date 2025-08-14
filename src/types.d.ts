export interface TimerFormData {
    duration: number
    unit: 'seconds' | 'minutes' | 'hours'
    wallpaper: string
    selectAll: boolean
    randomOrder: boolean
    picturesDirectory?: string
}

// Temporary module declarations for plugins (if types not auto-resolved)
declare module '@tauri-apps/plugin-dialog' {
    interface OpenOptions {
        directory?: boolean
        multiple?: boolean
        filters?: { name: string; extensions: string[] }[]
        defaultPath?: string
    }
    export function open(options?: OpenOptions): Promise<string | string[] | null>
}
declare module '@tauri-apps/plugin-fs' {
    export interface ReadDirEntry { name: string; path: string; children?: ReadDirEntry[]; isFile: boolean; isDirectory: boolean }
    export function readDir(path: string): Promise<ReadDirEntry[]>
    export function exists(path: string): Promise<boolean>
    export function readFile(path: string, options?: { encoding?: 'utf-8' | 'base64' }): Promise<string>
    export function writeFile(path: string, data: string | Uint8Array, options?: { encoding?: 'utf-8' | 'base64' }): Promise<void>
}
