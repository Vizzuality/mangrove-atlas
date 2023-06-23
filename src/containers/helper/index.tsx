import { useState } from 'react';

import { createPortal } from 'react-dom';

export const Helper = ({ children }) => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  return (
    <>
      <div className="absolute z-20">
        <button
          className="relative flex h-5 w-5 items-center justify-center"
          onClick={() => setShowOverlay(true)}
        >
          <span className="absolute inline-flex h-full w-full animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-brand-400 opacity-50"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-800" />
        </button>
      </div>
      {children}

      {createPortal(
        showOverlay && (
          <div
            className="fixed inset-0 top-0 z-[1000] flex h-full w-full bg-black/50 backdrop-blur-sm"
            onClick={() => setShowOverlay(false)}
          >
            <div className="h-fit rounded bg-white p-5">
              <h3>This is a helper dialog</h3>
              <p>Information for help</p>
            </div>
          </div>
        ),
        document.body
      )}
    </>
  );
};

export default Helper;
