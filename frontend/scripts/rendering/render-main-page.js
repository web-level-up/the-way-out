import {fetchContentPagePromise, getRenderBaseGamePagePromise} from "./helpers/helper-functions.js";

export function renderMainPage() {
  getRenderBaseGamePagePromise().then(() => {
    const contentContainer = document.getElementById('content');

    fetchContentPagePromise('main-page', contentContainer).then();
  });
}