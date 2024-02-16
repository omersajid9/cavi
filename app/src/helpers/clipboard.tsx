import { setCopySnippetText } from "../redux/components/copy/copySlice"
import { store } from '../redux/store/store';


async function getFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      const formatted = text.replace(/\r\n|\n/g, '\n')
      store.dispatch(setCopySnippetText(formatted));
      return true
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      return null;
    }
  }

export default getFromClipboard;