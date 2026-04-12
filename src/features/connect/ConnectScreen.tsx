import ConnectHeader from './components/ConnectHeader'
import ConnectionForm from './components/ConnectionForm'

export default function ConnectScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-[400px] flex-col items-center">
        <ConnectHeader />
        <ConnectionForm />
        <p className="mt-8 text-xs text-muted-foreground">Investment Tracker &middot; v1.0</p>
      </div>
    </div>
  )
}
