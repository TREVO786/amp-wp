/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import getFeaturedImageNotice from './get-featured-image-notice';
import { hasMinimumStoryPosterDimensions } from '../stories-editor/helpers';

export default getFeaturedImageNotice(
	hasMinimumStoryPosterDimensions,
	__( 'The featured image must have minimum dimensions of 696px x 928px', 'amp' )
);
