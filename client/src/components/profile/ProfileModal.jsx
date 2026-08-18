import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import BitmojiAvatar, {
  getDefaultAvatarConfig,
  BACKGROUND_COLORS,
  SKIN_TONES,
  HAIR_OPTIONS,
  EYE_OPTIONS,
  MOUTH_OPTIONS,
  ACCESSORY_OPTIONS,
} from '../common/BitmojiAvatar'

export default function ProfileModal({ isOpen, onClose }) {
  const { persona, logout, updateAvatarConfig } = useAuth()
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'studio'
  const [editingConfig, setEditingConfig] = useState(null)
  const [saveToast, setSaveToast] = useState(false)

  useEffect(() => {
    if (persona) {
      const initialConfig = persona.avatarConfig || getDefaultAvatarConfig(persona.name)
      setEditingConfig(initialConfig)
    }
  }, [persona])

  if (!isOpen || !persona) return null

  const handleRandomize = () => {
    const randomBg = BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)].hex
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].hex
    const randomHair = HAIR_OPTIONS[Math.floor(Math.random() * HAIR_OPTIONS.length)].id
    const randomEyes = EYE_OPTIONS[Math.floor(Math.random() * EYE_OPTIONS.length)].id
    const randomMouth = MOUTH_OPTIONS[Math.floor(Math.random() * MOUTH_OPTIONS.length)].id
    const randomAccessory = ACCESSORY_OPTIONS[Math.floor(Math.random() * ACCESSORY_OPTIONS.length)].id

    setEditingConfig({
      bg: randomBg,
      skin: randomSkin,
      hair: randomHair,
      eyes: randomEyes,
      mouth: randomMouth,
      accessory: randomAccessory,
    })
  }

  const handleSaveAvatar = () => {
    if (editingConfig && updateAvatarConfig) {
      updateAvatarConfig(editingConfig)
      setSaveToast(true)
      setTimeout(() => setSaveToast(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg rounded-[8px] p-6 bg-[#151518] border border-[#25252A] text-[#F2F2F2] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${editingConfig?.bg || '#F5B800'}44, ${editingConfig?.bg || '#F5B800'}11)`,
          }}
          className="h-16 -mx-6 -mt-6 mb-4 flex items-center justify-between px-6 shrink-0"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#151518] text-[#F2F2F2] font-bold'
                  : 'text-[#9A9A9F] hover:text-[#F2F2F2]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'studio'
                  ? 'bg-[#F5B800] text-[#0D0D0F] font-bold'
                  : 'bg-[#151518]/70 text-[#F5B800] hover:bg-[#151518]'
              }`}
            >
              <span>🎨</span>
              <span>Avatar Studio</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white text-xs transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Saved Feedback Toast */}
        {saveToast && (
          <div className="mb-3 p-2 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold rounded-[6px] text-center animate-fade-in">
            ✓ Persona avatar customized & saved!
          </div>
        )}

        {activeTab === 'overview' ? (
          <div className="overflow-y-auto no-scrollbar">
            {/* Persona Avatar Badge */}
            <div className="flex flex-col items-center text-center -mt-10 mb-4">
              <div className="relative">
                <BitmojiAvatar
                  seed={persona.name}
                  avatarConfig={editingConfig}
                  size={72}
                  className="border-4 border-[#151518] shadow-md"
                />
                <button
                  onClick={() => setActiveTab('studio')}
                  title="Customize Bitmoji Avatar"
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#F5B800] text-[#0D0D0F] font-bold text-xs flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform"
                >
                  ✎
                </button>
              </div>

              <h2 className="text-lg font-bold mt-2.5 tracking-tight text-[#F2F2F2]">
                {persona.name || 'Anonymous Persona'}
              </h2>

              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-[#0D0D0F] text-[#9A9A9F] border border-[#25252A]">
                  Trust Score <span className="text-[#F5B800]">{persona.trustScore || 0}</span>
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] bg-[#0D0D0F] text-[#9A9A9F] border border-[#25252A]">
                  Anonymous
                </span>
              </div>
            </div>

            {/* Privacy Shield Callout */}
            <div className="rounded-[6px] p-3 mb-4 text-xs text-center leading-relaxed border border-[#25252A] bg-[#0D0D0F] text-[#9A9A9F]">
              <strong>100% Identity Shielded</strong> — Your real email is encrypted. Other members only see your <span className="text-[#F2F2F2] font-semibold">{persona.name}</span> Bitmoji persona.
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-[6px] text-center border border-[#25252A] bg-[#0D0D0F]">
                <p className="text-[10px] font-bold text-[#6F7076] uppercase tracking-wider">
                  Posts Written
                </p>
                <p className="text-base font-bold text-[#F5B800] mt-0.5">
                  {persona._count?.posts ?? '0'}
                </p>
              </div>
              <div className="p-3 rounded-[6px] text-center border border-[#25252A] bg-[#0D0D0F]">
                <p className="text-[10px] font-bold text-[#6F7076] uppercase tracking-wider">
                  Comments Shared
                </p>
                <p className="text-base font-bold text-[#F5B800] mt-0.5">
                  {persona._count?.comments ?? '0'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-[#25252A]">
              <button
                onClick={() => {
                  logout()
                  onClose()
                }}
                className="flex-1 py-2 px-3 rounded-[6px] text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors border border-rose-500/20 cursor-pointer"
              >
                Logout
              </button>
              <button
                onClick={() => setActiveTab('studio')}
                className="flex-1 py-2 px-3 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Customize Avatar →</span>
              </button>
            </div>
          </div>
        ) : (
          /* AVATAR STUDIO EDITOR */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Live Bitmoji Preview Header */}
            <div className="flex items-center justify-between p-3 bg-[#0D0D0F] border border-[#25252A] rounded-[8px] mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <BitmojiAvatar seed={persona.name} avatarConfig={editingConfig} size={54} />
                <div>
                  <h3 className="text-xs font-bold text-[#F2F2F2]">{persona.name}'s Bitmoji</h3>
                  <p className="text-[11px] text-[#9A9A9F]">Layered Persona Avatar Studio</p>
                </div>
              </div>
              <button
                onClick={handleRandomize}
                className="px-3 py-1.5 rounded-[6px] text-xs font-bold bg-[#151518] text-[#F5B800] border border-[#25252A] hover:bg-[#25252A] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>🎲</span>
                <span>Randomize</span>
              </button>
            </div>

            {/* Layer Tweak Controls */}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* Background Color Palette */}
              <div>
                <label className="block text-[10px] font-bold text-[#6F7076] uppercase tracking-wider mb-1.5">
                  Background Color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {BACKGROUND_COLORS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setEditingConfig(prev => ({ ...prev, bg: c.hex }))}
                      style={{ backgroundColor: c.hex }}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        editingConfig?.bg === c.hex ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <label className="block text-[10px] font-bold text-[#6F7076] uppercase tracking-wider mb-1.5">
                  Skin Tone
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {SKIN_TONES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setEditingConfig(prev => ({ ...prev, skin: s.hex }))}
                      style={{ backgroundColor: s.hex }}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        editingConfig?.skin === s.hex ? 'border-[#F5B800] scale-110 shadow-md' : 'border-transparent hover:scale-105'
                      }`}
                      title={s.label}
                    />
                  ))}
                </div>
              </div>

              {/* Hair / Headwear */}
              <div>
                <label className="block text-[10px] font-bold text-[#6F7076] uppercase tracking-wider mb-1.5">
                  Hair & Headwear
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {HAIR_OPTIONS.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setEditingConfig(prev => ({ ...prev, hair: h.id }))}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                        editingConfig?.hair === h.id
                          ? 'bg-[#F5B800] text-[#0D0D0F] font-bold'
                          : 'bg-[#0D0D0F] text-[#9A9A9F] border border-[#25252A] hover:text-[#F2F2F2]'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eyes & Shades */}
              <div>
                <label className="block text-[10px] font-bold text-[#6F7076] uppercase tracking-wider mb-1.5">
                  Eyes & Eyewear
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {EYE_OPTIONS.map(e => (
                    <button
                      key={e.id}
                      onClick={() => setEditingConfig(prev => ({ ...prev, eyes: e.id }))}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                        editingConfig?.eyes === e.id
                          ? 'bg-[#F5B800] text-[#0D0D0F] font-bold'
                          : 'bg-[#0D0D0F] text-[#9A9A9F] border border-[#25252A] hover:text-[#F2F2F2]'
                      }`}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expression */}
              <div>
                <label className="block text-[10px] font-bold text-[#6F7076] uppercase tracking-wider mb-1.5">
                  Facial Expression
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {MOUTH_OPTIONS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setEditingConfig(prev => ({ ...prev, mouth: m.id }))}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                        editingConfig?.mouth === m.id
                          ? 'bg-[#F5B800] text-[#0D0D0F] font-bold'
                          : 'bg-[#0D0D0F] text-[#9A9A9F] border border-[#25252A] hover:text-[#F2F2F2]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories */}
              <div>
                <label className="block text-[10px] font-bold text-[#6F7076] uppercase tracking-wider mb-1.5">
                  Accessories
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ACCESSORY_OPTIONS.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setEditingConfig(prev => ({ ...prev, accessory: a.id }))}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                        editingConfig?.accessory === a.id
                          ? 'bg-[#F5B800] text-[#0D0D0F] font-bold'
                          : 'bg-[#0D0D0F] text-[#9A9A9F] border border-[#25252A] hover:text-[#F2F2F2]'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Studio Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[#25252A] mt-3 shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-3 py-1.5 rounded-[6px] text-xs font-semibold text-[#9A9A9F] hover:text-[#F2F2F2] transition-colors cursor-pointer"
              >
                ← Back
              </button>

              <button
                onClick={handleSaveAvatar}
                className="px-5 py-2 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors shadow-xs cursor-pointer"
              >
                Save Bitmoji Avatar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

