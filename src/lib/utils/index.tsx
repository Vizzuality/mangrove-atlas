export const orderByAttribute = (
  orderedListIds: string[],
  list: { id: string; opacity: string }[]
) =>
  list.sort((a, b) => {
    const indexA = orderedListIds.indexOf(a.id);
    const indexB = orderedListIds.indexOf(b.id);

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
