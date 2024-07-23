const makeDebouncer = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number
) => {
  let timeoutId: any;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export default makeDebouncer;
