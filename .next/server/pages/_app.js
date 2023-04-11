/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/components/media-query/index.ts":
/*!*********************************************!*\
  !*** ./src/components/media-query/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Media\": () => (/* binding */ Media),\n/* harmony export */   \"MediaContextProvider\": () => (/* binding */ MediaContextProvider),\n/* harmony export */   \"mediaStyles\": () => (/* binding */ mediaStyles)\n/* harmony export */ });\n/* harmony import */ var _artsy_fresnel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @artsy/fresnel */ \"@artsy/fresnel\");\n/* harmony import */ var _artsy_fresnel__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_artsy_fresnel__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var styles_styles_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styles/styles.config */ \"./src/styles/styles.config.js\");\n/* harmony import */ var styles_styles_config__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styles_styles_config__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst ExampleAppMedia = (0,_artsy_fresnel__WEBPACK_IMPORTED_MODULE_0__.createMedia)({\n    breakpoints: Object.keys(styles_styles_config__WEBPACK_IMPORTED_MODULE_1__.screens).reduce((res, key)=>({\n            ...res,\n            // We extract the pixel value of the breakpoint (e.g. `'1024px'` => `1024`)\n            [key]: parseInt(styles_styles_config__WEBPACK_IMPORTED_MODULE_1__.screens[key].match(/(\\d+)px/)?.[1] ?? \"0\", 10)\n        }), {\n        // We need a breakpoint starting at 0 to target screens smaller than sm\n        \"0\": 0\n    })\n});\n// Make styles for injection into the header of the page\nconst mediaStyles = ExampleAppMedia.createMediaStyle();\nconst { Media , MediaContextProvider  } = ExampleAppMedia;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9tZWRpYS1xdWVyeS9pbmRleC50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQTZDO0FBRUU7QUFFL0MsTUFBTUUsa0JBQWtCRiwyREFBV0EsQ0FJakM7SUFDQUcsYUFBYUMsT0FBT0MsSUFBSSxDQUFDSix5REFBT0EsRUFBRUssTUFBTSxDQUN0QyxDQUFDQyxLQUFLQyxNQUFTO1lBQ2IsR0FBR0QsR0FBRztZQUNOLDJFQUEyRTtZQUMzRSxDQUFDQyxJQUFJLEVBQUVDLFNBQVNSLHlEQUFPLENBQUNPLElBQUksQ0FBQ0UsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksS0FBSztRQUM3RCxJQUNBO1FBQ0UsdUVBQXVFO1FBQ3ZFLEtBQUs7SUFDUDtBQUVKO0FBRUEsd0RBQXdEO0FBQ2pELE1BQU1DLGNBQWNULGdCQUFnQlUsZ0JBQWdCLEdBQUc7QUFFdkQsTUFBTSxFQUFFQyxNQUFLLEVBQUVDLHFCQUFvQixFQUFFLEdBQUdaLGdCQUFnQiIsInNvdXJjZXMiOlsid2VicGFjazovL21hbmdyb3ZlLWF0bGFzLy4vc3JjL2NvbXBvbmVudHMvbWVkaWEtcXVlcnkvaW5kZXgudHM/NDNlZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVNZWRpYSB9IGZyb20gJ0BhcnRzeS9mcmVzbmVsJztcblxuaW1wb3J0IHsgc2NyZWVucyB9IGZyb20gJ3N0eWxlcy9zdHlsZXMuY29uZmlnJztcblxuY29uc3QgRXhhbXBsZUFwcE1lZGlhID0gY3JlYXRlTWVkaWE8XG4gIHsgYnJlYWtwb2ludHM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gfSxcbiAgJzAnIHwga2V5b2YgdHlwZW9mIHNjcmVlbnMsXG4gIG5ldmVyXG4+KHtcbiAgYnJlYWtwb2ludHM6IE9iamVjdC5rZXlzKHNjcmVlbnMpLnJlZHVjZShcbiAgICAocmVzLCBrZXkpID0+ICh7XG4gICAgICAuLi5yZXMsXG4gICAgICAvLyBXZSBleHRyYWN0IHRoZSBwaXhlbCB2YWx1ZSBvZiB0aGUgYnJlYWtwb2ludCAoZS5nLiBgJzEwMjRweCdgID0+IGAxMDI0YClcbiAgICAgIFtrZXldOiBwYXJzZUludChzY3JlZW5zW2tleV0ubWF0Y2goLyhcXGQrKXB4Lyk/LlsxXSA/PyAnMCcsIDEwKSxcbiAgICB9KSxcbiAgICB7XG4gICAgICAvLyBXZSBuZWVkIGEgYnJlYWtwb2ludCBzdGFydGluZyBhdCAwIHRvIHRhcmdldCBzY3JlZW5zIHNtYWxsZXIgdGhhbiBzbVxuICAgICAgJzAnOiAwLFxuICAgIH1cbiAgKSxcbn0pO1xuXG4vLyBNYWtlIHN0eWxlcyBmb3IgaW5qZWN0aW9uIGludG8gdGhlIGhlYWRlciBvZiB0aGUgcGFnZVxuZXhwb3J0IGNvbnN0IG1lZGlhU3R5bGVzID0gRXhhbXBsZUFwcE1lZGlhLmNyZWF0ZU1lZGlhU3R5bGUoKTtcblxuZXhwb3J0IGNvbnN0IHsgTWVkaWEsIE1lZGlhQ29udGV4dFByb3ZpZGVyIH0gPSBFeGFtcGxlQXBwTWVkaWE7XG4iXSwibmFtZXMiOlsiY3JlYXRlTWVkaWEiLCJzY3JlZW5zIiwiRXhhbXBsZUFwcE1lZGlhIiwiYnJlYWtwb2ludHMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwicmVzIiwia2V5IiwicGFyc2VJbnQiLCJtYXRjaCIsIm1lZGlhU3R5bGVzIiwiY3JlYXRlTWVkaWFTdHlsZSIsIk1lZGlhIiwiTWVkaWFDb250ZXh0UHJvdmlkZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/components/media-query/index.ts\n");

