import { useEffect } from "react";

const usePreventActions = () => {
  useEffect(() => {
    // Prevent context menu (right-click)
    const handleContextMenu = (e) => e.preventDefault();

    // Prevent copying
    const handleCopy = (e) => e.preventDefault();

    // Prevent cutting
    const handleCut = (e) => e.preventDefault();

    // Prevent keyboard shortcuts (Ctrl+A, Ctrl+C, Ctrl+X, etc.)
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && ["a", "c", "x", "s", "p"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };

    // Prevent drag operations
    const handleDragStart = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

   
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);
};

export default usePreventActions;
