import { ClerkProvider } from "@clerk/nextjs";
import type { Appearance } from "@clerk/types";
import "./styles/globals.css";
import Script from "next/script";
import { NavigationMenuBar } from "./components/navigation-menu-bar";


/**
 * This object can be customized to change Clerk's built-in appearance. To learn more: https://clerk.com/docs/customization/overview
 */
const clerkAppearanceObject = {
  cssLayerName: "clerk",
  variables: { colorPrimary: "#000000" },
  elements: {
    socialButtonsBlockButton:
      "bg-white border-gray-200 hover:bg-transparent hover:border-black text-gray-600 hover:text-black",
    socialButtonsBlockButtonText: "font-semibold",
    formButtonReset:
      "bg-white border border-solid border-gray-200 hover:bg-transparent hover:border-black text-gray-500 hover:text-black",
    membersPageInviteButton:
      "bg-black border border-black border-solid hover:bg-white hover:text-black",
    card: "bg-[#fafafa]",
  },
} satisfies Appearance;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider appearance={clerkAppearanceObject}>
        <body className={`min-h-screen flex flex-col antialiased`}>
          <div className="sticky top-0 z-50 w-full flex items-center py-1 border-b min-h-[60px] px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Left spacer */}
            <div className="w-16"></div>

            <NavigationMenuBar />

            {/* Right side - Profile Menu */}
            {/* <ProfileMenu /> */}
          </div>
          <main className="flex-1">
            {children}
          </main>
        </body>
      </ClerkProvider>

      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js" />
    </html>
  );
}
