import React, { useLayoutEffect } from 'react';

export default function StudentSidebarFix({ isShops = false }) {
  useLayoutEffect(() => {
    // When navigating away back to Dashboard, restore Dashboard active styles
    return () => {
      const dashboardLink = document.querySelector('nav a:first-child');
      if (dashboardLink) {
        dashboardLink.classList.add('bg-orange-500', 'text-white', 'shadow-md', 'shadow-orange-500/20');
        dashboardLink.classList.remove('text-slate-600', 'hover:bg-slate-100', 'hover:text-orange-500');
      }
    };
  }, []);

  return (
    <>
      <span data-student-subpage="true" className="hidden" aria-hidden="true" />
      {isShops && (
        <span data-student-shops="true" className="hidden" aria-hidden="true" />
      )}
      <style>{`
        /* When on any student subpage, Dashboard (first item) is inactive */
        body:has([data-student-subpage="true"]) nav a:first-child {
          background-color: transparent !important;
          color: #475569 !important;
          box-shadow: none !important;
        }
        body:has([data-student-subpage="true"]) nav a:first-child:hover {
          background-color: #f1f5f9 !important;
          color: #f97316 !important;
        }

        /* When on Student Dashboard (no subpage), Dashboard (first item) is active orange */
        body:not(:has([data-student-subpage="true"])) nav a:first-child {
          background-color: #f97316 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.2), 0 2px 4px -2px rgba(249, 115, 22, 0.2) !important;
        }

        /* When on ShopDetails (/shops/:shopId), Browse Shops (2nd item) is active orange */
        body:has([data-student-shops="true"]) nav a:nth-child(2) {
          background-color: #f97316 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.2), 0 2px 4px -2px rgba(249, 115, 22, 0.2) !important;
        }
      `}</style>
    </>
  );
}