/***/ }),

/***/ "./src/lib/analytics/ga.ts":
/*!*********************************!*\
  !*** ./src/lib/analytics/ga.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GAEvent\": () => (/* binding */ GAEvent),\n/* harmony export */   \"GAPage\": () => (/* binding */ GAPage),\n/* harmony export */   \"GA_TRACKING_ID\": () => (/* binding */ GA_TRACKING_ID)\n/* harmony export */ });\nconst GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;\n// log the pageview with their URL\nconst GAPage = (url)=>{\n    if (window.gtag) {\n        window.gtag(\"config\", GA_TRACKING_ID, {\n            page_path: url\n        });\n    }\n};\n// log specific events happening.\nconst GAEvent = ({ action , params  })=>{\n    if (window.gtag) {\n        window.gtag(\"event\", action, params);\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL2FuYWx5dGljcy9nYS50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBTyxNQUFNQSxpQkFBaUJDLFFBQVFDLEdBQUcsQ0FBQ0MsMEJBQTBCLENBQUM7QUFFckUsa0NBQWtDO0FBQzNCLE1BQU1DLFNBQVMsQ0FBQ0MsTUFBc0I7SUFDM0MsSUFBSUMsT0FBT0MsSUFBSSxFQUFFO1FBQ2ZELE9BQU9DLElBQUksQ0FBQyxVQUFVUCxnQkFBZ0I7WUFDcENRLFdBQVdIO1FBQ2I7SUFDRixDQUFDO0FBQ0gsRUFBRTtBQUVGLGlDQUFpQztBQUMxQixNQUFNSSxVQUFVLENBQUMsRUFBRUMsT0FBTSxFQUFFQyxPQUFNLEVBQUUsR0FBVztJQUNuRCxJQUFJTCxPQUFPQyxJQUFJLEVBQUU7UUFDZkQsT0FBT0MsSUFBSSxDQUFDLFNBQVNHLFFBQVFDO0lBQy9CLENBQUM7QUFDSCxFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFuZ3JvdmUtYXRsYXMvLi9zcmMvbGliL2FuYWx5dGljcy9nYS50cz9mZjg5Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBHQV9UUkFDS0lOR19JRCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0dBX1RSQUNLSU5HX0lEO1xuXG4vLyBsb2cgdGhlIHBhZ2V2aWV3IHdpdGggdGhlaXIgVVJMXG5leHBvcnQgY29uc3QgR0FQYWdlID0gKHVybDogc3RyaW5nKTogdm9pZCA9PiB7XG4gIGlmICh3aW5kb3cuZ3RhZykge1xuICAgIHdpbmRvdy5ndGFnKCdjb25maWcnLCBHQV9UUkFDS0lOR19JRCwge1xuICAgICAgcGFnZV9wYXRoOiB1cmwsXG4gICAgfSk7XG4gIH1cbn07XG5cbi8vIGxvZyBzcGVjaWZpYyBldmVudHMgaGFwcGVuaW5nLlxuZXhwb3J0IGNvbnN0IEdBRXZlbnQgPSAoeyBhY3Rpb24sIHBhcmFtcyB9KTogdm9pZCA9PiB7XG4gIGlmICh3aW5kb3cuZ3RhZykge1xuICAgIHdpbmRvdy5ndGFnKCdldmVudCcsIGFjdGlvbiwgcGFyYW1zKTtcbiAgfVxufTtcbiJdLCJuYW1lcyI6WyJHQV9UUkFDS0lOR19JRCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19HQV9UUkFDS0lOR19JRCIsIkdBUGFnZSIsInVybCIsIndpbmRvdyIsImd0YWciLCJwYWdlX3BhdGgiLCJHQUV2ZW50IiwiYWN0aW9uIiwicGFyYW1zIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/lib/analytics/ga.ts\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"next/router\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var lib_analytics_ga__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lib/analytics/ga */ \"./src/lib/analytics/ga.ts\");\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\n/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! recoil */ \"recoil\");\n/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(recoil__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var components_media_query__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! components/media-query */ \"./src/components/media-query/index.ts\");\n/* harmony import */ var styles_globals_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var styles_globals_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(styles_globals_css__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var styles_mapbox_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! styles/mapbox.css */ \"./src/styles/mapbox.css\");\n/* harmony import */ var styles_mapbox_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(styles_mapbox_css__WEBPACK_IMPORTED_MODULE_8__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__]);\n_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n\n\n\n\nconst MyApp = ({ Component , pageProps  })=>{\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    // Never ever instantiate the client outside a component, hook or callback as it can leak data\n    // between users\n    const [queryClient] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(()=>new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__.QueryClient());\n    const handleRouteChangeCompleted = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((url)=>{\n        (0,lib_analytics_ga__WEBPACK_IMPORTED_MODULE_3__.GAPage)(url);\n    }, []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        router.events.on(\"routeChangeComplete\", handleRouteChangeCompleted);\n        return ()=>{\n            router.events.off(\"routeChangeComplete\", handleRouteChangeCompleted);\n        };\n    }, [\n        router.events,\n        handleRouteChangeCompleted\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(recoil__WEBPACK_IMPORTED_MODULE_5__.RecoilRoot, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__.QueryClientProvider, {\n            client: queryClient,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__.Hydrate, {\n                state: pageProps.dehydratedState,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(components_media_query__WEBPACK_IMPORTED_MODULE_6__.MediaContextProvider, {\n                    disableDynamicMediaQueries: true,\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                        ...pageProps\n                    }, void 0, false, {\n                        fileName: \"/Users/anamontiaga/Projects/mangrove-atlas/src/pages/_app.tsx\",\n                        lineNumber: 44,\n                        columnNumber: 13\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"/Users/anamontiaga/Projects/mangrove-atlas/src/pages/_app.tsx\",\n                    lineNumber: 43,\n                    columnNumber: 11\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/anamontiaga/Projects/mangrove-atlas/src/pages/_app.tsx\",\n                lineNumber: 42,\n                columnNumber: 9\n            }, undefined)\n        }, void 0, false, {\n            fileName: \"/Users/anamontiaga/Projects/mangrove-atlas/src/pages/_app.tsx\",\n            lineNumber: 41,\n            columnNumber: 7\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"/Users/anamontiaga/Projects/mangrove-atlas/src/pages/_app.tsx\",\n        lineNumber: 40,\n        columnNumber: 5\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBeUQ7QUFHakI7QUFFRTtBQUV3QztBQUM5QztBQUUwQjtBQUVsQztBQUNEO0FBTTNCLE1BQU1VLFFBQVEsQ0FBQyxFQUFFQyxVQUFTLEVBQUVDLFVBQVMsRUFBdUIsR0FBSztJQUMvRCxNQUFNQyxTQUFTVixzREFBU0E7SUFFeEIsOEZBQThGO0lBQzlGLGdCQUFnQjtJQUNoQixNQUFNLENBQUNXLFlBQVksR0FBR1osK0NBQVFBLENBQUMsSUFBTSxJQUFJRyw4REFBV0E7SUFFcEQsTUFBTVUsNkJBQTZCZixrREFBV0EsQ0FBQyxDQUFDZ0IsTUFBZ0I7UUFDOURaLHdEQUFNQSxDQUFDWTtJQUNULEdBQUcsRUFBRTtJQUVMZixnREFBU0EsQ0FBQyxJQUFNO1FBQ2RZLE9BQU9JLE1BQU0sQ0FBQ0MsRUFBRSxDQUFDLHVCQUF1Qkg7UUFFeEMsT0FBTyxJQUFNO1lBQ1hGLE9BQU9JLE1BQU0sQ0FBQ0UsR0FBRyxDQUFDLHVCQUF1Qko7UUFDM0M7SUFDRixHQUFHO1FBQUNGLE9BQU9JLE1BQU07UUFBRUY7S0FBMkI7SUFFOUMscUJBQ0UsOERBQUNQLDhDQUFVQTtrQkFDVCw0RUFBQ0Ysc0VBQW1CQTtZQUFDYyxRQUFRTjtzQkFDM0IsNEVBQUNQLDBEQUFPQTtnQkFBQ2MsT0FBT1QsVUFBVVUsZUFBZTswQkFDdkMsNEVBQUNiLHdFQUFvQkE7b0JBQUNjLDBCQUEwQjs4QkFDOUMsNEVBQUNaO3dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTXBDO0FBRUEsaUVBQWVGLEtBQUtBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYW5ncm92ZS1hdGxhcy8uL3NyYy9wYWdlcy9fYXBwLnRzeD9mOWQ2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnO1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xuXG5pbXBvcnQgeyBHQVBhZ2UgfSBmcm9tICdsaWIvYW5hbHl0aWNzL2dhJztcblxuaW1wb3J0IHsgUXVlcnlDbGllbnQsIFF1ZXJ5Q2xpZW50UHJvdmlkZXIsIEh5ZHJhdGUgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknO1xuaW1wb3J0IHsgUmVjb2lsUm9vdCB9IGZyb20gJ3JlY29pbCc7XG5cbmltcG9ydCB7IE1lZGlhQ29udGV4dFByb3ZpZGVyIH0gZnJvbSAnY29tcG9uZW50cy9tZWRpYS1xdWVyeSc7XG5cbmltcG9ydCAnc3R5bGVzL2dsb2JhbHMuY3NzJztcbmltcG9ydCAnc3R5bGVzL21hcGJveC5jc3MnO1xuXG50eXBlIFBhZ2VQcm9wcyA9IHtcbiAgZGVoeWRyYXRlZFN0YXRlOiB1bmtub3duO1xufTtcblxuY29uc3QgTXlBcHAgPSAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wczxQYWdlUHJvcHM+KSA9PiB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuXG4gIC8vIE5ldmVyIGV2ZXIgaW5zdGFudGlhdGUgdGhlIGNsaWVudCBvdXRzaWRlIGEgY29tcG9uZW50LCBob29rIG9yIGNhbGxiYWNrIGFzIGl0IGNhbiBsZWFrIGRhdGFcbiAgLy8gYmV0d2VlbiB1c2Vyc1xuICBjb25zdCBbcXVlcnlDbGllbnRdID0gdXNlU3RhdGUoKCkgPT4gbmV3IFF1ZXJ5Q2xpZW50KCkpO1xuXG4gIGNvbnN0IGhhbmRsZVJvdXRlQ2hhbmdlQ29tcGxldGVkID0gdXNlQ2FsbGJhY2soKHVybDogc3RyaW5nKSA9PiB7XG4gICAgR0FQYWdlKHVybCk7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJvdXRlci5ldmVudHMub24oJ3JvdXRlQ2hhbmdlQ29tcGxldGUnLCBoYW5kbGVSb3V0ZUNoYW5nZUNvbXBsZXRlZCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcm91dGVyLmV2ZW50cy5vZmYoJ3JvdXRlQ2hhbmdlQ29tcGxldGUnLCBoYW5kbGVSb3V0ZUNoYW5nZUNvbXBsZXRlZCk7XG4gICAgfTtcbiAgfSwgW3JvdXRlci5ldmVudHMsIGhhbmRsZVJvdXRlQ2hhbmdlQ29tcGxldGVkXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8UmVjb2lsUm9vdD5cbiAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAgICA8SHlkcmF0ZSBzdGF0ZT17cGFnZVByb3BzLmRlaHlkcmF0ZWRTdGF0ZX0+XG4gICAgICAgICAgPE1lZGlhQ29udGV4dFByb3ZpZGVyIGRpc2FibGVEeW5hbWljTWVkaWFRdWVyaWVzPlxuICAgICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgICAgIDwvTWVkaWFDb250ZXh0UHJvdmlkZXI+XG4gICAgICAgIDwvSHlkcmF0ZT5cbiAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cbiAgICA8L1JlY29pbFJvb3Q+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBNeUFwcDtcbiJdLCJuYW1lcyI6WyJ1c2VDYWxsYmFjayIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwidXNlUm91dGVyIiwiR0FQYWdlIiwiUXVlcnlDbGllbnQiLCJRdWVyeUNsaWVudFByb3ZpZGVyIiwiSHlkcmF0ZSIsIlJlY29pbFJvb3QiLCJNZWRpYUNvbnRleHRQcm92aWRlciIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwicm91dGVyIiwicXVlcnlDbGllbnQiLCJoYW5kbGVSb3V0ZUNoYW5nZUNvbXBsZXRlZCIsInVybCIsImV2ZW50cyIsIm9uIiwib2ZmIiwiY2xpZW50Iiwic3RhdGUiLCJkZWh5ZHJhdGVkU3RhdGUiLCJkaXNhYmxlRHluYW1pY01lZGlhUXVlcmllcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/styles/styles.config.js":
