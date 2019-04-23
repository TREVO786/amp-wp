/**
 * Internal dependencies
 */
import { name, settings } from '../';
import { blockEditRender } from '../../../../test/helpers';

describe( 'amp/amp-story-post-author', () => {
	test( 'block edit matches snapshot', () => {
		const wrapper = blockEditRender( name, settings );

		expect( wrapper ).toMatchSnapshot();
	} );
} );
