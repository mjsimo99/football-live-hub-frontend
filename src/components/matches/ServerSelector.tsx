import type { StreamServer } from '../../types/match'

interface ServerSelectorProps {
  servers: StreamServer[]
  selectedServerId: string
  onServerChange: (serverId: string) => void
}

const ServerSelector = ({ servers, selectedServerId, onServerChange }: ServerSelectorProps) => (
  <div className="flex flex-wrap gap-2">
    {servers.map((server) => {
      const isActive = selectedServerId === server.id

      return (
        <button
          key={server.id}
          type="button"
          onClick={() => onServerChange(server.id)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            isActive
              ? 'border-emerald-300 bg-emerald-500 text-slate-950'
              : 'border-slate-600 bg-slate-800 text-slate-200 hover:border-emerald-500'
          }`}
        >
          {server.name}
        </button>
      )
    })}
  </div>
)

export default ServerSelector
