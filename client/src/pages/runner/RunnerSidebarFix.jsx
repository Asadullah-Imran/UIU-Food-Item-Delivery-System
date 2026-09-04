import React, { useLayoutEffect } from 'react';

export default function RunnerSidebarFix({ activeDelivery = false, isProfile = false }) {
  useLayoutEffect(() => {
    // When navigating away back to Dashboard, restore Dashboard and clean up Profile
    return () => {
      const dashboardLink = document.querySelector('nav a:first-child');
      if (dashboardLink) {
        dashboardLink.classList.add('bg-orange-500', 'text-white', 'shadow-md', 'shadow-orange-500/20');
        dashboardLink.classList.remove('text-slate-600', 'hover:bg-slate-100', 'hover:text-orange-500');
      }
      const profileLink = document.querySelector('nav a:last-child');
      if (profileLink) {
        profileLink.classList.remove('bg-orange-500', 'text-white', 'shadow-md', 'shadow-orange-500/20');
        profileLink.classList.add('text-slate-600', 'hover:bg-slate-100', 'hover:text-orange-500');
      }
    };
  }, []);

  return (
    <>
      <span data-runner-subpage="true" className="hidden" aria-hidden="true" />
      {activeDelivery && (
        <span data-active-delivery="true" className="hidden" aria-hidden="true" />
      )}
      {isProfile && (
        <span data-runner-profile="true" className="hidden" aria-hidden="true" />
      )}
      <style>{`
        /* When on any runner subpage, Dashboard (first item) is inactive */
        body:has([data-runner-subpage="true"]) nav a:first-child {
          background-color: transparent !important;
          color: #475569 !important;
          box-shadow: none !important;
        }
        body:has([data-runner-subpage="true"]) nav a:first-child:hover {
          background-color: #f1f5f9 !important;
          color: #f97316 !important;
        }

        /* When on Dashboard (no runner subpage), Dashboard (first item) is active orange */
        body:not(:has([data-runner-subpage="true"])) nav a:first-child {
          background-color: #f97316 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.2), 0 2px 4px -2px rgba(249, 115, 22, 0.2) !important;
        }

        /* When on active delivery subpages, Active Deliveries (3rd item) is active orange */
        body:has([data-active-delivery="true"]) nav a:nth-child(3) {
          background-color: #f97316 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.2), 0 2px 4px -2px rgba(249, 115, 22, 0.2) !important;
        }

        /* Profile (last item) — inactive by default */
        nav a:last-child {
          background-color: transparent !important;
          color: #475569 !important;
          box-shadow: none !important;
        }
        nav a:last-child:hover {
          background-color: #f1f5f9 !important;
          color: #f97316 !important;
        }

        /* When on Profile page, Profile (last item) is active orange */
        body:has([data-runner-profile="true"]) nav a:last-child {
          background-color: #f97316 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.2), 0 2px 4px -2px rgba(249, 115, 22, 0.2) !important;
        }
      `}</style>
    </>
  );
}
