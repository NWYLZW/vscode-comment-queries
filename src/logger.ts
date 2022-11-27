const logger = new Proxy(console, {
  get() {
    return (...args: any[]) => {
      console.log(`[vscode-comment-queries]`, ...args);
    };
  }
});

export default logger;
