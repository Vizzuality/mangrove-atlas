import { atom } from 'jotai';

// True while the first-visit welcome dialog is open. The dialog is modal
// (Radix puts `aria-hidden` on everything outside its portal and traps focus),
// so anything else that needs the visitor's attention — the cookie banner —
// waits for it to close instead of rendering unreachable underneath.
export const welcomeMessageOpenAtom = atom<boolean>(false);
