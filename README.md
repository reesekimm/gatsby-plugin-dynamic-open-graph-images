# Gatsby plugin for dynamic open graph images

[![npm](https://img.shields.io/npm/v/gatsby-plugin-dynamic-open-graph-images)](https://npmjs.org/package/gatsby-plugin-dynamic-open-graph-images "View this project on npm")
[![npm](https://img.shields.io/npm/dw/gatsby-plugin-dynamic-open-graph-images)](https://npmjs.org/package/gatsby-plugin-dynamic-open-graph-images "View this project on npm")

A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin to derive and generate images for the [Open Graph Protocol](https://ogp.me/) directly from React Components.

---

**📌 NOTICE**

<br />

This plugin originates from [gatsby-plugin-open-graph-images](https://github.com/squer-solutions/gatsby-plugin-open-graph-images) and uses the same [approach](https://dev.to/duffleit/bridging-the-gap-between-gatsby-and-open-graph-images-52gh) - deriving open graph images from React components and integrating their creation into the Gatsby build pipeline.

The idea is awesome but it didn't work as I expected. I figured out gatsby-plugin-open-graph-images uses Gatsby cache to manage open-graph image metadata and the cache is not updated correctly. So I made another one that **implements the same functionality based on file system**.

Hope this can help anyone who struggles with cache issue.

---

<br />

## How to install

```
npm i gatsby-plugin-dynamic-open-graph-images
```

## How to use

1.  Place the plugin in your main `gatsby-config.js`
    <br />

    ```js
    plugins: [`gatsby-plugin-dynamic-open-graph-images`];
    ```

    <br />

2.  The creation of Open Graph images is done by `createOpenGraphImage()` within your `gatsby-node.js` file.
    <br />

    **Example**

    ```js
    const { createOpenGraphImage } = require("gatsby-plugin-dynamic-open-graph-images");

    exports.createPages = async ({ actions }) => {
      const { createPage } = actions;

      const openGraphImage = createOpenGraphImage(createPage, {
        component: path.resolve(`src/templates/index.og-image.js`),
        size: {
          width: 400,
          height: 50,
        },
      });
    };
    ```

      <br />

    You can also pass open-graph image metadata as `pageContext` and simply use it within your page or component.

      <br />

    **Example**

    - gatsby-node.js

    ```js
    const { createOpenGraphImage } = require("gatsby-plugin-dynamic-open-graph-images");

    exports.createPages = async ({ actions, graphql }) => {
      const { createPage } = actions;

      // query data
      const result = await graphql(...)

      // get posts data from query result
      const posts = result.data.allMdx.edges;

      posts.forEach(({ node }) => {
        createPage({
          path: node.frontmatter.slug,
          component: postTemplate,
          context: {
            // pass open-graph image metadata as pageContext
            ogImage: createOpenGraphImage(createPage, {
              component: postOgImageTemplate,
              context: {
                id: node.id,
                title: node.frontmatter.title,
                ...
              },
            }),
          },
        });
      });
    };
    ```

    - Within your page or component

    ```jsx
    export const Head = ({ location, pageContext }) => {
      const { ogImage } = pageContext;

      return (
        <SEO
          ogImage={ogImage}
          ...
        />
      )
    }

    const SEO = ({ ogImage }) => {
      return (
        <>
          <meta property="og:image" content={domain + ogImage.imagePath} />
          <meta property="og:image:width" content="400" />
          <meta property="og:image:width" content="50" />
        </>
      );
    }
    ```

<br />

## API

### `createOpenGraphImage(createPage, options)`

<br />

#### Parameters

| parameter  | Required | description                                                                                          |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------- |
| createPage | O        | Gatsby [createPage](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createPage) action |
| options    | O        |                                                                                                      |

#### options

| option      | Required | type                              | description                                                                                                   | default                       |
| ----------- | -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `component` | O        | string                            | The absolute path of React component for open-graph iamge template. It receives context value as pageContext. | N/A                           |
| `context`   | O        | object                            | Gatsby page context. **id preporty must be provided** to distinguish components/images.                       | N/A                           |
| `size`      | X        | { width: number, height: number } | The size for the generated image.                                                                             | `{ width: 1200, height: 630}` |
| `outputDir` | X        | string                            | The directory where the rendered gatsby components are temporarily stored, to be later saved as images.       | `"__og-image"`                |

#### Returns

Open-graph image metadata

```
{
  componentPath: '__og-image/c6f9bb',
  imagePath: 'public/__og-image/c6f9bb.png',
  size: { width: 1200, height: 630 }
}
```

<br />

## Note

If you use plugins that iterate over your pages, like `gatsby-plugin-sitemap`, exclude the `outputDir`:

```js
{
  resolve: `gatsby-plugin-sitemap`,
  options: {
    exclude: [`/__og-image/*`],
  },
},
```
