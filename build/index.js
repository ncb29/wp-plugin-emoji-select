/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.jsx":
/*!***********************!*\
  !*** ./src/index.jsx ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _toolbarEmojiList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toolbarEmojiList */ "./src/toolbarEmojiList.jsx");
/**
 * Import CSS.
 */


/**
 * Import internal dependencies
 */


/***/ }),

/***/ "./src/toolbarEmojiList.jsx":
/*!**********************************!*\
  !*** ./src/toolbarEmojiList.jsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);

/**
 * Get components and dependencies from React and WordPress
 */




/**
 * Enable emoji list in toolbar of common blocks
 */
const enableEmojiListToolbarOn = ['core/heading', 'core/paragraph', 'core/details', 'core/freeform', 'core/list-item', 'core/preformatted', 'core/pullquote', 'core/verse', 'core/cover', 'core/media-text'];

/**
 * Define components for emoji list toolbar
 */
const {
  createHigherOrderComponent
} = wp.compose;
const {
  Fragment
} = wp.element;
const {
  BlockControls
} = wp.blockEditor;
const {
  ToolbarGroup,
  ToolbarButton
} = wp.components;

/**
 * Declare emoji list toolbar attributes to common toolbars
 */
const setToolbarEmojiListAttribute = (settings, name) => {
  // Do nothing if it's another block than our defined ones.
  if (!enableEmojiListToolbarOn.includes(name)) {
    return settings;
  }
  return Object.assign({}, settings, {
    attributes: Object.assign({}, settings.attributes, {
      toolbarAttribute: {
        type: 'string'
      }
    })
  });
};
wp.hooks.addFilter('blocks.registerBlockType', setToolbarEmojiListAttribute);

/**
 * Render emoji list to toolbars
 */
const withEmojiListToolbar = createHigherOrderComponent(BlockEdit => {
  return props => {
    // If current block is not allowed
    if (!enableEmojiListToolbarOn.includes(props.name)) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockEdit, {
        ...props
      });
    }
    const {
      attributes
    } = props;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockControls, {
      group: "block"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ToolbarGroup, {
      className: "emoji-toolbar"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ToolbarButton, {
      className: "emoji-toolbar__toogle-button",
      icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        role: "img",
        "aria-label": "globe"
      }, "\uD83D\uDE0E"),
      label: "Select Emoji",
      onClick: () => toggleEmojiList()
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Flex, {
      id: "emojiSelectContainer",
      className: "emoji-toolbar__select-container"
    }, EmojisData().map(oEmoji => {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexItem, {
        className: "emoji-toolbar__select-container-item"
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
        dangerouslySetInnerHTML: {
          __html: oEmoji.character
        },
        onClick: () => setEmojiIntoText(oEmoji.character)
      }));
    })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockEdit, {
      ...props
    }));
  };
}, 'withEmojiListToolbar');

// Add new filter to toolbars
wp.hooks.addFilter('editor.BlockEdit', 'custom-attributes/with-toolbar-button', withEmojiListToolbar);

/**
 * Get Emojis data from emojihub API to render them in toolbar custom list
 */
function EmojisData() {
  const StoredEmojis = JSON.parse(window.localStorage.getItem('EmojiHubItems'));
  if (StoredEmojis === null || StoredEmojis < 1) {
    const apiUrl = 'https://emojihub.yurace.pro/api/all';

    // Make a GET request to API using the fetchData
    const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    let aAdjustedEmojis = [];
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
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
    console.log('Raw Emoji Data from API', data);
    if (data.length > 0) {
      // Extract necessary data from API. Push it into own array
      data.forEach(function (oEmoji) {
        // Convert unicode emoji into string letiable (character)
        let sConvertedUnicode = oEmoji.unicode[0].replace(/U/g, '0').replace(/\+/g, 'x');
        let oAdjustedEmoji = {
          'category': oEmoji.category,
          'group': oEmoji.group,
          'name': oEmoji.name,
          'character': String.fromCodePoint(sConvertedUnicode)
        };
        aAdjustedEmojis.push(oAdjustedEmoji);
      });
      console.log('All Emojis Unicode', aAdjustedEmojis);

      // Set the emojis into a local storage item to safe requests
      window.localStorage.setItem('EmojiHubItems', JSON.stringify(aAdjustedEmojis));

      // Return array as result for toolbar list
      return aAdjustedEmojis;
    } else {
      // When no data is fetched, return empty array. Otherwise function errors.
      return [];
    }
  } else {
    // If emojis are stored return them from local storage
    let aEmojisFromStorage = JSON.parse(window.localStorage.getItem('EmojiHubItems'));
    return aEmojisFromStorage;
  }
}

/**
 * Toggle visibility of emoji select container
 */
function toggleEmojiList() {
  let emojiSelectContainer = jQuery('#emojiSelectContainer');
  emojiSelectContainer.toggleClass('emoji-toolbar__select-container--show');
}

/**
 * When emoji is selected from toolbar list, insert it into parents content
 */
function setEmojiIntoText(emojiCharacter) {
  // Get current active block
  let cActiveblock = wp.data.select('core/block-editor');

  // Get selected block
  let cSelectedBlock = cActiveblock.getSelectedBlock();

  // Get selected block content
  let sSelectedBlockContent = cSelectedBlock.attributes['content'];

  //Set current selected block isTyping true, so changes can be detected.
  wp.data.dispatch('core/block-editor').updateBlock(cSelectedBlock.clientId, {
    'isTyping': 'true',
    'isEditing': 'true'
  });

  // Get last position of the cursor
  let startPos = cActiveblock.getSelectionStart().offset;
  let endPos = cActiveblock.getSelectionEnd().offset;

  // Place new content (new emoji) into selected block
  cSelectedBlock.attributes['content'] = '';
  cSelectedBlock.attributes['content'] = sSelectedBlockContent.substring(0, startPos) + emojiCharacter + sSelectedBlockContent.substring(endPos, sSelectedBlockContent.length);
}

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkemoji_select"] = globalThis["webpackChunkemoji_select"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.jsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map