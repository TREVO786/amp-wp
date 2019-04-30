/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { getColorClassName, getColorObjectByAttributeValues } from '@wordpress/block-editor';

/**
 * Determines whether whether the image has the minimum required dimensions.
 *
 * The image should have a width of at least 1200 pixels to satisfy the requirements of Google Search for Schema.org metadata.
 *
 * For AMP Stories, the featured image will be used for the poster-portrait-src.
 * For this, it should have a width of at least 696px and a height of at least 928px.
 *
 * @param {Object} media      A media object with width and height values.
 * @param {Object} dimensions An object with minimum required width and height values.
 * @return {boolean} Whether the media has the minimum dimensions.
 */
export const hasMinimumDimensions = ( media, dimensions ) => {
	if ( ! media || ! media.width || ! media.height ) {
		return false;
	}

	const { width, height } = dimensions;

	return ( media.width >= width && media.height >= height );
};

/**
 * Get minimum dimensions for a featured image.
 *
 * @link https://developers.google.com/search/docs/data-types/article#article_types
 *
 * "Images should be at least 1200 pixels wide.
 * For best results, provide multiple high-resolution images (minimum of 800,000 pixels when multiplying width and height)
 * with the following aspect ratios: 16x9, 4x3, and 1x1."
 *
 * Given this requirement, this function ensures the right aspect ratio.
 * The 16/9 aspect ratio is chosen because it has the smallest height for the given width.
 *
 * @return {Object} Minimum dimensions including width and height.
 */
export const getMinimumFeaturedImageDimensions = () => {
	const width = 1200;

	const height = width * ( 9 / 16 );

	return { width, height };
};

/**
 * Validates the an image based on requirements.
 *
 * @param {Object}  media      A media object with width and height values.
 * @param {Object}  dimensions An object with minimum required width and height values.
 * @param {boolean} required   Whether the image is required or not.
 * @return {string[]|null} Validation errors, or null if there were no errors.
 */
export const validateFeaturedImage = ( media, dimensions, required ) => {
	if ( ! media ) {
		if ( required ) {
			return [ __( 'Selecting a featured image is required.', 'amp' ) ];
		}

		return [ __( 'Selecting a featured image is recommended for an optimal user experience.', 'amp' ) ];
	}

	const errors = [];

	if ( ! [ 'image/png', 'image/gif', 'image/jpeg' ].includes( media.mime_type ) ) {
		errors.push(
			/* translators: 1: .jpg, 2: .png. 3: .gif */
			sprintf( __( 'The featured image must be in %1$s, %2$s, or %3$s format.', 'amp' ), '.jpg', '.png', '.gif' )
		);
	}

	if ( ! hasMinimumDimensions( media.media_details, dimensions ) ) {
		const { width, height } = dimensions;

		errors.push(
			/* translators: 1: minimum width, 2: minimum height. */
			sprintf( __( 'The featured image should have a size of at least %1$s by %2$s pixels.', 'amp' ), Math.ceil( width ), Math.ceil( height ) )
		);
	}

	return 0 === errors.length ? null : errors;
};

/**
 * Converts hex to rgba.
 *
 * @param {string} hex Hex value.
 * @param {number} opacity Opacity.
 * @return {Object} Rgba value.
 */
export const getRgbaFromHex = ( hex, opacity ) => {
	if ( ! hex ) {
		return [];
	}
	hex = hex.replace( '#', '' );
	const r = parseInt( hex.substring( 0, 2 ), 16 );
	const g = parseInt( hex.substring( 2, 4 ), 16 );
	const b = parseInt( hex.substring( 4, 6 ), 16 );
	return [
		r,
		g,
		b,
		opacity / 100,
	];
};

export const getBackgroundColorWithOpacity = ( colors, backgroundColor, customBackgroundColor, opacity ) => {
	const hasOpacity = opacity && opacity < 100;
	const backgroundClass = getColorClassName( 'background-color', backgroundColor );

	let appliedBackgroundColor;

	// If we need to assign opacity.
	if ( hasOpacity && ( backgroundColor || customBackgroundColor ) ) {
		const hexColor = getColorObjectByAttributeValues( colors, backgroundColor, customBackgroundColor );

		if ( hexColor ) {
			const [ r, g, b, a ] = getRgbaFromHex( hexColor.color, opacity );

			appliedBackgroundColor = `rgba( ${ r }, ${ g }, ${ b }, ${ a })`;
		}
	} else if ( ! backgroundClass ) {
		appliedBackgroundColor = customBackgroundColor;
	}

	return appliedBackgroundColor;
};
