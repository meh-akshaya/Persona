export default function InfoModal({ isOpen, type, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        style={{
          backgroundColor: 'var(--bg-modal)',
          borderColor: 'var(--border)',
        }}
        className="w-full max-w-lg rounded-2xl p-6 sm:p-7 border shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] capitalize">
            {type === 'privacy' && 'Privacy Shield & Policy'}
            {type === 'terms' && 'Terms of Service'}
            {type === 'guidelines' && 'Community Guidelines'}
            {type === 'contact' && 'Contact & Support'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="text-xs text-[var(--text-secondary)] space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          {type === 'privacy' && (
            <>
              <p>
                <strong>Zero Personal Data Storage:</strong> Persona uses state-of-the-art encryption to detach your registered email from all public posts, comments, and trust scores.
              </p>
              <p>
                <strong>Live Leak Detector:</strong> Posts are scanned in real-time for phone numbers, email addresses, and social handles before publication to prevent accidental self-doxxing.
              </p>
              <p>
                <strong>Anonymity Guarantee:</strong> We do not sell or expose user activity logs to third parties.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                <strong>Welcome to Persona:</strong> By participating in discussions, you agree to respect community members and avoid targeted harassment or illegal material.
              </p>
              <p>
                <strong>Content Ownership:</strong> You retain ownership of your contributions while granting Persona a license to display them anonymously within public spaces.
              </p>
              <p>
                <strong>Trust Score Moderation:</strong> Accounts accumulating negative trust scores due to spam or harassment may be restricted automatically.
              </p>
            </>
          )}

          {type === 'guidelines' && (
            <>
              <p>
                <strong>1. Be Honest & Constructive:</strong> Speak freely about career, IT, fitness, relationships, and startups while maintaining constructive intent.
              </p>
              <p>
                <strong>2. Protect Your Identity:</strong> Avoid revealing personal contact details in public text.
              </p>
              <p>
                <strong>3. Rate Helpful Content:</strong> Use Helpful, Insightful, and Support reactions to build trust scores for high-value contributors.
              </p>
            </>
          )}

          {type === 'contact' && (
            <div className="space-y-4">
              <p>Have questions, security concerns, or feedback for the Persona platform team?</p>

              <div className="p-4 rounded-xl bg-[#121214] border border-[#26262e] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    ✉️
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Official Support Email</span>
                    <a
                      href="mailto:contact@persona.app"
                      className="text-xs font-bold text-amber-400 hover:underline"
                    >
                      contact@persona.app
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    📞
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Helpline & Security Fax</span>
                    <a
                      href="tel:+18005550199"
                      className="text-xs font-bold text-amber-400 hover:underline"
                    >
                      +1 (800) 555-0199
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[var(--border)] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
