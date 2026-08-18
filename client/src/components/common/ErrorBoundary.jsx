import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Persona ErrorBoundary caught error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0D0F] text-[#F2F2F2] flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-[8px] bg-[#151518] border border-[#25252A] text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-[6px] bg-[#F5B800] text-[#0D0D0F] font-black flex items-center justify-center mx-auto text-xl shadow-xs">
              !
            </div>
            <h2 className="text-lg font-extrabold text-[#F2F2F2]">
              Something unexpected happened
            </h2>
            <p className="text-xs text-[#9A9A9F] leading-relaxed">
              {this.state.error?.message || 'Persona encountered a temporary display issue.'}
            </p>

            {this.state.error?.stack && (
              <details className="text-left bg-[#0D0D0F] p-3 rounded border border-[#25252A] text-[10px] text-rose-400 font-mono overflow-x-auto max-h-36">
                <summary className="cursor-pointer text-[#9A9A9F] font-bold mb-1">View error trace</summary>
                <pre>{this.state.error.stack}</pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors cursor-pointer w-full"
            >
              Refresh Feed
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
