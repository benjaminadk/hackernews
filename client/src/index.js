import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { GC_AUTH_TOKEN } from './constants';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj78movkw0wsh013757ffw9w6'
});

const wsClient = new SubscriptionClient('wss://subscriptions.us-west-2.graph.cool/v1/cj78movkw0wsh013757ffw9w6', {
  reconnect: true,
  connectionParams: {
     authToken: window.localStorage.getItem(GC_AUTH_TOKEN),
  }
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    const token = window.localStorage.getItem(GC_AUTH_TOKEN)
    req.options.headers.authorization = token ? `Bearer ${token}` : null
    next()
  }
}])

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
})

ReactDOM.render(
<BrowserRouter>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
</BrowserRouter>
  , document.getElementById('root')
);

registerServiceWorker();
