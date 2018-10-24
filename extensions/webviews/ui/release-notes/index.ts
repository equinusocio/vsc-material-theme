import * as sanityClient from '@sanity/client';

const getClient = () => sanityClient({
  projectId: 'v475t82f',
  dataset: 'production',
  token: 'skywTQVEqa902NDvMHoUATV9wSmVxPEdf93DVM3fvvXKSZnzGLMu0LzUNM96p8Uup2ZTBjIS5SbbQNZUSqU1KSKhnbWeMa2xhiaCprD8pcgOiWWN3r7sdppw6BgpMNT1zNJaWnyAKXmM3fjb0BNogddFHbKMOGv493lkVOTRBneZZ68tK8hj'
});

const getReleaseNotes = (): Promise<object[]> => {
  const query = '*[_type == "release"] | order(publishedDateDesc)';
  const client = getClient();
  return client.fetch(query);
};

const renderTemplate = (posts: IPost[]) => {
  return `${posts.reduce((acc, {version, title, fixed, new: newItems, breaking}) => acc.concat(`<section class="Release">
    <header class="Release__Header">
      <span class="Release__Number">${version}</span>
      <h2 class="Release__Title">${title}</h2>
    </header>
      ${fixed.reduce((accc, src) => accc.concat(`<li data-type="fixed">${src}</li>`), '')}
    <ul class="Release-List">
      ${newItems.reduce((accc, src) => accc.concat(`<li data-type="new">${src}</li>`), '')}
      ${breaking.reduce((accc, src) => accc.concat(`<li data-type="breaking">${src}</li>`), '')}
    </ul>
  </section>`), '')}`;
};
getReleaseNotes().then((res: IPost[]) => {
  document.querySelector('.Container').innerHTML = renderTemplate(res);
});