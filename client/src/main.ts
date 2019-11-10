import * as $ from 'jquery';
import Vue from 'vue';
import Vuex, { mapState } from 'vuex';
import Router from 'vue-router';

// components
import LoginList from './components/login-list.vue';
import ItemList from './components/item-list.vue';
import NavBar from './components/nav-bar.vue';
import UserProfile from './components/user-profile.vue';
import AdminSettings from './components/admin-settings.vue';

// store
import store from './store/store';
import appStore, { AppState } from './store/app';
import itemStore from './store/items';

class Wishlist {
	public async run() {
		Vue.use( Vuex );
		Vue.use( Router );

		const router = new Router( {
			mode: 'history',
			routes: [
				{
					path: '/',
					redirect: ( _ ) => '/items/' + new Date().getFullYear(),
				},
				{
					path: '/items',
					redirect: ( _ ) => '/items/' + new Date().getFullYear(),
				},
				{
					path: '/items/:year',
					name: 'items',
					components: {
						default: ItemList,
						navbar: NavBar,
					},
					meta: {
						requiresAuth: true,
					},
				},
				{
					path: '/login',
					components: {
						default: LoginList,
						navbar: NavBar,
					},
					meta: {
						guest: true,
					},
				},
				{
					path: '/profile',
					components: {
						default: UserProfile,
						navbar: NavBar,
					},
					meta: {
						requiresAuth: true,
					},
				},
				{
					path: '/admin',
					components: {
						default: AdminSettings,
						navbar: NavBar,
					},
					meta: {
						requiresAuth: true,
						requiresAdmin: true,
					},
				},
			],
		} );

		router.beforeEach( ( to, _, next ) => {
			if ( to.name && to.name === 'items' && to.params.year ) {
				appStore.setYearViewing( to.params.year );
				itemStore.retrieveItems( {
					year: appStore.state.yearViewing as string,
				} ).catch( ( err ) => { console.error( err ); } );
			} else {
				appStore.setYearViewing( false );
			}

			if ( to.matched.some( ( record ) => record.meta.requiresAuth ) ) {
				if ( !appStore.state.loggedIn ) {
					console.log( 'route requires login, redirecting' );
					console.log( to );
					next( '/login' );
				} else {
					if ( to.matched.some( ( record ) => record.meta.requiresAdmin ) ) {
						const user = appStore.state.user;
						if ( ! user || ! user.is_admin ) {
							console.log( 'route requires admin, redirecting' );
							console.log( to );
							next( '/' );
						} else {
							console.log( 'route requires admin, allowing' );
							console.log( to );
							next();
						}
					} else {
						console.log( 'route requires login but not admin, allowing' );
						console.log( to );
						next();
					}
				}
			} else if ( to.matched.some( ( record ) => record.meta.guest ) ) {
				if ( appStore.state.loggedIn ) {
					console.log( 'route requires guest, redirecting' );
					console.log( to );
					next( '/' );
				} else {
					console.log( 'route requires guest, allowing' );
					console.log( to );
					next();
				}
			} else {
				console.log( 'route has no restrictions, allowing' );
				console.log( to );
				next();
			}
		} );

		// load the current user info before the app so the inital route resolves correctly if we're already logged in
		await appStore.checkUser();

		// tslint:disable-next-line:no-unused-expression
		new Vue( {
			el: '#app',
			store: store,
			router: router,
			components: {
				'wl-loginlist': LoginList,
				'wl-itemlist':  ItemList,
				'wl-navbar':    NavBar,
			},
			computed: {
				...mapState( 'app', {
					loggedIn: ( state: AppState ) => state.loggedIn,
				} ),
			},
		} );
	}
}

$.ready.then( () => {
	const app = new Wishlist();

	app.run().then( () => {
		console.log( 'done!' );
	} ).catch( ( err ) => {
		console.error( err );
	} );
} );
