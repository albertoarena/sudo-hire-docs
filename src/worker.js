// Runs only when no file in ./placeholder matches the request.
// The site has one page for now, so every other address goes back to it.
// The redirect is temporary (302): the real site will have these pages.
export default {
  fetch(request) {
    return Response.redirect(new URL('/', request.url), 302);
  },
};
