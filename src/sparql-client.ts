
import { SparqlSelectResults } from './sparql-select-results';
import got from 'got';
import { Observable } from 'rxjs';
import { SparqlAskResults } from './sparql-ask-results';

export interface SparqlClientOptions {
  /** authentication options */
  auth?: {
    username: string;
    password: string;
  };
}

export class SparqlClient {
  private url: string;
  private options: SparqlClientOptions;

  constructor(url: string, options?: SparqlClientOptions) {
    this.url = url;
    this.options = options;
  }

  /**
   * Execute an ask query
   * @param query the ask query
   */
  public ask(query: string): Observable<SparqlAskResults> {
    return this.pQuery(this.url, query, 'application/sparql-results+json');
  }

  /**
   * Execute a select query
   * @param query the select query
   */
  public select(query: string): Observable<SparqlSelectResults> {
    return this.pQuery(this.url, query, 'application/sparql-results+json');
  }

  /**
   * Execute a construct query
   * @param query the construct query
   */
  public construct<T>(query: string): Observable<T> {
    return this.pQuery<T>(this.url, query, 'application/ld+json; profile="http://www.w3.org/ns/json-ld#expanded"');
  }

  /**
   * Note: If you know the type of query being executed
   * then use the corresponding method: `ask`, `select`, or `construct`
   * @param request an ask, select, or construct query
   */
  public query<T>(request: string): Observable<T> {
    return this.pQuery(this.url, request, ['application/sparql-results+json', 'application/ld+json; profile="http://www.w3.org/ns/json-ld#expanded"']);
  }

  /**
   * 
   * @param request 
   */
  public update(request: string): Observable<string> {
    return this.pUpdate(this.url, request, ['*/*']);
  }

  // Private methods
  // --------------------------------------------------------------------------

  private pUpdate(url: string, update: string, resultType: string | string[]): Observable<string> {
    return new Observable((subscriber) => {
      const request = got.post(url, {
        username: this.options?.auth?.username,
        password: this.options?.auth?.password,
        resolveBodyOnly: true,
        responseType: 'text',
        form: {
          update: update,
        },
        headers: {
          Accept: resultType,
        },
      });
      request.then((result) => {
        subscriber.next(result);
        subscriber.complete();
      }).catch((err) => {
        subscriber.error(err);
        subscriber.complete();
      });
      return () => {
        request.cancel();
      };
    });
  }  

  private pQuery<T>(url: string, query: string, resultType: string | string[]): Observable<T> {
    return new Observable((subscriber) => {
      const request = got.post<T>(url, {
        username: this.options?.auth?.username,
        password: this.options?.auth?.password,
        resolveBodyOnly: true,
        responseType: 'json',
        form: {
          query: query,
        },
        headers: {
          Accept: resultType,
        },
      });
      request.then((result) => {
        subscriber.next(result);
        subscriber.complete();
      }).catch((err) => {
        subscriber.error(err);
        subscriber.complete();
      });
      return () => {
        request.cancel();
      };
    });
  }
}