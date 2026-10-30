# Course data and branding

## Online directory

Live course search and scorecard details use [OpenGolfAPI](https://opengolfapi.org/) through its documented keyless, public CORS API. Course data is attributed to OpenStreetMap contributors via OpenGolfAPI and licensed under [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/). See the provider’s [attribution page](https://opengolfapi.org/attribution).

The application shows attribution in search results and import previews and stores source metadata with saved course records. OpenGolfAPI results are not bundled into the app’s catalogue; the small test fixture is an attributed excerpt of a real response retrieved on 30 October 2026.

Directory coverage and completeness vary. The app never manufactures hole pars, distances or stroke indexes for a directory entry with missing data. Yardages are converted to metres using 0.9144 and rounded to the nearest metre.

## Maleny saved web scorecard

The small bundled catalogue provides an offline fallback for the user’s requested Maleny example. It contains factual scorecard values for the Black/Mountain tees, checked on 30 October 2026:

- [Official club course guide](https://www.malenygolfclub.com.au/course-guide): course layout and tee distances.
- [18Birdies published Black tee scorecard](https://18birdies.com/golf-courses/club/334902d0-ff79-11ea-aad9-06780482e2ce/maleny-golf-club): 18 hole pars, distances and stroke indexes.

The catalogue is labelled **Saved web scorecard**, not a live website scrape. Its source date and review note are visible on import. Ratings are left blank because published sources disagree. Other Maleny tee sets are not included without a complete, consistent scorecard source.

No club logos, course-guide artwork, reviews, descriptions or other editorial content are reproduced.

## App icon

The new golf-ball and two-line-graphs artwork was created with OpenAI image generation for Hack Stat. `dist/brand/hackstat-line-graph.webp` is the retained high-resolution app asset; PNG derivatives provide Android, browser and Apple icons. The previous icon files remain in source history but are no longer referenced by the app.
