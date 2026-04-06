import ConnectHeader from './components/ConnectHeader'
import ConnectionForm from './components/ConnectionForm'

export default function ConnectScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6">
      <div className="flex w-full max-w-[400px] flex-col items-center">
        <ConnectHeader />
        <ConnectionForm />
        <p className="mt-10 text-xs text-dim">Financial Atelier &middot; v1.0</p>
      </div>
    </div>
  )
}
