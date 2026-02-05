export default function Profile() {
  // Placeholder profile data
  const profile = {
    f3Name: "Chappie",
    firstName: "John",
    lastName: "Smith",
    email: "john@example.com",
    homeAo: "The Foundry",
    joinDate: "2023-06-15",
    totalPosts: 45,
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-display font-bold mb-8">My Profile</h1>

      <div className="bg-f3-gray/20 rounded-lg border border-f3-gray/30 p-6 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-f3-red/20 flex items-center justify-center">
            <span className="text-3xl font-display font-bold text-f3-red">
              {profile.f3Name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-f3-red">
              {profile.f3Name}
            </h2>
            <p className="text-gray-400">
              {profile.firstName} {profile.lastName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ProfileField label="Email" value={profile.email} />
          <ProfileField label="Home AO" value={profile.homeAo} />
          <ProfileField label="Member Since" value={profile.joinDate} />
          <ProfileField label="Total Posts" value={String(profile.totalPosts)} />
        </div>
      </div>

      <div className="bg-f3-gray/20 rounded-lg border border-f3-gray/30 p-6">
        <h3 className="text-xl font-display font-semibold mb-4">Edit Profile</h3>

        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">F3 Name</label>
            <input
              type="text"
              defaultValue={profile.f3Name}
              className="w-full px-4 py-2 bg-f3-gray/30 border border-f3-gray/50 rounded text-white focus:outline-none focus:border-f3-red"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">First Name</label>
              <input
                type="text"
                defaultValue={profile.firstName}
                className="w-full px-4 py-2 bg-f3-gray/30 border border-f3-gray/50 rounded text-white focus:outline-none focus:border-f3-red"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Last Name</label>
              <input
                type="text"
                defaultValue={profile.lastName}
                className="w-full px-4 py-2 bg-f3-gray/30 border border-f3-gray/50 rounded text-white focus:outline-none focus:border-f3-red"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              defaultValue={profile.email}
              className="w-full px-4 py-2 bg-f3-gray/30 border border-f3-gray/50 rounded text-white focus:outline-none focus:border-f3-red"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-f3-red text-white font-semibold rounded hover:bg-red-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  );
}
