"use client";

import { useAuth } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen flex flex-col bg-bg60">
        <>
          <header className="bg-primary10 px-5 w-full">
            <div className="flex items-center justify-between h-16 sm:max-w-96 md:h-20 max-w-96 mx-auto md:w-full">
              <h1 className="text-white text-xl font-bold">ItaSuit</h1>
              <div className="flex items-center gap-2">
                <div className="text-end">
                  <p className="text-white font-bold text-[.8rem]">{user?.name}</p>
                  <p className="text-sky-200 text-[.8rem]">{user?.role}</p>
                </div>
                <Avatar>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/101620032?v=4" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <main className="flex flex-wrap gap-3 py-5 sm:max-w-sm max-w-64 mx-auto">
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
          </main>
          <button
            onClick={logout}
            className="mt-4  w-20 p-2 mx-auto bg-red-500 text-white rounded"
          >
            Deslogar
          </button>
        </>
      ) : (
        <>
          <header className="bg-primary10 px-5 w-full">
            <div className="flex items-center justify-between h-16 sm:max-w-96 md:h-20 max-w-96 mx-auto md:w-full">
              <h1 className="text-white text-xl font-bold">ItaSuit</h1>
              <div className="flex items-center gap-2">
                <div className="text-end">
                  <p className="text-white font-bold text-[.8rem]">{user?.name}</p>
                  <p className="text-sky-200 text-[.8rem]">{user?.role}</p>
                </div>
                <Avatar>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/101620032?v=4" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <main className="flex flex-wrap gap-3 py-5 sm:max-w-sm max-w-64 mx-auto">
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
            <div className="w-[120] h-[120] bg-white rounded-lg"></div>
          </main>
          <button
            onClick={logout}
            className="mt-4  w-20 p-2 mx-auto bg-red-500 text-white rounded"
          >
            Deslogar
          </button>
        </>
      )}
    </main>
  );
}
