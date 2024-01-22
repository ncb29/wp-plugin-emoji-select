import { useBlockProps } from '@wordpress/block-editor';
import React, { useEffect, useState } from 'react';

/* Add custom attribute to paragraph block, in Toolbar */
const { __ } = wp.i18n;

// Enable custom attributes on Paragraph block
const enableEmojiListToolbarOn = [
    'core/paragraph'
];

const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { BlockControls } = wp.blockEditor;
const {
    ToolbarGroup,
    ToolbarDropdownMenu
} = wp.components;



/**
 * Declare custom list attribute
 */
const setToolbarEmojiListAttribute = ( settings, name ) => {
    // Do nothing if it's another block than our defined ones.
    if ( ! enableEmojiListToolbarOn.includes( name ) ) {
        return settings;
    }

    return Object.assign( {}, settings, {
        attributes: Object.assign( {}, settings.attributes, {
            paragraphAttribute: { type: 'string' }
        } ),
    } );
};
wp.hooks.addFilter(
    'blocks.registerBlockType',
    setToolbarEmojiListAttribute
);



/**
 * Add Emoji List to Paragraph Toolbar
 */
const withEmojiListToolbar = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {

        // If current block is not allowed
    	if ( ! enableEmojiListToolbarOn.includes( props.name ) ) {
            return (
                <BlockEdit { ...props } />
            );
        }

        const { attributes, setAttributes } = props;
        const { paragraphAttribute } = attributes;

        return (
            <Fragment>  
                <BlockControls group="block">
                    <ToolbarGroup>
                        <ToolbarDropdownMenu
                            className="emoji-dropdown"
                            title= ";-)"
                            icon={<span role="img" aria-label="globe">😎</span>}
                            label="Select Emoji"
                            controls={
                                // Create control for each emoji from API
                                EmojisData().map(sHtmlEmoji => {
                                    return (
                                        {
                                            title: <div dangerouslySetInnerHTML={{__html: sHtmlEmoji}} ></div>,
                                            onClick: () => (getEmojiClickEvent(event), setEmojiIntoText(sHtmlEmoji)),
                                        }
                                    )
                                })
                            }                               
                        />
                    </ToolbarGroup>
                </BlockControls>
                <BlockEdit { ...props } />
            </Fragment>
        );
    };
}, 'withEmojiListToolbar' );

// Add new filters to toolbars
wp.hooks.addFilter(
    'editor.BlockEdit',
    'custom-attributes/with-toolbar-button',
    withEmojiListToolbar
);


function getEmojiClickEvent(event) {
    console.log("EmojiClickEvent", event)
}


/**
 * Get Emojis data from emojihub API to render them in toolbar custom list
 */
function EmojisData() {
    const StoredEmojiHTML = JSON.parse(window.localStorage.getItem("EmojiHubHTML"));

    if (StoredEmojiHTML === null || StoredEmojiHTML < 1) {
        const apiUrl = 'https://emojihub.yurace.pro/api/all';

        // Make a GET request to API using the fetchData
        const [data, setData] = useState([]);
        let aEmojiHTML = [];

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
        console.log("Raw Data", data);

        if (data.length > 0) {
            // Set the emoji raw data into a local storage item to safe requests
            window.localStorage.setItem("EmojiHubAPIData", JSON.stringify(data));

            // Extract only the html code from API data. Push it into own array
            data.forEach(function(oEmoji){
                oEmoji.htmlCode.forEach(function(oHtmlCode){
                    aEmojiHTML.push(oHtmlCode)
                });
            });
            console.log("All Emojis HTML", aEmojiHTML);

            // Set the emoji html code into a local storage item to safe requests
            window.localStorage.setItem("EmojiHubHTML", JSON.stringify(aEmojiHTML));

            // Return array as result for toolbar list
            return aEmojiHTML;
            
        } else {

            // When no data is fetched, return null. Otherwise function errors.
            return [];
        }
        
    } else {

        // If emoji html is stored return them from local storage
        var ParsedEmojiHTML = JSON.parse(window.localStorage.getItem("EmojiHubHTML"));
        return ParsedEmojiHTML;
    }    
}



/**
 * Check if is typing is active on any block (helper)
 */
wp.data.subscribe(() => {
	const isTyping = wp.data.select('core/block-editor').isTyping()
	if(isTyping) console.log("Currently typing")
})



/**
 * When emoji is selected from toolbar list, insert it into parents content
 */
function setEmojiIntoText(sHtmlEmoji) {
    jQuery.decodeEntities = sHtmlEmoji;
    var cActiveblock = wp.data.select('core/block-editor');
    console.log("Active block ", cActiveblock);

    // Get selected block
    var cSelectedBlock = wp.data.select('core/block-editor').getSelectedBlock();
    console.log("selected Block", cSelectedBlock);

    // Get selected block content
    var sSelectedBlockContent = cSelectedBlock.attributes["content"];

    //Set current selected block isTyping true, so changes can be detected.
    console.log("Selected Block Dispatch", wp.data.dispatch( 'core/block-editor' ));
    wp.data.dispatch( 'core/block-editor' ).updateBlock(
        cSelectedBlock.clientId, {
            "isTyping": "true"
        }
    )

    // Get last position of the cursor
    var startPos = cActiveblock.getSelectionStart().offset;
    var endPos = cActiveblock.getSelectionEnd().offset;

    // Place new content (new emoji) into selected block
    cSelectedBlock.attributes["content"] = "";
    cSelectedBlock.attributes["content"] = sSelectedBlockContent.substring(0, startPos)
    + sHtmlEmoji
    + sSelectedBlockContent.substring(endPos, sSelectedBlockContent.length);
}

