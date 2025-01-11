const {
  createPrompt,
  useState,
  useKeypress,
  usePrefix,
  usePagination,
  makeTheme,
  isUpKey,
  isDownKey,
  isEnterKey,
} = require("@inquirer/core");
const pc = require("picocolors");

function isEscapeKey(key) {
  return key.name === "escape";
}

export const sortingList = createPrompt((config, done) => {
  const { message, choices, pageSize = 10 } = config;
  const theme = makeTheme({
    icon: { cursor: pc.cyan(">") },
    style: { highlight: pc.cyan },
  });

  const prefix = usePrefix({ theme });
  const [status, setStatus] = useState("idle");

  const [items, setItems] = useState(choices);
  const [active, setActive] = useState(0);
  const originalOrder = [...choices]; // Store the original order for escape

  if (items.length === 0) {
    return `${prefix.idle} ${message}\n(No items to display)`;
  }

  useKeypress((key) => {
    if (isEscapeKey(key)) {
      done(originalOrder); // Exit without changes
    } else if (isEnterKey(key)) {
      setStatus("done");
      done(items);
    } else if (isUpKey(key) || isDownKey(key)) {
      const offset = isUpKey(key) ? -1 : 1;

      if (key.shift) {
        // Reorder the items with Shift + Arrow
        const newIndex = active + offset;
        if (newIndex >= 0 && newIndex < items.length) {
          const newItems = [...items];
          [newItems[active], newItems[newIndex]] = [
            newItems[newIndex],
            newItems[active],
          ];
          setItems(newItems);
          setActive(newIndex); // Update active position
        }
      } else {
        // Navigate the list
        const newActive = active + offset;
        if (newActive >= 0 && newActive < items.length) {
          setActive(newActive);
        }
      }
    }
  });

  const page = usePagination({
    items,
    active,
    renderItem({ item, isActive }) {
      const cursor = isActive ? theme.icon.cursor : " ";
      const color = isActive ? theme.style.highlight : (text) => text;

      return color(`${cursor} ${pc.bold(item)}`);
    },
    pageSize,
    loop: false, // Disable loop
  });

  if (status === "done") {
    return `${theme.prefix.idle} ${pc.bold(message)} ${pc.cyan(items).toString()}`;
  }
  const helpermessage = `(use arrow keys to navigate, shift+up/down to reorder, enter to confirm, escape to cancel)`;
  return `${theme.prefix.idle} ${pc.bold(message)}\n${page}\n${pc.dim(
    helpermessage,
  )}`;
});

module.exports = { sortingList };
