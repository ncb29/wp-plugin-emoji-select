import React, { useEffect, useState } from 'react';

/* Add custom attribute to paragraph block, in Toolbar */
const { __ } = wp.i18n;

// Enable custom attributes on Paragraph block
const enableToolbarButtonOnBlocks = [
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
 * Declare our custom attribute
 */
const setToolbarButtonAttribute = ( settings, name ) => {
    // Do nothing if it's another block than our defined ones.
    if ( ! enableToolbarButtonOnBlocks.includes( name ) ) {
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
    'custom-attributes/set-toolbar-button-attribute',
    setToolbarButtonAttribute
);

function EmojisData() {
    const apiUrl = 'https://emojihub.yurace.pro/api/all';

	// Make a GET request using the Fetch API
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
    
    data.forEach(function(oEmoji){
        oEmoji.htmlCode.forEach(function(oHtmlCode){
            // var oIcon = {
            //     title: "Test",
            //     icon: oHtmlCode
            // }
            aEmojiHTML.push(oHtmlCode)
        });
    });
    console.log(aEmojiHTML)
	return aEmojiHTML;
}

/**
 * Add Custom Button to Paragraph Toolbar
 */
const withToolbarButton = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {

        // If current block is not allowed
    	if ( ! enableToolbarButtonOnBlocks.includes( props.name ) ) {
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
                            title= ";-)"
                            icon= "&#128512;"
                            label="Select a direction"
                            controls={EmojisData().map(sHtmlEmoji => {
                                return (
                                    {
                                        title: <div dangerouslySetInnerHTML={{__html: sHtmlEmoji}} ></div>,
                                        onClick: () => setEmojiIntoText(sHtmlEmoji),
                                    }
                                )
                            })}                               
                        />
                    </ToolbarGroup>
                </BlockControls>
                <BlockEdit { ...props } />
            </Fragment>
        );
    };
}, 'withToolbarButton' );

wp.hooks.addFilter(
    'editor.BlockEdit',
    'custom-attributes/with-toolbar-button',
    withToolbarButton
);


function setEmojiIntoText(sHtmlEmoji) {
    var cSelectedBlock = wp.data.select('core/block-editor').getSelectedBlock();
    console.log("selectedBlock", cSelectedBlock);

    var sSelectedBlockContent = cSelectedBlock.attributes["content"];
    console.log("FFF", sSelectedBlockContent);

    var block  = wp.data.select('core/block-editor');
    console.log("block ", block );

    var startPos = block.getSelectionStart().offset;
    var endPos = block.getSelectionEnd().offset;
    var newSelectedBlockContent = sSelectedBlockContent.substring(0, startPos)
        + "<html>"+sHtmlEmoji+"</html>"
        + sSelectedBlockContent.substring(endPos, sSelectedBlockContent.length);

    console.log("selectedBlockContent NEW", newSelectedBlockContent);
    cSelectedBlock.attributes["content"] = newSelectedBlockContent;
}
