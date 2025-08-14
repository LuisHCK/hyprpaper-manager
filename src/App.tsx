import { useState, useEffect } from 'preact/hooks'
import PictureIcon from './assets/icons/picture'
import SettingsIcon from './assets/icons/settings'
import { Card } from './components/card'
import { TimerFormData } from '@/types'
import SettingsForm from './components/settings-form'
import './App.scss'
import { open } from '@tauri-apps/plugin-dialog'
import { convertFileSrc } from '@tauri-apps/api/core'
// dynamic fs plugin import to avoid missing type issues
let readDir: any, readFile: any, writeFile: any, exists: any
type ReadDirEntry = { name: string; path: string; isFile: boolean; isDirectory: boolean }
import('@tauri-apps/plugin-fs')
    .then((mod) => {
        readDir = mod.readDir
        readFile = mod.readFile
        writeFile = mod.writeFile
        exists = mod.exists
    })
    .catch((e) => console.warn('fs plugin load failed', e))
import { join } from '@tauri-apps/api/path'

interface PersistedConfig {
    picturesDirectory: string
    timer: TimerFormData
}

const CONFIG_FILE = 'hyperpaper-manager/config.json'

function App() {
    const [timerFormData, setTimerFormData] = useState<TimerFormData>({
        duration: 0,
        unit: 'seconds',
        wallpaper: '',
        selectAll: false,
        randomOrder: false
    })
    const [images, setImages] = useState<string[]>([])
    const [loadingImages, setLoadingImages] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [inlineData, setInlineData] = useState<Record<string, string>>({})

    // Load persisted config
    useEffect(() => {
        ;(async () => {
            try {
                const cfgPath = await join('appConfig', CONFIG_FILE)
                if (await exists(cfgPath)) {
                    const content = await readFile(cfgPath, { encoding: 'utf-8' })
                    const parsed: PersistedConfig = JSON.parse(content)
                    setTimerFormData({
                        ...parsed.timer,
                        picturesDirectory: parsed.picturesDirectory
                    })
                }
            } catch (e) {
                console.warn('Failed to load config', e)
            }
        })()
    }, [])

    // Save config whenever timerFormData changes (debounced simplistic)
    useEffect(() => {
        const id = setTimeout(async () => {
            try {
                const cfgPath = await join('appConfig', CONFIG_FILE)
                const payload: PersistedConfig = {
                    picturesDirectory: timerFormData.picturesDirectory || '',
                    timer: { ...timerFormData }
                }
                await writeFile(cfgPath, JSON.stringify(payload, null, 2), { encoding: 'utf-8' })
            } catch (e) {
                console.warn('Failed to save config', e)
            }
        }, 400)
        return () => clearTimeout(id)
    }, [timerFormData])

    const pickPicturesDirectory = async () => {
        const dir = await open({ directory: true })
        if (typeof dir === 'string' && dir) {
            setTimerFormData((prev) => ({ ...prev, picturesDirectory: dir }))
        }
    }

    useEffect(() => {
        let cancelled = false
        const loadImages = async (attempt = 0) => {
            if (!timerFormData.picturesDirectory) return
            if (typeof readDir !== 'function') {
                if (attempt < 10) {
                    // retry shortly until plugin loaded
                    setTimeout(() => loadImages(attempt + 1), 120)
                } else {
                    console.warn('fs plugin not ready after retries')
                }
                return
            }
            setLoadingImages(true)
            try {
                console.log('reading....')
                const entries: ReadDirEntry[] = await readDir(timerFormData.picturesDirectory)
                const exts = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
                const imgs = entries
                    .filter(
                        (e: ReadDirEntry) =>
                            !!e &&
                            e.isFile &&
                            typeof e.name === 'string' &&
                            exts.some((x) => e.name.toLowerCase().endsWith(x))
                    )
                    .slice(0, 3)
                    .map((e) => {
                        // Convert the file
                        return `${timerFormData.picturesDirectory}/${e.name}`
                    })

                    console.log('imgs', imgs)
    
                if (!cancelled) setImages(imgs)
            } catch (e) {
                if (!cancelled) {
                    console.warn('Failed to list images', e)
                    setImages([])
                }
            } finally {
                if (!cancelled) setLoadingImages(false)
            }
        }
        loadImages()
        return () => {
            cancelled = true
        }
    }, [timerFormData.picturesDirectory])

    return (
        <main>
            <section className="section">
                <h1 className="title is-4 mb-2">HyperPaper Manager</h1>
                <p className="subtitle">Manage HyperPaper config files with ease</p>
            </section>

            <section className="section py-4">
                <Card>
                    <div className="is-flex gap-2">
                        <SettingsIcon />
                        <h2 className="title is-5">Settings</h2>
                    </div>

                    <SettingsForm
                        timerFormData={timerFormData}
                        setTimerFormData={setTimerFormData}
                    />
                </Card>
            </section>

            <section className="section py-4">
                <Card>
                    <div className="is-flex gap-2">
                        <PictureIcon />
                        <h2 className="title is-5">Available Wallpapers</h2>
                    </div>
                    <div className="mb-3">
                        <button className="button is-small" onClick={pickPicturesDirectory}>
                            Choose folder
                        </button>
                        <span className="ml-3 is-size-7 has-text-grey">
                            {timerFormData.picturesDirectory || 'No folder selected'}
                        </span>
                    </div>
                    {loadingImages && <p>Loading images...</p>}
                    {!loadingImages && images.length === 0 && (
                        <p className="is-size-7">No images found.</p>
                    )}
                    <div className="columns is-multiline image-grid">
                        {images.map((img) => {
                            const fileName = (() => {
                                try {
                                    return img.split('/').pop() || 'image'
                                } catch {
                                    return 'image'
                                }
                            })()
                            const isSelected = selectedImage === img
                            const src = inlineData[img] || convertFileSrc(img)
                            const onError = async () => {
                                if (inlineData[img] || typeof readFile !== 'function') return
                                try {
                                    const b64 = await readFile(img, { encoding: 'base64' })
                                    const ext = (fileName.split('.').pop() || '').toLowerCase()
                                    const mime =
                                        ext === 'jpg' || ext === 'jpeg'
                                            ? 'image/jpeg'
                                            : ext === 'gif'
                                            ? 'image/gif'
                                            : ext === 'bmp'
                                            ? 'image/bmp'
                                            : ext === 'webp'
                                            ? 'image/webp'
                                            : 'image/png'
                                    setInlineData((p) => ({
                                        ...p,
                                        [img]: `data:${mime};base64,${b64}`
                                    }))
                                } catch (err) {
                                    console.warn('Image fallback failed', err)
                                }
                            }
                            return (
                                <div className="column is-one-quarter" key={img}>
                                    <div
                                        className={`thumb-wrapper${
                                            isSelected ? ' is-selected' : ''
                                        }`}
                                    >
                                        <button
                                            className="thumb"
                                            onClick={() => setSelectedImage(img)}
                                            title={fileName}
                                            aria-pressed={isSelected}
                                        >
                                            <img
                                                src={src}
                                                onError={onError}
                                                loading="lazy"
                                                decoding="async"
                                                alt={fileName}
                                                width={128}
                                                height={128}
                                            />
                                        </button>
                                        <div className="thumb-hover-preview">
                                            <img src={src} alt={fileName} onError={onError} />
                                            <span className="caption">{fileName}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {selectedImage && (
                        <p className="is-size-7 mt-2">Selected: {selectedImage.split('/').pop()}</p>
                    )}
                </Card>
            </section>
        </main>
    )
}

export default App
