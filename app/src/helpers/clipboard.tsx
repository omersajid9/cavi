import { setCopySnippetText } from "../redux/components/copy/copySlice"
import { store } from '../redux/store/store';
// import {clipboard} from 'electron'

async function getFromClipboard() {
    try {
      var text = await window.api.getClipboard();
      var timeOut  = 10;
      var curTime = 0;
      console.log("CLIPBOARD TRY")
      while (!text && curTime < timeOut)
      {
        setTimeout(async () =>
        {
          text = await window.api.getClipboard();
          console.log("CLIPBOARD TEXT TRY")
          curTime += 1;
        }, 100)
      }
      console.log("CLIPBOARD FROM HELPER CLIPBOARD", text)

      const formatted = text.replace(/\r\n|\n/g, '\n');
      store.dispatch(setCopySnippetText(formatted));
      return true
    } catch (err) {
      console.error('CLIPBOARD Failed to read clipboard contents: ', err);
      return null;
    }
  }

export default getFromClipboard;