import { useEffect, useState } from "react";

export function useKpiCardInteractions(
  containerRef: React.RefObject<HTMLDivElement>,
) {
  const [selectedCard, setSelectedCard] = useState<string | undefined>();

  function cardClickEvent(cardId: string) {
    setSelectedCard(cardId);
  }

  useEffect(() => {
    // Attach global event listener
    function handleClickOutside(event: MouseEvent) {
      const scrollStart = window.innerWidth - 20;

      const isClickingScrollbar = event.clientX > scrollStart;

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node | null) &&
        !isClickingScrollbar
      ) {
        setSelectedCard(undefined);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCard(undefined);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef]);

  return { selectedCard, clickOnCard: cardClickEvent };
}
