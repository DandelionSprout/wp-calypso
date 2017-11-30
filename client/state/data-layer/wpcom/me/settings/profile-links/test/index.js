/** @format */

/**
 * Internal dependencies
 */
import {
	addUserProfileLinks,
	deleteUserProfileLink,
	handleAddError,
	handleAddSuccess,
	handleDeleteError,
	handleDeleteSuccess,
	handleRequestSuccess,
	requestUserProfileLinks,
} from '../';
import {
	addUserProfileLinks as addUserProfileLinksAction,
	addUserProfileLinksDuplicate,
	addUserProfileLinksError,
	addUserProfileLinksMalformed,
	addUserProfileLinksSuccess,
	deleteUserProfileLink as deleteUserProfileLinkAction,
	deleteUserProfileLinkError,
	deleteUserProfileLinkSuccess,
	receiveUserProfileLinks,
} from 'state/profile-links/actions';
import { USER_PROFILE_LINKS_RECEIVE } from 'state/action-types';
import { http } from 'state/data-layer/wpcom-http/actions';

describe( 'wpcom-api', () => {
	describe( 'user profile links', () => {
		const profileLinks = [
			{
				link_slug: 'wordpress-org',
				title: 'WordPress.org',
				value: 'https://wordpress.org/',
			},
			{
				link_slug: 'wordpress-com',
				title: 'WordPress.com',
				value: 'https://wordpress.com/',
			},
		];
		const error = {
			status: 403,
			message: 'An active access token must be used to query information about the current user.',
		};

		describe( 'requestUserProfileLinks()', () => {
			test( 'should dispatch HTTP request to fetch the users profile links endpoint', () => {
				const dispatch = jest.fn();

				requestUserProfileLinks( { dispatch } );

				expect( dispatch ).toHaveBeenCalledTimes( 1 );
				expect( dispatch ).toHaveBeenCalledWith(
					http( {
						apiVersion: '1.1',
						method: 'GET',
						path: '/me/settings/profile-links',
					} )
				);
			} );
		} );

		describe( 'handleRequestSuccess()', () => {
			test( 'should dispatch user profile links receive action', () => {
				const dispatch = jest.fn();

				handleRequestSuccess( { dispatch }, null, { profile_links: profileLinks } );

				expect( dispatch ).toHaveBeenCalledTimes( 1 );
				expect( dispatch ).toHaveBeenCalledWith( {
					type: USER_PROFILE_LINKS_RECEIVE,
					profileLinks,
				} );
			} );
		} );

		describe( 'addUserProfileLinks()', () => {
			test( 'should dispatch a POST HTTP request to the users new profile links endpoint', () => {
				const dispatch = jest.fn();
				const action = addUserProfileLinksAction( profileLinks );

				addUserProfileLinks( { dispatch }, action );

				expect( dispatch ).toHaveBeenCalledTimes( 1 );
				expect( dispatch ).toHaveBeenCalledWith(
					http(
						{
							apiVersion: '1.2',
							method: 'POST',
							path: '/me/settings/profile-links/new',
							body: {
								links: action.profileLinks,
							},
						},
						action
					)
				);
			} );
		} );

		describe( 'handleAddSuccess()', () => {
			test( 'should dispatch user profile links add success and receive actions', () => {
				const dispatch = jest.fn();
				const data = { profile_links: profileLinks };

				handleAddSuccess( { dispatch }, null, data );

				expect( dispatch ).toHaveBeenCalledTimes( 2 );
				expect( dispatch ).toHaveBeenCalledWith( addUserProfileLinksSuccess( profileLinks ) );
				expect( dispatch ).toHaveBeenCalledWith( receiveUserProfileLinks( profileLinks ) );
			} );

			test( 'should dispatch user profile links add success and duplicate actions', () => {
				const dispatch = jest.fn();
				const data = {
					profile_links: [ profileLinks[ 0 ] ],
					duplicate: [ profileLinks[ 1 ] ],
				};

				handleAddSuccess( { dispatch }, null, data );

				expect( dispatch ).toHaveBeenCalledTimes( 2 );
				expect( dispatch ).toHaveBeenCalledWith( addUserProfileLinksSuccess( data.profile_links ) );
				expect( dispatch ).toHaveBeenCalledWith( addUserProfileLinksDuplicate( data.duplicate ) );
			} );

			test( 'should dispatch user profile links add success and malformed actions', () => {
				const dispatch = jest.fn();
				const data = {
					profile_links: [ profileLinks[ 0 ] ],
					malformed: [ profileLinks[ 1 ] ],
				};

				handleAddSuccess( { dispatch }, null, data );

				expect( dispatch ).toHaveBeenCalledTimes( 2 );
				expect( dispatch ).toHaveBeenCalledWith( addUserProfileLinksSuccess( data.profile_links ) );
				expect( dispatch ).toHaveBeenCalledWith( addUserProfileLinksMalformed( data.malformed ) );
			} );
		} );

		describe( 'handleAddError()', () => {
			test( 'should dispatch user profile links add error action', () => {
				const dispatch = jest.fn();

				handleAddError( { dispatch }, { profileLinks }, error );

				expect( dispatch ).toHaveBeenCalledTimes( 1 );
				expect( dispatch ).toHaveBeenCalledWith( addUserProfileLinksError( profileLinks, error ) );
			} );
		} );

		describe( 'deleteUserProfileLink()', () => {
			test( 'should dispatch a POST HTTP request to the delete user profile link endpoint', () => {
				const dispatch = jest.fn();
				const linkSlug = 'https-wordpress-com';
				const action = deleteUserProfileLinkAction( linkSlug );

				deleteUserProfileLink( { dispatch }, action );

				expect( dispatch ).toHaveBeenCalledTimes( 1 );
				expect( dispatch ).toHaveBeenCalledWith(
					http(
						{
							apiVersion: '1.1',
							method: 'POST',
							path: '/me/settings/profile-links/' + linkSlug + '/delete',
						},
						action
					)
				);
			} );
		} );

		describe( 'handleDeleteSuccess()', () => {
			test( 'should dispatch user profile links delete success action', () => {
				const dispatch = jest.fn();
				const linkSlug = 'https-wordpress-com';

				handleDeleteSuccess( { dispatch }, { linkSlug } );

				expect( dispatch ).toHaveBeenCalledTimes( 1 );
				expect( dispatch ).toHaveBeenCalledWith( deleteUserProfileLinkSuccess( linkSlug ) );
			} );
		} );

		describe( 'handleDeleteError()', () => {
			test( 'should dispatch user profile links add error action', () => {
				const dispatch = jest.fn();
				const linkSlug = 'https-wordpress-com';

				handleDeleteError( { dispatch }, { linkSlug }, error );

				expect( dispatch ).toHaveBeenCalledTimes( 1 );
				expect( dispatch ).toHaveBeenCalledWith( deleteUserProfileLinkError( linkSlug, error ) );
			} );
		} );
	} );
} );
