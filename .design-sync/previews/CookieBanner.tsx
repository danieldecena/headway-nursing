import { CookieBanner } from 'headway-nursing-ds';

// Fixed-positioned in the site; previewed inside a relative frame so the card
// shows it docked to a page bottom.
export const Open = () => (
  <div className="relative h-64 overflow-hidden rounded-lg border border-slate-200 bg-ground">
    <div className="absolute inset-x-0 bottom-0">
      <div className="[&>div]:static">
        <CookieBanner />
      </div>
    </div>
  </div>
);
