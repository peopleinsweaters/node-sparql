
export interface SparqlSelectValue {
  type: string;
  value: any;
}

export interface SparqlSelectBinding {
  [key: string]: SparqlSelectValue;
}

export interface SparqlSelectResults {
  head: {
    vars: string[];
  };
  results: {
    bindings: SparqlSelectBinding[];
  };
}
