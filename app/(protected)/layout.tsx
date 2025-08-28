import { AppBar } from '@/app/(protected)/_components/app-bar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AppBar />
      {children}
    </div>
  );
}
