
import { SparqlClient } from '../src/index';

function printResults(name: string, results: any) {
  console.log(`${name} results:`);
  console.log('----------------------------------------------------------');
  console.log(JSON.stringify(results, null, 2));
  console.log();
}

async function main(): Promise<void> {
  const db = new SparqlClient('http://localhost:3030/testing', {
    auth: {
      username: 'admin',
      password: 'admin',
    },
  });

  try {
    const clearResult = await db.update(`
      CLEAR ALL
    `).toPromise();
    printResults('Clear', clearResult);

    const insertResult = await db.update(`
      PREFIX example: <http://example.com/>
      INSERT DATA {
        example:pablo example:firstName "Pablo" ;
                     example:lastName "Picasso" .
      }
    `).toPromise();
    printResults('Insert', insertResult);

    const selectResult = await db.select(`
      SELECT * WHERE {
        ?s ?p ?o .
      }
      LIMIT 10
    `).toPromise();
    printResults('Select', selectResult);

    const constructResult = await db.construct<any>(`
      CONSTRUCT {
        ?s ?p ?o .
      } WHERE {
        ?s ?p ?o .
      }
    `).toPromise();
    printResults('Construct', constructResult);

    const askResult = await db.ask(`
      ASK WHERE {
        ?s ?p ?o .
      }
    `).toPromise();
    printResults('Ask', askResult);
  } catch (err) {
    console.error(err);
  }
}

main();