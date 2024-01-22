import { useBlockProps } from '@wordpress/block-editor';
import React, { useEffect, useState } from 'react';
import { Flex, FlexBlock, FlexItem } from '@wordpress/components';

/* Add custom attribute to blocks, in Toolbar */
const { __ } = wp.i18n;

// Enable custom attributes on title, paragraph block
const enableEmojiListToolbarOn = [
    'core/heading',
    'core/paragraph',
    'core/details',
    'core/freeform',
    'core/list-item',
    'core/preformatted',
    'core/pullquote',
    'core/verse',
    'core/cover',
    'core/media-text'
];

const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { BlockControls } = wp.blockEditor;
const {
    ToolbarGroup,
    ToolbarButton,
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
            toolbarAttribute: { type: 'string' }
        } ),
    } );
};
wp.hooks.addFilter(
    'blocks.registerBlockType',
    setToolbarEmojiListAttribute
);



/**
 * Add emoji list to toolbars
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
        const { toolbarAttribute } = attributes;

        return (
            <Fragment>  
                <BlockControls group="block">
                    <ToolbarGroup className="emoji-toolbar">
                        <ToolbarButton
                            className="emoji-toolbar__toogle-button"
                            icon={<span role="img" aria-label="globe">😎</span>}
                            label="Select Emoji"
                            onClick={ () => toggleEmojiList()}
                        />
                        <Flex id="emojiSelectContainer" className="emoji-toolbar__select-container">
                            {EmojisData().map(oEmoji => {
                                return (
                                    <FlexItem className="emoji-toolbar__select-container-item">
                                        <button dangerouslySetInnerHTML={{__html: oEmoji.character}} onClick={ () => (setEmojiIntoText(oEmoji.character)) }></button>
                                    </FlexItem>
                                )
                            })}
                        </Flex>                       
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



/**
 * Get Emojis data from emojihub API to render them in toolbar custom list
 */
function EmojisData() {
    const StoredEmojis = JSON.parse(window.localStorage.getItem("EmojiHubItems"));

    if (StoredEmojis === null || StoredEmojis < 1) {
        const apiUrl = 'https://emojihub.yurace.pro/api/all';

        // Make a GET request to API using the fetchData
        const [data, setData] = useState([]);
        let aAdjustedEmoji = [];

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
           
            // Extract necessary data from API. Push it into own array
            data.forEach(function(oEmoji){
                // Convert unicode emoji into string variable (character)
                let sConvertedUnicode = oEmoji.unicode[0].replace(/U/g, "0").replace(/\+/g, "x");
                var oAdjustedEmoji = {
                    "category": oEmoji.category,
                    "group": oEmoji.group,
                    "name": oEmoji.name,
                    "character": String.fromCodePoint(sConvertedUnicode),
                }
                aAdjustedEmoji.push(oAdjustedEmoji)
            });
            console.log("All Emojis Unicode", aAdjustedEmoji);

            // Set the emojis into a local storage item to safe requests
            window.localStorage.setItem("EmojiHubItems", JSON.stringify(aAdjustedEmoji));

            // Return array as result for toolbar list
            return aAdjustedEmoji;
            
        } else {

            // When no data is fetched, return null. Otherwise function errors.
            return [];
        }
        
    } else {

        // If emojis are stored return them from local storage
        var aEmojisFromStorage = JSON.parse(window.localStorage.getItem("EmojiHubItems"));
        return aEmojisFromStorage;
    }    
}



/**
 * Toggle visibility of emoji select container
 */
function toggleEmojiList () {
    var emojiSelectContainer = jQuery("#emojiSelectContainer");
    emojiSelectContainer.toggleClass("emoji-toolbar__select-container--show");
}



/**
 * When emoji is selected from toolbar list, insert it into parents content
 */
function setEmojiIntoText(emojiCharacter) {
    var cActiveblock = wp.data.select('core/block-editor');

    // Get selected block
    var cSelectedBlock = wp.data.select('core/block-editor').getSelectedBlock();

    // Get selected block content
    var sSelectedBlockContent = cSelectedBlock.attributes["content"];

    //Set current selected block isTyping true, so changes can be detected.
    wp.data.dispatch( 'core/block-editor' ).updateBlock(
        cSelectedBlock.clientId, {
            "isTyping": "true",
            "isEditing": "true"
        }
    )

    // Get last position of the cursor
    var startPos = wp.data.select('core/block-editor').getSelectionStart().offset;
    var endPos = wp.data.select('core/block-editor').getSelectionEnd().offset;

    // Place new content (new emoji) into selected block
    cSelectedBlock.attributes["content"] = "";
    cSelectedBlock.attributes["content"] = sSelectedBlockContent.substring(0, startPos)
    + emojiCharacter
    + sSelectedBlockContent.substring(endPos, sSelectedBlockContent.length);
}

