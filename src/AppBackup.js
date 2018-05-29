import React, { Component } from 'react';
import Layout from './components/Layout/Layout';
import AppRouter from './routers/AppRouter';

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <AppRouter />
        </Layout>
      </div>
    );
  }
}

export default App;
