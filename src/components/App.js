import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient   } from 'apollo-client';
import { InMemoryCache  } from 'apollo-cache-inmemory';
import { HttpLink       } from 'apollo-link-http';

import About    from './About';
import Navbar   from './Navbar';
import Overview from './Overview';
import Nodeview from './Nodeview';
import Loading  from './Loading';

class App extends React.Component
{
	state = {
		network: null,
		client:  null,
	}

	componentDidMount()
	{
		this.configure(this.props);
	}

	componentWillReceiveProps(props)
	{
		this.configure(props);
	}

	configure(props)
	{
		const network = this.props.routing.match.params.network;
		const uri     = this.props.config.networks[network].endpoint;
		const cache   = new InMemoryCache();
		const link    = new HttpLink({ uri });
		const client  = new ApolloClient({ cache, link });
		this.setState({ client, network });
	}

	render()
	{
		return (
			<>
				{
					this.state.client
					?
						<ApolloProvider client={this.state.client}>
							<Navbar network={this.state.network} {...this.props} />
							<Route exact path={ `/${this.state.network}`                   } render={ (props) => <Redirect to={ `/${this.state.network}/overview/` }/> } />
							<Route       path={ `/${this.state.network}/about-us`          } render={ (props) => <About    emitter={this.props.emitter} network={this.state.network} config={this.props.config} routing={props}/> } />
							<Route       path={ `/${this.state.network}/overview`          } render={ (props) => <Overview emitter={this.props.emitter} network={this.state.network} config={this.props.config} routing={props}/> } />
							<Route       path={ `/${this.state.network}/nodeview/:address` } render={ (props) => <Nodeview emitter={this.props.emitter} network={this.state.network} config={this.props.config} routing={props}/> } />
						</ApolloProvider>
					:
						<Loading/>
				}
			</>
		);
	}
};

export default App;
