Our combined changelog and roadmap. It contains todos as well as dones.

Items can be optionally be tagged tagged by GitHub owner issue if discussion
happened / is needed.

Please add your entries in this format:

 - `- [ ] (<plugin name>|website|core|meta|build|test): <Present tense verb> <subject> \(<list of associated owners/gh-issues>\)`.

Following [SemVer spec item 4](http://semver.org/#spec-item-4),
we're `<1.0.0` and allowing ourselves to make breaking changes in minor
and patch levels.

In the current stage we aim to release a new version on the
last Friday of every new month.

## Backlog

Ideas that will be planned and find their way into a release at one point

- [ ] core: Decouple rendering from Plugin ?
- [ ] core: Make sure Uppy works well in VR
- [ ] test: Human should check http://www.webpagetest.org and https://developers.google.com/web/tools/lighthouse/, use it sometimes to test website and Uppy. Will show response/loading times and other issues
- [ ] test: Human should test with real screen reader to identify accessibility problems
- [ ] test: setup an HTML page with all sorts of crazy styles, resets & bootstrap to see what brakes Uppy (@arturi)
- [ ] dependencies: es6-promise --> lie https://github.com/calvinmetcalf/lie ?
- [ ] core: accessibility research: https://chrome.google.com/webstore/detail/accessibility-developer-t/fpkknkljclfencbdbgkenhalefipecmb, http://khan.github.io/tota11y/
- [ ] core: consider adding presets, see https://github.com/cssinjs/jss-preset-default/blob/master/src/index.js (@arturi)
- [ ] uppy/uppy-server: Transfer files between providers (from instagram to Google drive for example).
- [ ] uploaders: consider not showing progress updates from the server after an upload’s been paused (@arturi, @ifedapoolarewaju)
- [ ] maybe restrict system file picking dialog too https://github.com/transloadit/uppy/issues/253
- [ ] uppy-server: what happens if access token expires amid an upload/download process.
- [ ] good way to change plugin options at runtime—maybe `this.state.options`?
- [ ] s3: multipart/"resumable" uploads for large files (@goto-bus-stop)
- [ ] DnD Bar: drag and drop + statusbar or progressbar ? (@arturi)
- [ ] possibility to work on already uploaded / in progress files #112, #113
- [ ] possibility to edit/delete more than one file at once #118, #97
- [ ] optimize problematic filenames #72
- [ ] an uploader plugin to receive files in a callback instead of uploading them
- [ ] statusbar: add option to always show
- [ ] have a `resetProgress` method for resetting a single file, and call it before starting an upload. see comment in #393
- [ ] “Custom Provider” plugin for  Dashboard — shows already uploaded files or files from a custom service; accepts an array of files to show in options, no uppy-server required #362
- [ ] WordPress plugin
- [ ] Transformations, cropping, filters for images, see #53
- [ ] Prepare for (piwik-) tracking of usage of uppy ? see #83
- [ ] screenshot+screencast support similar to Webcam #148
- [ ] Webcam modes #198
- [ ] feature: improved UI for Provider, Google Drive and Instagram, grid/list views
- [ ] feature: React Native support
- [ ] consider iframe / more security for Transloadit/Uppy integration widget and Uppy itself. Page can’t get files from Google Drive if its an iframe; possibility for folder restriction for provider plugins
- [ ] test: add https://github.com/pa11y/pa11y for automated accessibility testing?
- [ ] test: add tests for `npm pack`
- [ ] test: add deepFreeze to test that state in not mutated anywhere by accident #320
- [ ] audio: audio recording similar to Webcam #143
- [ ] add  typescript definitions and JSDoc everywhere? https://github.com/Microsoft/TypeScript/wiki/Type-Checking-JavaScript-Files

## 1.0 Goals

What we need to do to release Uppy 1.0

- [ ] QA: test how everything works together: user experience from `npm install` to production build with Webpack, using in React/Redux environment (npm pack)
- [ ] QA: test in multiple browsers and mobile devices
- [ ] QA: test uppy server. benchmarks / stress test. multiple connections, different setups, large files (10 GB)
- [ ] QA: tests for some plugins
- [ ] automatically host releases on edgly and use that as our main CDN
- [ ] docs: on using plugins, all options, list of plugins, i18n
- [ ] feature: preset for Transloadit that mimics jQuery SDK, check https://github.com/transloadit/jquery-sdk docs
- [ ] refactoring: possibly add CSS-in-JS
- [x] refactoring: possibly switch from Yo-Yo to Preact, because it’s more stable, solves a few issues we are struggling with (onload being weird/hard/modern-browsers-only with bel; no way to pass refs to elements; extra network requests with base64 urls) and mature, “new standard”, larger community
- [ ] refactoring: split uppy into small packages, lerna repo?
- [x] QA: tests for core and utils
- [x] feature: Redux and ReduxDevTools support (currently mirrors Uppy state to Redux)
- [x] feature: beta file recovering after closed tab / browser crash
- [x] feature: easy integration with React (UppyReact components)
- [x] feature: finish the direct-to-s3 upload plugin and test it with the flow to then upload to :transloadit: afterwards. This is because this might influence the inner flow of the plugin architecture quite a bit
- [x] feature: restrictions: by size, number of files, file type
- [x] refactoring: webcam plugin
- [x] uppy-server: add uppy-server to main API service to scale it horizontally. for the standalone server, we could write the script to support multiple clusters. Not sure how required or neccessary this may be for Transloadit's API service.
- [x] uppy-server: better error handling, general cleanup (remove unused code. etc)
- [x] uppy-server: security audit
- [x] uppy-server: storing tokens in user’s browser only (d040281cc9a63060e2f2685c16de0091aee5c7b4)

# next

## 0.23.0

To be released: 2018-01-26.

- [ ] transloadit: add assembly result to the file state (or global state, since it might not be file-specific?), so that it can be used in `success` callback (transloadit jquery-sdk includes the whole Assembly Status JSON in a hidden field, form plugin will do a similar thing) (@goto-bus-stop)
- [ ] dashboard: add image cropping, study https://github.com/MattKetmo/darkroomjs/, https://github.com/fengyuanchen/cropperjs #151
- [ ] goldenretriever: confirmation before restore #443
- [ ] core: i18n all strings + document them
- [ ] core: figure out per-plugin locales and i18n strings packs #491
- [ ] core: fix blank preview thumbnails for .png images in Safari 10.1 #458
- [ ] progressbar: option to clear/reset once the upload has finished (@arturi)
- [ ] s3: rename `AWS S3` to something more general if it works with Google Cloud Storage too? See #460
- [ ] dashboard: try adding optional whitelabel “powered by uppy.io” (@arturi, @nqst)
- [ ] dashboard: option for Boolean metadata #454 (@arturi)
- [ ] dashboard: use more accessible tip lib: https://github.com/ghosh/microtip
- [ ] transloadit: add error reporting
- [ ] importurl: new plugin that imports files from urls (@arturi, @ifedapoolarewaju)
- [ ] core: queue preview generation #431
- [ ] core: return `processing` results among with `upload` results in `success` event and `upload()` promise
- [ ] core: css-in-js, while keeping non-random classnames (ideally prefixed) and useful preprocessor features. also see simple https://github.com/codemirror/CodeMirror/blob/master/lib/codemirror.css (@arturi, @goto-bus-stop)
- [ ] look into text-based file type icons to save space, or more icons for file types? (@arturi)
- [ ] core: all: reset or !important styles to be immune to any environment/page, look at screenshots in #446. Maybe `postcss-safe-important`, http://cleanslatecss.com/ Or increase specificity (with .uppy prefix) (@arturi)
- [ ] dashboard: allow minimizing the Dashboard during upload (Uppy then becomes just a tiny progress indicator) (@arturi)
- [ ] dashboard: cancel button for any kind of uploads? currently resume/pause only for tus, and cancel for XHR (@arturi, @goto-bus-stop)
- [ ] docs: quick start guide: https://community.transloadit.com/t/quick-start-guide-would-be-really-helpful/14605 (@arturi)
- [ ] docs: on writing plugins (@goto-bus-stop)
- [x] docs: fix reference to incorrect width/height options (#475 / @xhocquet)
- [ ] goldenretriever: add “ghost” files (@arturi)
- [ ] webcam: URL.createObjectURL(MediaStream) is deprecated and will be removed soon: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
- [ ] xhrupload: add bundle option to send multiple files in one request (#442 / @goto-bus-stop)
- [ ] uppy-server: security audit, ask @acconut
- [ ] uppy-server: benchmarks / stress test, large file, uppy-server / tus / S3 (10 GB)

## 0.22.0

Released: 2017-12-21.
Theme: 🎄 Christmas edition

- **⚠️ Breaking** core: rendering engine switched from `Yo-Yo` to `Preact`, and all views from `html` hyperx template strings to `JSX` (#451 / @arturi)
- **⚠️ Breaking** core: large refactor of Core and Plugins: `setFileState`, merge `MetaData` plugin into `Dashboard`, prefix "private" core methods with underscores (@arturi / #438)
- **⚠️ Breaking** core: renamed `core` to `uppy` in plugins and what not. So instead of `this.core.state` we now use `this.uppy.state` (#438 / @arturi)
- **⚠️ Breaking** core: renamed events to remove `core:` prefix, as been suggested already. So: `success`, `error`, `upload-started` and so on, and prefixed event names for plugins sometimes, like `dashboard:file-card` (#438 / @arturi)
- **⚠️ Breaking** core: CSS class names have been altered to use `uppy-` namespace, so `.UppyDashboard-files` --> `.uppy-Dashboard-files` and so on
- **⚠️ Breaking** dashboard: added `metaFields` option, pass an array of settings for UI field objects `{ id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }` (#438 / @arturi, @goto-bus-stop)
- **⚠️ Breaking** core: deprecate `getMetaFromForm` in favor of new `Form` plugin (#407 / @arturi)
- form: added `Form`, a new plugin that is used in conjunction with any acquirer, responsible for: 1. acquiring the metadata from `<form>` when upload starts in Uppy; 2. injecting result array of succesful and failed files back into the form (#407 / @arturi)
- core: add more extensions for mimetype detection (#452 / @ifedapoolarewaju)
- docs: more docs for plugins (#456 / @goto-bus-stop)
- core: misc bugs fixes and improvements in Webcam, Dashboard, Provider and others (#451 / @arturi)
- dashboard: improved Dashboard UI (@arturi)
- uppy-server: remove pause/resume socket listeners when upload is done (@ifedapoolarewaju)
- uppy/uppy-server: remote server error handler (#446 / @ifedapoolarewaju)
- provider: fix dropbox thumbnail view (@ifedapoolarewaju)
- uppy-server: link uppy-server with https://snyk.io/ to aid vulnerability spotting (@ifedapoolarewaju)
- uppy-server: use typescript to compile code for a type safe servers (@ifedapoolarewaju)

## 0.21.1

Released: 2017-12-10.

- **⚠️ Breaking** core: Set `this.el` in `Plugin` class (#425 / @arturi)
- StatusBar, Dashboard and Provider UI improvements place upload button into StatusBar, use Alex’s suggestions for retry button; other UI tweaks (#434 / @arturi)
- XHRUpload: fix fields in XHR remote uploader (#424 / @sadovnychyi)
- XHRUpload: option to limit simultaneous uploads #360 (#427 / goto-bus-stop)
- core: Add `isSupported()` API for providers (#421 / @goto-bus-stop, @arturi)
- core: Add stores. Improve on Redux PR #216 to allow using Redux (or any other solution) for all Uppy state management, instead of proxy-only (#426 / @goto-bus-stop)
- core: add ability to disable thumbnail generation (#432 / @richardwillars)
- core: allow to select multiple files at once from remote providers (#419 / @sadovnychyi)
- core: use `setPluginState` and `getPluginState` in Providers (#436 / @arturi)
- docs: uppy-server docs for s3 `getKey` option (#444 / @goto-bus-stop)
- goldenretriever: Fix IndexedDB store initialisation when not cleaning up (#430 / @goto-bus-stop)
- provider: folder deselection did not remove all files (#439 / @ifedapoolarewaju)
- s3: Use Translator for localised strings (420 / @goto-bus-stop )
- transloadit: Port old tests from tape (#428 / @goto-bus-stop)
- tus: Restore correctly from paused state (#443 / @goto-bus-stop)

## 0.21.0

Released: 2017-11-14.

- [x] accessibility: add tabindex="0" to buttons and tabs, aria-labels, focus (#414 / @arturi)
- [x] core: allow setting custom `id` for plugins to allow a plugin to be used multiple times (#418 / @arturi)
- [x] core: do not check isPreviewSupported for unknown filetypes (#417 / @sadovnychyi)
- [x] core: refactor `uppy-base` (#382 / @goto-bus-stop)
- [x] core: remove functions from state object (#408 / @goto-bus-stop)
- [x] core: return `{ successful, failed }` from `uppy.upload()` (#404 / @goto-bus-stop)
- [x] core: update state with error messages rather than error objects (#406 / @richardwillars)
- [x] core: use `tinyify` for the unpkg bundle. (#371 / @goto-bus-stop)
- [x] dashboard: Fix pasting files, default `image` file name, add type to meta, file type refactor (#395 / @arturi)
- [x] dragdrop: Fix of the .uppy-DragDrop-inner spacing on small screens (#405 / @nqst)
- [x] react: fix `uppy` PropType, closes (#416 / @goto-bus-stop)
- [x] s3: automatically wrap XHRUpload. **Users should remove `.use(XHRUpload)` when using S3.** (#408 / @goto-bus-stop)
- [x] test: refactored end-to-end tests to not use website, switched to Webdriver.io, added tests for Edge, Safari, Android and iOS (#410 / @arturi)
- [x] tus: Rename Tus10 → Tus (#285 / @goto-bus-stop)
- [x] uppy-serer: mask sensitive data from request logs (@ifedapoolarewaju)
- [x] uppy-server: add request body validators (@ifedapoolarewaju)
- [x] uppy-server: migrate dropbox to use v2 API (#386 / @ifedapoolarewaju)
- [x] uppy-server: store tokens in user’s browser only (@ifedapoolarewaju)
- [x] webcam: only show the webcam tab when browser support is available (media recorder API) (#421 / @arturi, @goto-bus-stop)
- [x] webcam: simplify and refactor webcam plugin (modern browser APIs only) (#382 / @goto-bus-stop)
- [x] xhrupload: set a timeout in the onprogress event handler to detect stale network (#378 / @goto-bus-stop)
- [x] uppy-server: allow flexible whitelist endpoint protocols (@ifedapoolarewaju)

## 0.20.3

Released: 2017-10-18.

- [x] Start a completely new upload when retrying. (#390 / @goto-bus-stop)
- [x] dashboard: Show errors that occurred during processing on the file items. (#391 / @goto-bus-stop)
- [x] transloadit: Mark files as having errored if their assembly fails. (#392 / @goto-bus-stop)
- [x] core: Clear file upload progress when an upload starts. (#393 / @goto-bus-stop)
- [x] tus: Clean up `tus.Upload` instance and events when an upload starts, finishes, or fails. (#390 / @goto-bus-stop)

## 0.20.2

Released: 2017-10-11.

- [x] docs: fix `getMetaFromForm` documentation (@arturi)
- [x] core: fix generating thumbnails for images with transparent background (#380 / @goto-bus-stop)
- [x] transloadit: use Translator class for localised strings (#383 / @goto-bus-stop)
- [x] goldenretriever: don't crash when required server-side (#384 / @goto-bus-stop)

## 0.20.1

Released: 2017-10-05.

- [x] redux: add plugin for syncing uppy state with a Redux store (#376 / @richardwillars)

## 0.20.0

Released: 2017-10-03.
Theme: React and Retry

- [x] core: retry/error when upload can’t start or fails (offline, connection lost, wrong endpoint); add error in file progress state, UI, question mark button (#307 / @arturi)
- [x] core: support for retry in Tus plugin (#307 / @arturi)
- [x] core: support for retry in XHRUpload plugin (#307 / @arturi)
- [x] core: Add support for Redux DevTools via a plugin (#373 / @arturi)
- [x] core: improve and merge the React PR (#170 / @goto-bus-stop, @arturi)
- [x] core: improve core.log method, add timestamps (#372 / @arturi)
- [x] dragdrop: redesign, add note, width/height options, arrow icon (#374 / @arturi)
- [x] uploaders: upload resolution changes, followup to #323 (#347 / @goto-bus-stop)
- [x] uploaders: issue warning when no uploading plugins are used (#372 / @arturi)
- [x] core: fix `replaceTargetContent` and add tests for `Plugin` (#354 / @gavboulton)
- [x] goldenretriever: Omit completed uploads from saved file state—previously, when an upload was finished and the user refreshed the page, all the finished files would still be there because we saved the entire list of files. Changed this to only store files that are part of an in-progress upload, or that have yet to be uploaded (#358, #324 / @goto-bus-stop)
- [x] goldenretriever: Remove files from cache when upload finished—this uses the deleteBlobs function when core:success fires (#358, #324 / @goto-bus-stop)
- [x] goldenretriever: add a timestamp to cached blobs, and to delete old blobs on boot (#358, #324 / @goto-bus-stop)
- [x] s3: have some way to configure content-disposition for uploads, see #243 (@goto-bus-stop)
- [x] core: move `setPluginState` and add `getPluginState` to `Plugin` class (#363 / @goto-bus-stop)

## 0.19.1

Released: 2017-09-20.

- [x] goldenretriever: fix restorefiles with id (#351 / @arturi)
- [x] goldenretriever: Clean up blobs that are not related to a file in state (#349 / @goto-bus-stop)
- [x] core: set the newState before emiting `core:state-update` (#341 / @sunil-shrestha, @arturi)
- [x] docs: Document StatusBar plugin (#350 / @goto-bus-stop)

## 0.19.0

Released: 2017-09-15.
Theme: Tests and better APIs

- [x] goldenretriever: allow passing options to `IndexedDbStore` (#339 / sunil-shrestha)
- [x] core: add Uppy instance ID option, namespace serviceWorker action types, add example using multiple Uppy instances with Goldenretriever (#333 / @goto-bus-stop)
- [x] core: fix `calculateTotalProgress` - NaN (#342 / @arturi)
- [x] core: fix and refactor restrictions (#345 / @arturi)
- [x] core: Better `generateFileID` (#330 / @arturi)
- [x] core: improve `isOnline()` (#319 / @richardwillars)
- [x] core: remove unused bootstrap styles (#329 / @arturi)
- [x] core: experiment with yo-yo --> preact and picodom (#297 / @arturi)
- [x] dashboard: fix FileItem source icon position and copy (@arturi)
- [x] dashboard: expose and document the show/hide/isOpen API (@arturi)
- [x] dashboard: allow multiple `triggers` of the same class `.open-uppy` (#328 / @arturi)
- [x] plugins: add `aria-hidden` to all SVG icons for accessibility (#4e808ca3d26f06499c58bb77abbf1c3c2b510b4d / @arturi)
- [x] core: Handle sync returns and throws in possibly-async function options (#315 / @goto-bus-stop)
- [x] core: switch to Jest tests, add more tests for Core and Utils (#310 / @richardwillars)
- [x] website: Minify bundle for `disc` (#332 / @goto-bus-stop)
- [x] transloadit: remove `this.state` getter (#331 / @goto-bus-stop)
- [x] server: option to define valid upload urls (@ifedapoolarewaju)
- [x] server: more automated tests (@ifedapoolarewaju)

## 0.18.1

Released: 2017-09-05.
Note: this version was released as a `@next` npm tag to unblock some users.

- [x] core: gradually resize image previews #275 (@goto-bus-stop)
- [x] informer: support “explanations”, a (?) button that shows more info on hover / click (#292 / @arturi)
- [x] fix webcam video recording (@goto-bus-stop)
- [x] bundle: add missing plugins (s3, statusbar, restoreFiles) to unpkg bundle (#301 / @goto-bus-stop)
- [x] xhrupload: Use error messages from the endpoint (#305 / @goto-bus-stop)
- [x] dashboard: prevent submitting outer form when pressing enter key while editing metadata (#306 / @goto-bus-stop)
- [x] dashboard: save metadata edits when pressing enter key (#308 / @arturi)
- [x] transloadit: upload to S3, then import into :tl: assembly using `/add_file?s3url=${url}` (#280 / @goto-bus-stop)
- [x] transloadit: add `alwaysRunAssembly` option to run assemblies when no files are uploaded (#290 / @goto-bus-stop)
- [x] core: use `iteratePlugins` inside `updateAll` (#312 / @richardwillars)
- [x] core: improve error when plugin does not have ID (#309 / @richardwillars)
- [x] tus: Clear stored `uploadUrl` on `uppy.resetProgress()` call (#314 / @goto-bus-stop)
- [x] website: simplify examples and code samples, prevent sidebar subheading links anywhere but in docs (@arturi)
- [x] website: group plugin docs together in the sidebar (@arturi)

## 0.18.0

Released: 2017-08-15.
Theme: Dogumentation and The Golden retriever.

- [x] goldenretriever: use Service Woker first, then IndexedDB, add file limits for IndexedDB, figure out what restores from where, add throttling for localStorage state sync (@goto-bus-stop @arturi)
- [x] dashboard: flag to hide the upload button, for cases when you want to manually stat the upload (@arturi)
- [x] dashboard: place close btn inside the Dashboard, don’t close on click outside, place source icon near the file size (@arturi)
- [x] core: informer becomes a core API, `uppy.info('Smile! 📸', 'warning', 5000)` so its more concise with `uppy.log('my msg')` and supports different UI implementations (@arturi, #271)
- [x] docs: first stage — on using plugins, all options, list of plugins, i18n, uppy-server (@arturi, @goto-bus-stop, @ifedapoolarewaju)
- [x] provider: file size sorting (@ifedapoolarewaju)
- [x] provider: show loading screen when checking auth too (@arturi)
- [x] uploaders: add direct-to-s3 upload plugin (@goto-bus-stop)
- [x] core: ability to re-upload all files, even `uploadComplete` ones, reset progress (@arturi)
- [x] goldenretriever: recover selected or in progress files after a browser crash or closed tab: alpha-version, add LocalStorage, Service Worker and IndexedDB (@arturi @goto-bus-stop @nqst #268)
- [x] xhrupload: add XHRUpload a more flexible successor to Multipart, so that S3 plugin can depend on it (@goto-bus-stop #242)
- [x] core: add getFile method (@goto-bus-stop, #263)
- [x] provider: use informer to display errors (@ifedapoolarewaju)
- [x] provider: flatten instagram carousels #234 (@ifedapoolarewaju)
- [x] server: add uppy-server url as `i-am` header (@ifedapoolarewaju)
- [x] server: disable socket channel from restarting an already completed file download (@ifedapoolarewaju)
- [x] server: make uppy client whitelisting optional. You may use wildcard instead (@ifedapoolarewaju)
- [x] server: master oauth redirect uri for multiple uppy-server instances
- [x] server: options support for redis session storage on standalone server (@ifedapoolarewaju)
- [x] server: start uppy-server as binary `uppy-server` (@ifedapoolarewaju)
- [x] server: store downloaded files based on uuids (@ifedapoolarewaju)
- [x] server: store upload state on redis (@ifedapoolarewaju)
- [x] server: use uppy informer for server errors (@ifedapoolarewaju, #272)
- [x] server: whitelist multiple uppy clients (@ifedapoolarewaju)
- [x] transloadit: emit an event when an assembly is created (@goto-bus-stop / #244)
- [x] transloadit: function option for file-dependent `params` (@goto-bus-stop / #250)
- [x] tus: Save upload URL early on (@goto-bus-stop #261)
- [x] tus: return immediately if no files are selected (@goto-bus-stop #245)
- [x] uppy-server: add uppy-server metrics to Librato (@ifedapoolarewaju @kiloreux)
- [x] webcam: add 1, 2, 3, smile! to webcam, onBeforeSnapshothook (@arturi, #187, #248)
- [x] website: live example on the homepage, “try me” button, improve /examples (@arturi)

## 0.17.0

Released: 2017-07-02

- [x] core: restrictions — by file type, size, number of files (@arturi)
- [x] provider: improve UI: improve overall look, breadcrumbs, more responsive (@arturi)
- [x] core: css-in-js demos, try template-css (@arturi @goto-bus-stop #239)
- [x] core: add `uppy.reset()` as discussed in #179 (@arturi)
- [x] core: add nanoraf https://github.com/yoshuawuyts/choo/pull/135/files?diff=unified (@goto-bus-stop, @arturi)
- [x] core: file type detection: archives, markdown (possible modules: file-type, identify-filetype) example: http://requirebin.com/?gist=f9bea9602030f1320a227cf7f140c45f, http://stackoverflow.com/a/29672957 (@arturi)
- [x] dashboard: make file icons prettier: https://uppy.io/images/blog/0.16/service-logos.png (@arturi, @nqst / #215)
- [x] fileinput: allow retriving fields/options from form (@arturi #153)
- [x] server: configurable server port (@ifedapoolarewaju)
- [x] server: support for custom providers (@ifedapoolarewaju)
- [x] statusbar: also show major errors, add “error” state (@goto-bus-stop)
- [x] statusbar: pre/postprocessing status updates in the StatusBar (@goto-bus-stop, #202)
- [x] statusbar: show status “Upload started...” when the remote upload has begun, but no progress events received yet (@arturi)
- [x] statusbar: work towards extracting StatusBar to a separate plugin, bundle that with Dashboard? (@goto-bus-stop, @arturi)
- [x] tus/uppy-server: Support metadata in remote tus uploads (@ifedapoolarewaju, @goto-bus-stop / #210)
- [x] uploaders: add direct-to-s3 upload plugin and test it with the flow to then upload to transloadit, stage 1, WIP (@goto-bus-stop)
- [x] uppy/uppy-server: Make a barely working Instagram Plugin (@ifedapoolarewaju / #21)
- [x] uppy/uppy-server: Make a barely working Instagram Plugin (@ifedapoolarewaju / #21)
- [x] uppy/uppy-server: allow google drive/dropbox non-tus (i.e multipart) remote uploads (@arturi, @ifedapoolarewaju / #205)
- [x] uppy/uppy-server: some file types cannot be downloaded/uploaded on google drive (e.g google docs). How to handle that? (@ifedapoolarewaju)
- [x] uppy: fix google drive uploads on mobile (double click issue) (@arturi)

## 0.16.2

Released: 2017-05-31.

- [x] core: update prettier-bytes to fix the IE support issue https://github.com/Flet/prettier-bytes/issues/3 (@arturi)
- [x] core: use URL.createObjectURL instead of resizing thumbnails (@arturi, @goto-bus-stop / #199)
- [x] dashboard: Fix ETA when multiple files are being uploaded (@goto-bus-stop, #197)
- [x] transloadit: Fix receiving assembly results that are not related to an input file (@arturi, @goto-bus-stop / #201)
- [x] transloadit: Use the `tus_upload_url` to reliably link assembly results with their input files (@goto-bus-stop / #207)
- [x] transloadit: move user-facing strings into locale option (@goto-bus-stop / https://github.com/transloadit/uppy/commit/87a22e7ee37b6fa3754fa34868516a6700306b60)
- [x] webcam: Mute audio in realtime playback (@goto-bus-stop / #196)

## 0.16.1

Released: 2017-05-13

- [x] temporarily downgrade yo-yoify, until shama/yo-yoify#45 is resolved (@arturi / https://github.com/transloadit/uppy/commit/6292b96)

## 0.16.0

Released: 2017-05-12.
Theme: Transloadit integration, getting things in order.
Favorite Uppy Server version: 0.5.0.

- [x] uploaders: make sure uploads retry/resume if started when offline or disconnected, retry when back online / failed https://github.com/transloadit/uppy/pull/135 (@arturi, @ifedapoolarewaju)
- [x] transloadit: add basic (beta) version of Transloadit plugin (@goto-bus-stop, @kvz, @tim-kos / #28)
- [x] transloadit: emit an upload event w/ tl data when a file upload is complete (#191 @goto-bus-stop)
- [x] webcam: implement reading audio+video from Webcam (@goto-bus-stop / #175)
- [x] webcam: Make the webcam video fill the available space as much as possible (@goto-bus-stop / #190)
- [x] tus: Merge tus-js-client options with uppy-tus. Hence, enable custom headers support (@goto-bus-stop)
- [x] multipart/tus: Remove Promise.all() calls with unused results (@goto-bus-stop / #121)
- [x] dashboard: fix Dashboard modal close button position (@goto-bus-stop / #171)
- [x] core: pass through errors (@goto-bus-stop / #185)
- [x] core: accept a DOM element in `target:` option (@goto-bus-stop / #169)
- [x] core: Remove the last few potentially buggy uses of `document.querySelector` (@goto-bus-stop)
- [x] dashboard: Fix dashboard width when multiple instances exist (@goto-bus-stop / #184)
- [x] dashboard: add service logo / name to the selected file in file list (@arturi)
- [x] server: begin adding automated tests, maybe try https://facebook.github.io/jest (@ifedapoolarewaju)
- [x] server: add image preview / thumbnail for remote files, if its in the API of services ? (@ifedapoolarewaju)
- [x] server: research parallelizing downloading/uploading remote files: start uploading chunks right away, while still storing the file on disk (@ifedapoolarewaju)
- [x] server: delete file from local disk after upload is successful (@ifedapoolarewaju)
- [x] website: try on a Github ribbon http://tholman.com/github-corners/ (@arturi / #150)
- [x] website: different meta description for pages and post (@arturi)
- [x] server: well documented README (@ifedapoolarewaju)
- [x] react: [WIP] High-level React Components (@goto-bus-stop / #170)
- [x] core: add `uppy.close()` for tearing down an Uppy instance (@goto-bus-stop / #182)
- [x] core: replace `babel-preset-es2015-loose` by standard es2015 preset with `loose` option (@goto-bus-stop / #174)

## 0.15.0

Released: 2017-03-02.
Theme: Speeding and cleaning.
Favorite Uppy Server version: 0.4.0.

- [x] build: update dependencies and eslint-plugin-standard, nodemon --> onchange, because simpler and better options (@arturi)
- [x] build: fix `Function.caller` issue in `lib` which gets published to NPM package, add babel-plugin-yo-yoify (@arturi #158 #163)
- [x] provider: show error view for things like not being able to connect to uppy server should this be happening when uppy-server is unavailable http://i.imgur.com/cYJakc9.png (@arturi, @ifedapoolarewaju)
- [x] provider: loading indicator while the GoogleDrive / Dropbox files are loading (@arturi, @ifedapoolarewaju)
- [x] provider: logout link/button? (@arturi, @ifedapoolarewaju)
- [x] provider: fix breadcrumbs (@ifedapoolarewaju)
- [x] server: refactor local/remote uploads in tus, allow for pause/resume with remote upload (@arturi, @ifedapoolarewaju)
- [x] server: throttle progress updates sent through websockets, sometimes it can get overwhelming when uploads are fast (@ifedapoolarewaju)
- [x] server: pass file size from Google Drive / Dropbox ? (@ifedapoolarewaju)
- [x] server: return uploaded file urls (from Google Drive / Dropbox) ? (@ifedapoolarewaju)
- [x] server: research having less permissions, smaller auth expiration time for security (@ifedapoolarewaju)
- [x] dashboard: basic React component (@arturi)
- [x] core: experiment with `nanoraf` and `requestAnimationFrame` (@arturi)
- [x] core: add throttling of progress updates (@arturi)
- [x] dashobard: fix Missing `file.progress.bytesTotal` property  (@arturi #152)
- [x] dashboard: switch to prettier-bytes for more user-friendly progress updates (@arturi)
- [x] dashboard: fix `updateDashboardElWidth()` not firing in time, causing container width to be 0 (@arturi)
- [x] multipart: treat all 2xx responses as successful, return xhr object in `core:upload-success` (@arturi #156 #154)
- [x] dashboard: throttle StatusBar numbers, so they update only once a second (@arturi, @acconut)
- [x] dashboard: add titles to pause/resume/cancel in StatusBar (@arturi)
- [x] dashboard: precise `circleLength` and `stroke-dasharray/stroke-dashoffset` calculation for progress circles on FileItem (@arturi)
- [x] dashboard: don’t show per-file detailed progress by default — too much noise (@arturi)
- [x] website: blog post and images cleanup (@arturi)

## 0.14.0

Released: January 27, 2017.
Theme: The new 13: Responsive Dashboard, Standalone & Pluggable Server, Dropbox.
Uppy Server version: 0.3.0.

- [x] dashboard: use `isWide` prop/class instead of media queries, so that compact/mobile version can be used in bigger screens too (@arturi)
- [x] dashboard: basic “list” view in addition to current “grid” view (@arturi)
- [x] dashboard: more icons for file types (@arturi)
- [x] dashboard: add totalSize and totalUploadedSize to StatusBar (@arturi)
- [x] dashboard: figure out where to place Informer, accounting for StatusBar — over the StatusBar for now (@arturi)
- [x] dashboard: add `<progress>` element for progressbar, like here https://overcast.fm/+BtuxMygVg/. Added hidden for now, for semantics/accessibility (@arturi)
- [x] dragdrop: show number of selected files, remove upload btn (@arturi)
- [x] build: exclude locales from build (@arturi)
- [x] core: i18n for each plugin in options — local instead of global (@arturi)
- [x] core: add default pluralization (can be overrinden in plugin options) to Translator (@arturi)
- [x] core: use yo-yoify to solve [Function.caller / strict mode issue](https://github.com/shama/bel#note) and make our app faster/smaller by transforming template strings into pure and fast document calls (@arturi)
- [x] server: a pluggable uppy-server (express / koa for now) (@ifedapoolarewaju)
- [x] server: standalone uppy-server (@ifedapoolarewaju)
- [x] server: Integrate dropbox plugin (@ifedapoolarewaju)
- [x] server: smooth authentication: after auth you are back in your app where you left, no page reloads (@ifedapoolarewaju)
- [x] tus: fix upload progress from uppy-server (@arturi, @ifedapoolarewaju)
- [x] core: basic React component — DnD (@arturi)
- [x] core: fix support for both ES6 module import and CommonJS requires with `add-module-exports` babel plugin (@arturi)

## 0.13.0

To be released: December 23, 2016.
Theme: The release that wasn't 🎄.

## 0.12.0

Released: November 25, 2016.
Theme: Responsive. Cancel. Feedback. ES6 Server.
Uppy Server version: 0.2.0.

- [x] meta: write 0.12 release blog post (@arturi)
- [x] core: figure out import/require for core and plugins — just don’t use spread for plugins (@arturi)
- [x] meta: create a demo video, showcasing Uppy Dashboard for the main page, like https://zeit.co/blog/next (@arturi)
- [x] meta: update Readme, update screenshot (@arturi)
- [x] server: add pre-commit and lint-staged (@arturi)
- [x] server: re-do build setup: building at `deploy` and `prepublish` when typing `npm run release:patch` 0.0.1 -> 0.0.2 (@ifedapoolarewaju)
- [x] server: re-do build setup: es6 `src` -> es5 `lib` (use plugin packs from Uppy)
- [x] server: re-do build setup: `eslint --fix ./src` via http://standardjs.com (@ifedapoolarewaju)
- [x] server: re-do build setup: `babel-node` or `babel-require` could do realtime transpiling for development (how does that hook in with e.g. `nodemon`?) (@ifedapoolarewaju)
- [x] server: refacor: remove/reduce file redundancy (@ifedapoolarewaju)
- [x] server: error handling: 404 and 401 error handler (@ifedapoolarewaju)
- [x] server: bug fix: failing google drive (@ifedapoolarewaju)
- [x] webcam: stop using the webcam (green light off) after the picture is taken / tab is hidden (@arturi)
- [x] core: allow usage without `new`, start renaming `Core()` to `Uppy()` in examples (@arturi)
- [x] core: api — consider Yosh’s feedback and proposals https://gist.github.com/yoshuawuyts/b5e5b3e7aacbee85a3e61b8a626709ab, come up with follow up questions (@arturi)
- [x] dashboard: local mode — no acquire plugins / external services, just DnD — ActionBrowseTagline (@arturi)
- [x] dashboard: only show pause/resume when tus is used (@arturi)
- [x] dashboard: cancel uploads button for multipart (@arturi)
- [x] dashboard: responsive design — stage 1 (@arturi)
- [x] meta: write 0.11 release blog post (@arturi)

## 0.11.0

Released: November 1, 2016. Releasemaster: Artur.
Theme: StatusBar and API docs.

- [x] core: log method should have an option to throw error in addition to just logging (@arturi)
- [x] experimental: PersistentState plugin that saves state to localStorage — useful for development (@arturi)
- [x] dashboard: implement new StatusBar with progress and pause/resume buttons https://github.com/transloadit/uppy/issues/96#issuecomment-249401532 (@arturi)
- [x] dashboard: attempt to throttle StatusBar, so it doesn’t re-render too often (@arturi)
- [x] dashboard: refactor — only load one acquire panel at a time (activeAcquirer or empty), change focus behavior, utilize onload/onunload
- [x] experimental: create a Dashboard UI for Redux refactor (@hedgerh)
- [x] dashboard: make trigger optional — not needed when rendering inline (@arturi)
- [x] fileinput: pretty input element #93 (@arturi)
- [x] meta: document current Uppy architecture and question about the future (@arturi, @hedgerh)
- [x] test: see about adding tests for autoProceed: true (@arturi)
- [x] website: and ability to toggle options in Dashboard example: inline/modal, autoProceed, which plugins are enabled #89 (@arturi)
- [x] website: finish https upgrade for uppy.io, uppy-server and tus, set up pingdom notifications (@arturi, @kvz, @hedgerh)
- [x] website: update guide, API docs and main page example to match current actual API (@arturi)
- [x] uppy-server: Make uppy server have dynamic controllers (@hedgerh)

## 0.10.0

Released: Septermber 23, 2016. Releasemaster: Artur.
Theme: Getting together.

- [x] core: expose some events/APIs/callbacks to the user: `onFileUploaded`, `onFileSelected`, `onAllUploaded`, `addFile` (or `parseFile`), open modal... (@arturi, @hedgerh)
- [x] core: how would Uppy work without the UI, if one wants to Uppy to just add files and upload, while rendering preview and UI by themselves #116 — discussion Part 1 (@arturi, @hedgerh)
- [x] core: refactor towards react compatibility as discussed in https://github.com/transloadit/uppy/issues/110 (@hedgerh)
- [x] core: CSS modules? allow bundling of CSS in JS for simple use in NPM? See #120#issuecomment-242455042, try https://github.com/rtsao/csjs — verdict: not yet, try again later (@arturi, @hedgerh)
- [x] core: try Web Workers and FileReaderSync for image resizing again — still slow, probably message payload between webworker and regular thread is huge (@arturi)
- [x] core: i18n strings should extend default en_US dictionary — if a certain string in not available in German, English should be displayed (@arturi)
- [x] dashboard: refactor to smaller components, pass props down (@arturi)
- [x] dashboard: option to render Dashboard inline instead of a modal dialog (@arturi)
- [x] dashboard: global circular progress bar, try out different designs for total upload speed and ETA (@arturi)
- [x] dashboard: show total upload speed and ETA, for all files (@arturi)
- [x] dashboard: copy link to uploaded file button, cross-browser (@arturi) (http://i.imgur.com/b1Io34n.png) (@arturi)
- [x] dashobard: refreshed design and grand refactor (@arturi)
- [x] dashboard: improve file paste the best we can http://stackoverflow.com/a/22940020 (@arturi)
- [x] provider: abstract google drive into provider plugin for reuse (@hedgerh)
- [x] google drive: improve UI (@hedgerh)
- [x] tus: add `resumable` capability flag (@arturi)
- [x] tus: start fixing pause/resume issues and race conditions (@arturi)
- [x] test: working Uppy example on Require Bin — latest version straight from NPM http://requirebin.com/?gist=54e076cccc929cc567cb0aba38815105 (@arturi @acconut)
- [x] meta: update readme docs, add unpkg CDN links (https://unpkg.com/uppy/dist/uppy.min.css) (@arturi)
- [x] meta: write 0.10 release blog post (@arturi)

## 0.9.0

Released: August 26, 2016. Releasemaster: Harry.

Theme: Making Progress, Then Pause & Resume.

- [x] dashboard: informer interface: message when all uploads are "done" (@arturi)
- [x] meta: write 0.9 release blog post (@hedgerh)
- [x] webcam: a barely working webcam record & upload (@hedgerh)
- [x] metadata: Uppy + tus empty metadata value issue in Safari https://github.com/tus/tus-js-client/issues/41 --> tus issue — nailed down, passed to @acconut (@arturi, @acconut)
- [x] core: experiment with switching to `virtual-dom` in a separate branch; experiment with rollup again (@arturi)
- [x] core: figure out race conditions (animations not completing because file div gets re-added to the dom each time) with `yo-yo`/`morphdom` https://github.com/shama/bel/issues/26#issuecomment-238004130 (@arturi)
- [x] core: switch to https://github.com/sethvincent/namespace-emitter — smaller, allows for `on('*')` (@arturi)
- [x] dashboard: add aria-labels and titles everywhere to improve accessibility #114 (@arturi)
- [x] dashboard: file name + extension should fit on two lines, truncate in the middle (maybe https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText) (@arturi)
- [x] dashboard: implement a circular progress indicator on top of the fileItem with play/pause (@arturi)
- [x] dashboard: refactor to smaller components, as discussed in #110 (@arturi)
- [x] dashboard: show upload remaining time and speed, option to disable (@arturi)
- [x] google drive: refactor to smaller components, as discussed in #110 (@hedgerh)
- [x] meta: reach out to choo author (@arturi)
- [x] meta: write 0.8 release blog post (@arturi)
- [x] metadata: add labels to fields in fileCard (@arturi)
- [x] metadata: the aftermath — better UI (@arturi)
- [x] test: Get IE6 on Win XP to run Uppy and see it fall back to regular form upload #108 (@arturi)
- [x] test: refactor tests, add DragDrop back (@arturi)
- [x] tus: update uppy to tus-js-client@1.2.1, test on requirebin (@arturi)
- [x] tus: add ability to pause/resume all uploads at once (@arturi)
- [x] tus: add ability to pause/resume upload (@arturi)

## 0.8.0

Released: July 29, 2016. Releasemaster: Artur.
Theme: The Webcam Edition.

- [x] core: fix bug: no meta information from uppy-server files (@hedgerh)
- [x] core: fix bug: uppy-server file is treated as local and directly uploaded (@hedgerh)
- [x] uppy-server: hammering out websockets/oauth (@hedgerh, @acconut)
- [x] debugger: introduce MagicLog as a way to debug state changes in Uppy (@arturi)
- [x] modifier: A MetaData plugin to supply meta data (like width, tag, filename, user_id) (@arturi)
- [x] modifier: pass custom metadata with non-tus-upload. Maybe mimic meta behavior of tus here, too (@arturi)
- [x] modifier: pass custom metadata with tus-upload with tus-js-client (@arturi)
- [x] webcam: initial version: webcam light goes on (@hedgerh)
- [x] progress: better icons, styles (@arturi)
- [x] core: better mime/type detection (via mime + extension) (@arturi)
- [x] core: add deep-freeze to getState so that we are sure we are not mutating state accidentally (@arturi)
- [x] meta: release “Uppy Begins” post (@arturi @kvz)
- [x] meta: better readme on GitHub and NPM (@arturi)
- [x] test: add pre-commit & lint-staged (@arturi)
- [x] test: add next-update https://www.npmjs.com/package/next-update to check if packages we use can be safely updated (@arturi)
- [x] website: blog polish — add post authors and their gravatars (@arturi)
- [x] dashboard: UI revamp, more prototypes, background image, make dashboard nicer (@arturi)
- [x] dashboard: try a workflow where import from external service slides over and takes up the whole dashboard screen (@arturi)
- [x] modal: merge modal and dashboard (@arturi)

## 0.7.0

Released: July 11, 2016.
Theme: Remote Uploads, UI Redesign.

- [x] core: Investigate if there is a way to manage an oauth dialog and not navigate away from Uppy; Put entire(?) state into oauth redirect urls / LocalStorage with an identifier ? (@hedgerh)
- [x] core: Rethink UI: Part I (interface research for better file selection / progress representation) (@arturi)
- [x] core: let user cancel uploads in progress (@arturi)
- [x] core: resize image file previews (to 100x100px) for performance (@arturi)
- [x] server: add tus-js-client when it's node-ready (@hedgerh)
- [x] server: make uppy-server talk to uppy-client in the browser, use websockets. (@hedgerh)
- [x] dashboard: new “workspace” plugin, main area that allows for drag & drop and shows progress/actions on files, inspired by ProgressDrawer
- [x] website: add new logos and blog (@arturi)
- [x] drive: Return `cb` after writing all files https://github.com/transloadit/uppy-server/commit/4f1795bc55869fd098a5c81a80edac504fa7324a#commitcomment-17385433 (@hedgerh)
- [x] server: Make Google Drive files to actually upload to the endpoint (@hedgerh)
- [x] build: browsersync does 3 refreshes, can that be one? should be doable via cooldown/debounce? -> get rid of require shortcuts (@arturi)
- [x] build: regular + min + gzipped versions of the bundle (@arturi)
- [x] build: set up a simple and quick dev workflow — watch:example (@arturi)

## 0.6.4

Released: June 03, 2016.
Theme: The aim low release.

- [x] build: minification of the bundle (@arturi)
- [x] build: revisit sourcemaps for production. can we have them without a mandatory extra request?
- [x] build: supply Uppy es5 and es6 entry points in npm package (@arturi)
- [x] build: switch to https://www.npmjs.com/package/npm-run-all instead of parallelshell (@arturi)
- [x] drive: Make sure uppy-server does not explode on special file types: https://dl.dropboxusercontent.com/s/d4dbxitjt8clo50/2016-05-06%20at%2022.41.png (@hedgerh)
- [x] modal: accessibility. focus on the first input field / button in tab panel (@arturi)
- [x] progressdrawer: figure out crazy rerendering of previews by yoyo/bel: https://github.com/shama/bel/issues/26, https://github.com/shama/bel/issues/27 (@arturi)
- [x] core: substantial refactor of mount & rendering (@arturi)
- [x] core: better state change logs for better debugging (@arturi)
- [x] progressdrawer: improve styles, add preview icons for all (@arturi)
- [x] server: Start implementing the `SERVER-PLAN.md`, remote files should be added to `state.files` and marked as `remote` (@hedgerh)
- [x] test: Add pass/fail Saucelabs flag to acceptance tests (@arturi)
- [x] website: Polish Saucelabs stats (social badge + stats layout) (@arturi)
- [x] meta: Create Uppy logos (@markstory)
- [x] website: fix examples and cleanup (@arturi)
- [x] website: Add Saucelabs badges to uppy.io (@kvz)
- [x] website: fix disappearing icons issue, `postcss-inline-svg` (@arturi)

## 0.0.5

Released: May 07, 2016.
Theme: Acceptance tests and Google Drive Polish.

- [x] test: Wire saucelabs and travis togeteher, make saucelabs fail fatal to travis builds
- [x] test: Add `addFile`-hack so we can have acceptance tests on Safari as well as Edge (@arturi)
- [x] drive: possible UI polish (@hedgerh)
- [x] drive: write files to filesystem correctly (@hedgerh)
- [x] test: Fix 15s timeout image.jpg (@arturi)
- [x] test: Sign up for Browserstack.com Live account so we can check ourselves what gives and verify saucelabs isn't to blame (@arturi) <-- Turns out, Saucelabs already does that for us
- [x] test: Get tests to pass Latest version of Internet Explorer (Windows 10), Safari (OSX), Firefox (Linux), Opera (Windows 10) (@arturi) <-- IE 10, Chrome, Firefox on Windows and Linux, but not Safari and Microsoft Edge — Selenium issues
- [x] test: Get saucelabs to show what gives (errors, screenshots, anything) (@arturi)
- [x] build: sourcemaps for local development (@arturi) <-- Not adding it in production to save the extra request. For local dev, this was added already via Browserify
- [x] core: Add polyfill for `fetch` (@hedgerh)
- [x] core: Apply plugins when DOM elements aren't static (#25)
- [x] core: figure out the shelf thing https://transloadit.slack.com/archives/uppy/p1460054834000504 https://dl.dropboxusercontent.com/s/ypx6a0a82s65o0z/2016-04-08%20at%2010.38.png (@arturi, @hedgerh)
- [x] core: reduce the monstrous 157.74Kb prebuilt bundle footprint https://dl.dropboxusercontent.com/s/ypx6a0a82s65o0z/2016-04-08%20at%2010.38.png <-- we see no way to optimize at this stage
- [x] drive: add breadcrumb navigation (@hedgerh)
- [x] drive: convert google docs to office format (@hedgerh)
- [x] modal: Avoid duplicating event listeners <-- deprecated by yoyo
- [x] progressbar: make it great again (@arturi)
- [x] progressdrawer: figure out why the whole list is replaced with every update (dom diff problems) (@arturi)
- [x] test: Let Travis use the Remote WebDriver instead of the Firefox WebDriver (https://docs.travis-ci.com/user/gui-and-headless-browsers/#Using-Sauce-Labs), so Saucelabs can run our acceptance tests against a bunch of real browsers. Local acceptance tests keep using Firefox <-- need to add command to Travis (@arturi)
- [x] test: Move failing multipart test back from `v0.0.5` dir, make it pass (@arturi)
- [x] tus: Add support tus 1.0 uploading capabilities (#3) <-- works!
- [x] website: Make cycling through taglines pretty (in terms of code and a nice animation or sth) (@arturi)
- [x] website: Move the activity feed from http://uppy.io/stats to the Uppy homepage (@arturi)
- [x] website: Polish http://uppy.io/stats and undo its CSS crimes (@arturi)

## 0.0.4

Released: April 13, 2016.

- [x] server: Upgrade to 0.0.4 (@kvz)
- [x] drive: Add Google Drive plugin unit test (@hedgerh)
- [x] drive: Add a barely working Google Drive example (without Modal, via e.g. `target: "div#on-my-page"`) (@hedgerh)
- [x] drive: Make sure http://server.uppy.io is targeted on uppy.io; and localhost is targeted elsewhere (also see https://github.com/hughsk/envify) (@kvz)
- [x] test: Setup one modal/dragdrop acceptance test (@arturi)
- [x] drive: Make sure http://server.uppy.io is targeted on uppy.io; and localhost is targeted elsewhere (also see https://github.com/hughsk/envify) (@kvz)
- [x] website: Add a http://uppy.io/stats page that inlines disc.html as well as displays the different bundle sizes, and an activity feed (@kvz)
- [x] dragdrop: refactor & improve (@arturi)
- [x] website: fix i18n & DragDrop examples (@arturi)
- [x] website: Provide simple roadmap in examples (#68, @kvz)
- [x] website: Upgrade Hexo (@kvz)
- [x] test: Make failing acceptance tests fatal (@kvz)
- [x] allow for continuous `acquiring`, even after all plugins have “run” (@arturi, @hedgerh)
- [x] build: clean up package.json. We've accumulated duplication and weirdness by hacking just for our current problem without keeping a wider view of what was already there (@arturi)
- [x] build: fix browsersync & browserify double reloading issue (@arturi)
- [x] build: sourcemaps for examples (@arturi)
- [x] complete: `Complete` Plugin of type/stage: `presenter`. "You have successfully uploaded `3 files`". Button: Close modal. (@arturi)
- [x] core: allow for continuous `acquiring`, even after all plugins have “run” (@arturi, @hedgerh)
- [x] core: come up with a draft standard file format for internal file handling (@arturi)
- [x] core: Pluralize collections (locales, just l like plugins) (@kvz)
- [x] core: re-think running architecture: allow for `acquiring` while `uploading` (@arturi)
- [x] core: Rename `progress` to `progressindicator` (@kvz)
- [x] core: Rename `selecter` to `acquirer` (@kvz)
- [x] core: Rename `view` to `orchestrator` (@kvz)
- [x] core: start on component & event-based state management with `yo-yo` (@arturi)
- [x] core: Upgrade from babel5 -> babel6 (@kvz)
- [x] dragdrop: Fix 405 Not Allowed, (error) handling when you press Upload with no files (#60, @arturi, thx @hpvd)
- [x] modal: `UppyModal [type=submit] { display: none }`, use Modal's own Proceed button to progress to next stage (@arturi)
- [x] modal: covert to component & event-based state management (@arturi)
- [x] modal: Make sure modal renders under one dom node — should everything else too? (@arturi, @hedgerh)
- [x] modal: refactor and improve (@arturi)
- [x] progressdrawer: show link to the uploaded file (@arturi)
- [x] progressdrawer: show file type names/icons for non-image files (@arturi)
- [x] progressdrawer: show uploaded files, display uploaded/selected count, disable btn when nothing selected (@arturi)
- [x] progressdrawer: implement basic version, show upload progress for individual files (@arturi)
- [x] progressdrawer: show previews for images (@arturi)
- [x] server: Add a deploy target for uppy-server so we can use it in demos (#39, @kvz)
- [x] test: Add a passing dummy i18n acceptance test, move failing multipart test to `v0.5.0` dir (@kvz)
- [x] test: Add acceptance tests to Travis so they are run on every change (@kvz)
- [x] test: Get Firefox acceptance tests up and running both local and on Travis CI. Currently both failing on `StaleElementReferenceError: Element not found in the cache - perhaps the page has changed since it was looked up` https://travis-ci.org/transloadit/uppy/builds/121175389#L478
- [x] test: Get saucelabs account https://saucelabs.com/beta/signup/OSS/None (@hedgerh)
- [x] test: Install chromedriver ()
- [x] test: Switch to using Firefox for acceptable tests as Travis CI supports that (https://docs.travis-ci.com/user/gui-and-headless-browsers/#Using-xvfb-to-Run-Tests-That-Require-a-GUI) (@kvz)
- [x] test: Write one actual test (e.g. Multipart) (#2, #23, @hedgerh)
- [x] tus: Resolve promise when all uploads are done or failed, not earlier (currently you get to see '1 file uploaded' and can close the modal while the upload is in progress) (@arturi)
- [x] website: Filter taglines (@kvz)
- [x] website: utilize browserify index exposers to rid ourselves of `../../../..` in examples (@kvz)

## 0.0.3

Released: March 01, 2016.

- [x] core: push out v0.0.3 (@kvz)
- [x] build: release-(major|minor|patch): git tag && npm publish (@kvz)
- [x] core: Allow users to set DOM elements or other plugins as targets (@arturi)
- [x] core: Create a progressbar/spinner/etc plugin (#18, @arturi)
- [x] core: Decide on how we ship default styles: separate css file, inline (@kvz, @hedgerh, @arturi, @tim-kos)
- [x] core: Decide on single-noun terminology (npm, umd, dist, package, cdn, module -> bundler -> bundle), and call it that through-out (@kvz)
- [x] core: throw an error when one Plugin is `.use`d twice. We don't support that now, and will result in very confusing behavior (@kvz)
- [x] dragdrop: Convert `DragDrop` to adhere to `Dummy`'s format, so it's compatible with the new Modal (@arturi)
- [x] drive: Convert `GoogleDrive` to adhere to `Dummy`'s format, so it's compatible with the new Modal (@hedgerh)
- [x] modal: Add barely working Modal plugin that can be used as a target (#53, #50, @arturi)
- [x] modal: Improve Modal API (@arturi, @kvz)
- [x] modal: Make `ProgressBar` work with the new Modal (@kvz, @arturi)
- [x] modal: Make Modal prettier and accessible using Artur's research (@arturi)
- [x] modal: Make the Modal look like Harry's sketchup (@arturi)
- [x] modal: Rename FakeModal to Modal, deprecating our old one (@kvz)
- [x] modal: use classes instead of IDs and buttons instead of links (@arturi)
- [x] server: `package.json` (@hedgerh)
- [x] test: Fix and enable commented out `use plugins` & other core unit test (@arturi)

## 0.0.2

Released: February 11, 2016.

- [x] build: Use parallelshell and tweak browserify to work with templates (@arturi)
- [x] core: Add basic i18n support via `core.translate()` and locale loading (#47, @arturi)
- [x] core: implement a non-blocking `install` method (for Progressbar, for example)  (@arturi, @kvz)
- [x] core: Implement ejs or es6 templating (@arturi, @hedgerh)
- [x] core: Improve on `_i18n` support, add tests (#47, @arturi)
- [x] core: Integrate eslint in our build procedure and make Travis fail on errors found in our examples, Core and Plugins, such as `> 100` char lines (@kvz)
- [x] docs: Fix build-documentation.js crashes, add more docs to Utils and Translator (@arturi, @kvz)
- [x] dragdrop: Use templates, autoProceed setting, show progress (#50, #18, @arturi)
- [x] meta: Implement playground to test things in, templates in this case
- [x] server: Create a (barely) working uppy-server (#39, @hedgerh)
- [x] website: Fix Uppy deploys (postcss-svg problem) (@arturi, @kvz)

## 0.0.1

Released: December 20, 2015.

- [x] core: Individual progress (#24)
- [x] core: Setup basic Plugin system (#1, #4, #20)
- [x] core: Setup build System (#30, #13, @hedgerh)
- [x] dragdrop: Add basic DragDrop plugin example (#7)
- [x] dropbox: Add basic Dropbox plugin example (#31)
- [x] website: Add CSS Framework (#14)
- [x] website: Create Hexo site that also contains our playground (#5, #34, #12 #22, #44, #35, #15, #37, #40, #43)
