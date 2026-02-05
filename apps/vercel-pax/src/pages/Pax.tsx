export function Pax() {
  const paxList = [
    { f3Name: 'Dredd', firstName: 'John', posts: 245, lastPost: '2026-01-27' },
    { f3Name: 'Maverick', firstName: 'Tom', posts: 189, lastPost: '2026-01-25' },
    { f3Name: 'Iceman', firstName: 'Mike', posts: 156, lastPost: '2026-01-24' },
    { f3Name: 'Goose', firstName: 'Nick', posts: 134, lastPost: '2026-01-23' },
    { f3Name: 'Viper', firstName: 'Dan', posts: 98, lastPost: '2026-01-22' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">PAX Directory</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search PAX..."
          className="w-full md:w-96 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paxList.map((pax) => (
          <div
            key={pax.f3Name}
            className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-red-500 transition-colors"
          >
            <div className="text-xl font-bold text-red-400">{pax.f3Name}</div>
            <div className="text-zinc-400 text-sm mb-2">{pax.firstName}</div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">{pax.posts} posts</span>
              <span className="text-zinc-500">Last: {pax.lastPost}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
