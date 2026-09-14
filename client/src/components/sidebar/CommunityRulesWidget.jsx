export default function CommunityRulesWidget({ onOpenInfoModal }) {
  return (
    <div className="bg-[#151518] border border-[#25252A] rounded-[8px] p-4 sm:p-4.5 text-xs animate-fade-in shadow-xs min-w-0">
      {/* Widget Section Title */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-3.5 border-b border-[#25252A] min-w-0">
        <h3 className="text-[10px] font-bold text-[#6F7076] tracking-wider uppercase truncate min-w-0 flex-1 pr-1">
          COMMUNITY GUIDELINES
        </h3>
        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-[4px] bg-[#0D0D0F] text-[#F5B800] border border-[#25252A] shrink-0 whitespace-nowrap">
          Protected
        </span>
      </div>

      {/* Guidelines List */}
      <div className="space-y-3 text-[11px] text-[#9A9A9F]">
        <div className="flex items-start gap-2.5">
          <span className="text-sm shrink-0 leading-none pt-0.5">🛡️</span>
          <div>
            <span className="font-semibold text-[#F2F2F2] block leading-tight">
              Encrypted & Anonymous
            </span>
            <span className="text-[10px] text-[#6F7076]">
              Real names and personal info are never exposed.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <span className="text-sm shrink-0 leading-none pt-0.5">⚡</span>
          <div>
            <span className="font-semibold text-[#F2F2F2] block leading-tight">
              Earn Trust Score
            </span>
            <span className="text-[10px] text-[#6F7076]">
              Helpful & insightful contributions build community status.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <span className="text-sm shrink-0 leading-none pt-0.5">🔒</span>
          <div>
            <span className="font-semibold text-[#F2F2F2] block leading-tight">
              Privacy Shield
            </span>
            <span className="text-[10px] text-[#6F7076]">
              Automated leak protection checks text for phone/email leaks.
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 mt-3 border-t border-[#25252A] flex items-center justify-between text-[11px]">
        <span className="text-[#6F7076]">Persona Rules v1.0</span>
        <button
          onClick={() => onOpenInfoModal && onOpenInfoModal('guidelines')}
          className="text-[#9A9A9F] hover:text-[#F5B800] font-semibold transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>Read rules</span>
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
