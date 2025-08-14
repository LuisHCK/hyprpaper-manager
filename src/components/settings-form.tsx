import { TimerFormData } from '@/types'
import { open } from '@tauri-apps/plugin-dialog'

interface SettingsFormProps {
    timerFormData: TimerFormData
    setTimerFormData: (data: TimerFormData) => void
}

const SettingsForm = ({ timerFormData, setTimerFormData }: SettingsFormProps) => {
    const pickPicturesDirectory = async () => {
        const dir = await open({ directory: true, multiple: false })
        if (typeof dir === 'string') {
            setTimerFormData({ ...timerFormData, picturesDirectory: dir })
        }
    }

    return (
        <div className="is-flex is-flex-direction-column gap-6">
            <div>
                <div className="field mt-2">
                    <label className="label mb-1">Pictures Folder</label>
                    <div className="control is-flex gap-2">
                        <input
                            className="input"
                            type="text"
                            readOnly
                            value={timerFormData.picturesDirectory || ''}
                            placeholder="Select a folder containing your pictures"
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            className="button is-info"
                            onClick={pickPicturesDirectory}
                        >
                            Browse…
                        </button>
                    </div>
                </div>
                <div className="field is-grouped is-align-items-center mt-4">
                    <label className="label mr-2 mb-0">Transition every:</label>
                    <div className="control">
                        <input
                            className="input"
                            type="number"
                            value={timerFormData.duration}
                            onInput={(e) =>
                                setTimerFormData({
                                    ...timerFormData,
                                    duration: Number(e.currentTarget.value)
                                })
                            }
                            min={0}
                            step={1}
                            style={{ width: '6em' }}
                        />
                    </div>
                    <div className="control">
                        <div className="select">
                            <select
                                value={timerFormData.unit}
                                onChange={(e) =>
                                    setTimerFormData({
                                        ...timerFormData,
                                        unit: e.currentTarget.value as
                                            | 'seconds'
                                            | 'minutes'
                                            | 'hours'
                                    })
                                }
                            >
                                <option value="seconds">Seconds</option>
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="field">
                        <label className="checkbox mr-4">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={timerFormData.randomOrder}
                                onChange={(e) =>
                                    setTimerFormData({
                                        ...timerFormData,
                                        randomOrder: e.currentTarget.checked
                                    })
                                }
                            />
                            Play in random order
                        </label>
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={timerFormData.selectAll}
                                onChange={(e) =>
                                    setTimerFormData({
                                        ...timerFormData,
                                        selectAll: e.currentTarget.checked
                                    })
                                }
                            />
                            Select all
                        </label>
                    </div>
                </div>
            </div>

            <div className="is-flex gap-4">
                <button className="button">Apply temporary</button>
                <button className="button is-primary">Apply permanent</button>
            </div>
        </div>
    )
}

export default SettingsForm
