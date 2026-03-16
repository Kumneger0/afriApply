// src/app/layout.tsx
import { html } from 'hono/html'

export const Layout = (props: { children?: any; title?: string }) => html`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${props.title ? props.title : 'AfriApply Setup'}</title>
      <script src="https://unpkg.com/htmx.org@1.9.10" integrity="sha384-D1Kt99CQGfRiaBCxWqOVt1vC1EHL8GP+aiYhwhQYK7hAxTpTRRifPWSgZgHWcWYh" crossorigin="anonymous"></script>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = {
          theme: {
            extend: {}
          }
        }
      </script>
    </head>
    <body class="font-sans bg-gray-100 p-4">
      <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 my-8">
        ${props.children}
      </div>
    </body>
  </html>
`