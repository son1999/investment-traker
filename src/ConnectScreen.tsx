import { useState } from 'react'
import iconSvg from './assets/icon.svg'

export default function ConnectScreen() {
  const [projectUrl, setProjectUrl] = useState('')
  const [anonKey, setAnonKey] = useState('')

  const handleConnect = () => {
    console.log('Connecting...', { projectUrl, anonKey })
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0e0e10] px-6">
      {/* Decorative blurs */}
      <div className="absolute -left-32 -top-[102px] h-[409px] w-[512px] rounded-xl bg-[rgba(255,177,72,0.05)] blur-[60px]" />
      <div className="absolute -bottom-[51px] -right-16 h-[307px] w-[384px] rounded-xl bg-[rgba(198,198,199,0.05)] blur-[50px]" />

      {/* Main content */}
      <div className="relative flex w-full max-w-[400px] flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="flex size-12 items-center justify-center rounded-lg bg-[#25252b] shadow-lg">
            <img src={iconSvg} alt="" className="h-[17px] w-[18px]" />
          </div>
          <div className="flex flex-col items-center gap-1 pt-4">
            <h1 className="m-0 text-center text-2xl font-bold tracking-[-0.6px] text-[#e7e4ec]">
              Investment Tracker
            </h1>
            <p className="m-0 text-center text-sm text-[#acaab1]">
              Kết nối Supabase để bắt đầu
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="mt-8 w-full rounded-lg border border-[rgba(71,71,78,0.2)] bg-[#131316] px-8 pb-12 pt-8 shadow-2xl">
          <div className="flex flex-col gap-1">
            <h2 className="m-0 text-sm font-semibold tracking-[0.35px] text-[#e7e4ec]">
              Kết nối Database
            </h2>
            <p className="m-0 text-[13px] text-[#acaab1]">
              Nhập thông tin project Supabase
            </p>
          </div>

          <div className="mt-6 flex flex-col">
            {/* Project URL */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#acaab1]">
                Project URL
              </label>
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://xxx.supabase.co"
                className="h-10 w-full rounded bg-[#25252b] px-3 text-sm text-[#e7e4ec] placeholder-[rgba(117,117,124,0.5)] outline-none focus:ring-1 focus:ring-[rgba(198,198,199,0.3)]"
              />
            </div>

            {/* Anon Key */}
            <div className="mt-5 flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#acaab1]">
                Anon Key
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="h-10 w-full rounded bg-[#25252b] px-3 text-sm text-[#e7e4ec] placeholder-[rgba(117,117,124,0.5)] outline-none focus:ring-1 focus:ring-[rgba(198,198,199,0.3)]"
              />
            </div>

            {/* Connect button */}
            <button
              onClick={handleConnect}
              className="mt-5 h-10 w-full cursor-pointer rounded-lg border-none bg-gradient-to-br from-[#c6c6c7] to-[#454747] text-sm font-bold text-[#3f4041] transition-opacity hover:opacity-90 active:opacity-80"
            >
              Kết nối
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-[11px] uppercase tracking-[1.1px] text-[rgba(117,117,124,0.4)]">
          Precision Financial Atelier &bull; v1.0
        </p>
      </div>
    </div>
  )
}
