import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />

        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#5BA4CF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Little Moments" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Little Moments" />

        {/* Open Graph / Social Sharing */}
        <meta property="og:title" content="Little Moments" />
        <meta
          property="og:description"
          content="Capture beautiful monthly milestones of your little one growing up. Choose cute frames, add photos, and share with family."
        />
        <meta property="og:type" content="website" />

        {/* SEO */}
        <meta
          name="description"
          content="Little Moments — a beautiful app for parents to create monthly milestone photos with cute illustrated frames. Save and share memories of your child growing up."
        />

        {/* Prevent phone number detection */}
        <meta name="format-detection" content="telephone=no" />

        <title>Little Moments</title>

        {/* Expo scrollview reset */}
        <ScrollViewStyleReset />

        {/* Custom styles for web polish */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #F0F7FC;
          }
          body {
            overflow: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          #root {
            display: flex;
            height: 100%;
            flex: 1;
          }
          /* Remove tap highlight on mobile */
          * {
            -webkit-tap-highlight-color: transparent;
          }
          /* Smooth scrolling */
          * {
            scroll-behavior: smooth;
          }
          /* Better text rendering */
          body {
            text-rendering: optimizeLegibility;
          }
          /* Selection color matching brand */
          ::selection {
            background-color: #A8D4F0;
            color: #2C3E50;
          }
          /* Focus ring for accessibility */
          :focus-visible {
            outline: 3px solid #5BA4CF;
            outline-offset: 2px;
            border-radius: 8px;
          }
          /* Remove default focus outline for non-keyboard users */
          :focus:not(:focus-visible) {
            outline: none;
          }
        ` }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
