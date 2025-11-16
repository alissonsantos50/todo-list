export default interface HTTPServer {
  route(
    method: string,
    url: string,
    callback: Function,
    middlewares?: any[],
  ): void;
  listen(port: number): void;
}
