import Link from "next/link";

export default function Home() {
  return (
    <div className='min-h-screen p-4 grid grid-rows-[100px_1fr] items-center justify-items-center'>
      <header>
        <nav>
          <Link className='hover:underline' href="/dashboard">Dashboard</Link>
          <span>&nbsp;&nbsp;</span>
          <Link className='hover:underline' href="/api/interactions">api</Link>
        </nav>
      </header>
      <main className=''></main>
    </div>
  );
}
