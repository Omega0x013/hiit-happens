export type RequestHeaders = Record<string, undefined|string>
export type RuntimeRequest = {
  body: ReadableStream<Uint8Array<ArrayBufferLike>> | null
  headers: RequestHeaders,
  method: string,
  query: string,
  path: string
}

export class FunctionEvent {

  public readonly body: ReadableStream<Uint8Array<ArrayBufferLike>> | null;
  public readonly headers: RequestHeaders;
  public readonly method: string;
  public readonly query: unknown;
  public readonly path: string;

  constructor(req: RuntimeRequest) {
    this.body = req.body;
    this.headers = req.headers;
    this.method = req.method;
    this.query = req.query;
    this.path = req.path;
  }
}

export class FunctionContext {

  private cbCalled: number;
  private statusCode: number;
  private headerValues: RequestHeaders;
  private cb: (error: unknown, success: unknown) => void;

  constructor(cb : (error: unknown, success: unknown) => void) {
    this.statusCode = 200;
    this.cb = cb;
    this.headerValues = {};
    this.cbCalled = 0;
  }

  status(): number;
  status(statusCode: number): this;
  status(statusCode?: number): number | this  {
    if(statusCode === undefined) {
      // When no argument is provided, return the status code
      return this.statusCode;
    }
  
    // When an argument is provided, set it and return this
    this.statusCode = statusCode;
    return this;
  }

  headers(): RequestHeaders;
  headers(value: RequestHeaders): this;
  headers(value?: RequestHeaders|undefined): RequestHeaders|this {
    if(value === undefined) {
      return this.headerValues;
    }

    this.headerValues = value;
    return this;    
  }

  succeed(value: unknown) {
    this.cbCalled++;
    this.cb(undefined, value);
  }

  fail(error: unknown) {
    if(this.status() === 200) {
      this.status(500)
    }

    this.cbCalled++;
    this.cb(error, undefined);
  }

  getCbCalled(): number {
    return this.cbCalled;
  }
}

