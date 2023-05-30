# SearchStax Studio Search Page - React with Typescript

This React app shows how to use and implement the various [SearchStax Studio APIs](https://www.searchstax.com/docs/searchstudio/searchstax-studio-search-api/) to show a site search result page. Features include auto-suggest as users begin to enter a search query, faceting and sorting search results, infinite scroll and traditional pagination, tracking and analytics, as well as some basic template/view options.

## Getting Started

Clone this repo and run `npm install` to add dependencies. This app tries to use native functions to reduce dependencies for easier integration with established code bases.

Next you'll need to set up an `.env` file with the SearchStax Studio API endpoints, tokens, and keys. You can copy/rename `sample.env.txt` and add your environment-specific info.

Run `npm start` to launch the app.

# Customizing the App

There are several built-in options to customize the appearance of the search result page if you don't want to directly modify the prebuilt components.

## Number of results per page

By default `SearchResultPage` will show 30 results per page. You can allow users to select the row count (use `rowOptions` for available options) or hard code the `rows` state value and remove the Show Rows menu. The maximum number of rows the API will return is 50.

## Infinite Scroll

By default `SearchResultPage` will only fetch one page of results at a time and paginate any additional results over the `rows` limit (see above). You can set `loadOnScroll` to true to enable infinite scroll to fetch more results as a user scrolls down.

## Facet Selection

By default `SearchResultPage` will check `facetType` to show available facets in a `group` using the `FacetGroup` component at the top of the search results. You can also show a `menu` of facets (using `FacetMenu`) above the search results or use `list` (using `FacetList`) to show an expandable list of facets to the left of the search results.

## Language

By default `SearchResultPage` will use English (`en`) when getting search suggestions and sending reporting data. You'll need to configure the appropriate language options in SearchStax Studio Dashboard and set the appropriate language code in `SearchResultPage`'s props.

# Configuring SearchStax Studio

## Fields
[Search Result Fields Guide](https://www.searchstax.com/docs/searchstudio/results-and-display-tab/)

By default `SearchSnippet` will show a search result with the type, title, URL/path, date (if available), author name, thumbnail image (if available) and description of the page (if available). You can add and customize the search result fields that will be included in the search result API response. You'll need to update the `SearchSnippet` component to show those additional fields.

### Hit Highlighting

Hit highlighting is not supported by this React app but you can add it if you'd like to use the search result API response's pre-formatted highlighting. You'll need to either use the `dangerouslysetinnerhtml` method to show the formatted HTML from the API response or manage the highlighting in the relevant components.

## Facets
[Facets Guide](https://www.searchstax.com/docs/searchstudio/faceting-tab/)

You can create your own facets in the SearchStax Studio Dashboard. Any facets you create will be included in the search result API response and automatically displayed by the `facetType` you've set in `SearchResultPage`.

## Sorting
[Sorting Guide](https://www.searchstax.com/docs/searchstudio/sorting-tab/)

By default SearchStax Studio sorts results based on document relevance but you can add additional sort types in the SearchStax Studio Dashboard. Any additional sorting options you've configured will be included in the search result API response and automatically shown in `SearchResultPage`.

## Auto-suggest
[Auto-Suggest Guide](https://www.searchstax.com/docs/searchstudio/searchstax-studio-auto-suggest/)

You can add an auto-suggest keyword dictionary in the SearchStax Studio Dashboard to enable the search suggestions in the `SearchBox` component. `SearchBox` waits until a user has entered at least three characters to check for suggestions.

## Related Searches
[Related Searches Guide](https://www.searchstax.com/docs/searchstudio/searchstax-studio-related-searches/)

You can create a dictionary of related queries for a keyword. `SearchResultPage` will show related keywords (when available) using the `RelatedSearches` component. You can display this component above the search results (recommended for infinite scroll) or at the bottom. Related search clicks are tracked as a separate event in SearchStax Analytics.

## Spell Checking
[Spell Checking Guide](https://www.searchstax.com/docs/searchstudio/spell-check-tab/)

You can provide spellchecking for search terms with a data-driven or dictionary-driven model which can be configured in the SearchStax Studio Dashboard. `SearchResultPage` will show a spell check correction/recommendation if one has been included in the search API response when there are no results. By default only one spell check recommendation is provided but you can request more with the `spellcheck.count` request parameter.

# Reporting

SearchStax Analytics captures a number of front end and back end metrics about user searches such as top keywords, response time, rankings, and more. `SearchResultPage` tracks when a user starts a new search and clicks on a search result.

This app also includes some basic Google Analytics 4 reporting tracking for when a user searches and clicks a search result. You'll need to configure the appropriate custom events and dimensions in your Google Analytics 4 property to accurately capture this data.