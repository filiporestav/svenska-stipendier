// Where this site's source and data live. Update GITHUB_REPO if the public
// repository ends up under a different owner or name -- every "edit this",
// "add a scholarship" and "report a problem" link on the site is built from it.
export const GITHUB_REPO = "filiporestav/svenska-stipendier";

export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;
export const DATA_DIR_URL = `${GITHUB_URL}/tree/main/data/scholarships`;
export const CONTRIBUTING_URL = `${GITHUB_URL}/blob/main/CONTRIBUTING.md`;

/** Opens a pre-filled "add a scholarship" issue. */
export const NEW_SCHOLARSHIP_URL = `${GITHUB_URL}/issues/new?template=new-scholarship.yml`;

/** Opens the GitHub editor on one scholarship's data file. */
export const editUrl = (id: string) =>
  `${GITHUB_URL}/edit/main/data/scholarships/${id}.json`;

/** Opens a pre-filled "this entry is wrong" issue for one scholarship. */
export const reportUrl = (id: string, name: string) =>
  `${GITHUB_URL}/issues/new?template=fix-scholarship.yml&title=${encodeURIComponent(
    `Fel i uppgifterna: ${name}`
  )}&scholarship=${encodeURIComponent(id)}`;
