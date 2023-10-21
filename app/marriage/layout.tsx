import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body className="font-roboto bg-black bg-[url('/assets/landingPage/sikkaplaybg.svg')] bg-cover bg-no-repeat ">
        {children}
      </body>
    </html>
  );
}
