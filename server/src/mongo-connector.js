import { MongoClient, Logger } from 'mongodb';

const MONGO_URL = 'mongodb://test:test@ds121464.mlab.com:21464/how-to-graphql-node';

let logCount = 0;
  Logger.setCurrentLogger((msg, state) => {
    console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`);
  });
  Logger.setLevel('debug');
  Logger.filter('class', ['Cursor']);

export default async () => {
  const db = await MongoClient.connect(MONGO_URL);
  return {
      Links: db.collection('links'),
      Users: db.collection('users'),
      Votes: db.collection('votes')
  };
}