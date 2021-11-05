export const pieceClick: React.Reducer<boolean, string> = (
  prevState,
  action
) => {
  switch (action) {
    case "action":
      return true;
    default:
      return false;
  }
};
