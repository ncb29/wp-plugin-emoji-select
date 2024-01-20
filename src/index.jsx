import React, { useEffect, useState } from 'react';
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
// import Edit from './edit';
import save from './save';
import metadata from './block.json';


function EmojisData() {
    const apiUrl = 'https://emojihub.yurace.pro/api/all';

	// Make a GET request using the Fetch API
	const [data, setData] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
		const response = await fetch(apiUrl);
		const result = await response.json();
		setData(result);
		} catch (error) {
		console.error('Error fetching data:', error);
		}
	};

	return data;
}

function SelectedEmoji( { emoji } ) {
    const src = emoji;
    return <div dangerouslySetInnerHTML={{__html: emoji}} ></div>; 
}


registerBlockType( metadata.name, {
	
    attributes: {
        emoji: {
            type: 'chars',
            default: ''
        }
    },

    edit: function(props) {

        const { attributes: { emoji }, setAttributes } = props;
		// const blockProps = useBlockProps();

        function setEmoji( event ) {
            const selected = event.target.querySelector( 'option:checked' );
            setAttributes( { emoji: selected.value } );
            event.preventDefault();
        }

        return (
            <div className={ props.className }>
                <SelectedEmoji emoji={ emoji } /> 
                <form onSubmit={ setEmoji }>
                    <select value={ emoji } onChange={ setEmoji }>
					{EmojisData().map(item => {
						return (
							<option value={item.htmlCode}>
								<div dangerouslySetInnerHTML={{__html: item.htmlCode}} ></div>
							</option> 
						)
					})}   
                    </select> 
                </form> 
            </div> 
        );
    },

    save,
} );
