
/**
 * Import React.
 */
import React, { useEffect, useState } from 'react';

/**
 * Import WordPress components.
 */
import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    RichText,
    AlignmentToolbar,
    InspectorControls,
    BlockControls,
} from '@wordpress/block-editor';
import { Toolbar, ToolbarDropdownMenu } from '@wordpress/components';

/**
 * Import CSS.
 */
import './style.scss';

/**
 * Import internal dependencies
 */
import './toolbarEmojiList'; 
