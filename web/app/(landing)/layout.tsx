import NavBar from '@/app/(landing)/_components/navbar';
import Footer from '@/components/footer';

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <NavBar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