/*!*************************************!*\
  !*** ./src/styles/styles.config.js ***!
  \*************************************/
/***/ ((module) => {

"use strict";
eval("/**\n * This file contain Tailwind CSS variables that are shared between the JS bundle and the Tailwind\n * configuration file (tailwind.config.js). Only add here variables that you want to access from the\n * JS/TS files.\n *\n * Please follow the Tailwind syntax in this file.\n */ \nmodule.exports = {\n    screens: {\n        sm: \"640px\",\n        md: \"768px\",\n        lg: \"1024px\",\n        xl: \"1280px\",\n        \"2xl\": \"1536px\"\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3R5bGVzL3N0eWxlcy5jb25maWcuanMuanMiLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztDQU1DO0FBQ0RBLE9BQU9DLE9BQU8sR0FBRztJQUNmQyxTQUFTO1FBQ1BDLElBQUk7UUFDSkMsSUFBSTtRQUNKQyxJQUFJO1FBQ0pDLElBQUk7UUFDSixPQUFPO0lBQ1Q7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL21hbmdyb3ZlLWF0bGFzLy4vc3JjL3N0eWxlcy9zdHlsZXMuY29uZmlnLmpzP2JjNDYiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGlzIGZpbGUgY29udGFpbiBUYWlsd2luZCBDU1MgdmFyaWFibGVzIHRoYXQgYXJlIHNoYXJlZCBiZXR3ZWVuIHRoZSBKUyBidW5kbGUgYW5kIHRoZSBUYWlsd2luZFxuICogY29uZmlndXJhdGlvbiBmaWxlICh0YWlsd2luZC5jb25maWcuanMpLiBPbmx5IGFkZCBoZXJlIHZhcmlhYmxlcyB0aGF0IHlvdSB3YW50IHRvIGFjY2VzcyBmcm9tIHRoZVxuICogSlMvVFMgZmlsZXMuXG4gKlxuICogUGxlYXNlIGZvbGxvdyB0aGUgVGFpbHdpbmQgc3ludGF4IGluIHRoaXMgZmlsZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNjcmVlbnM6IHtcbiAgICBzbTogJzY0MHB4JyxcbiAgICBtZDogJzc2OHB4JyxcbiAgICBsZzogJzEwMjRweCcsXG4gICAgeGw6ICcxMjgwcHgnLFxuICAgICcyeGwnOiAnMTUzNnB4JyxcbiAgfSxcbn07XG4iXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsInNjcmVlbnMiLCJzbSIsIm1kIiwibGciLCJ4bCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/styles/styles.config.js\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/mapbox.css":
/*!*******************************!*\
  !*** ./src/styles/mapbox.css ***!
  \*******************************/
/***/ (() => {



/***/ }),

/***/ "@artsy/fresnel":
/*!*********************************!*\
  !*** external "@artsy/fresnel" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@artsy/fresnel");

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/router");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "recoil":
/*!*************************!*\
  !*** external "recoil" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("recoil");

/***/ }),

/***/ "@tanstack/react-query":
/*!****************************************!*\
  !*** external "@tanstack/react-query" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@tanstack/react-query");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();