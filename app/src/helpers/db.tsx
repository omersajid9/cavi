import { readConfigRequest, writeConfigRequest, readConfigResponse, writeConfigResponse } from 'secure-electron-store';
import { Clip } from '../constants/interfaces/copy/copy';
import { RootState, store } from '../redux/store/store';
import { importDbClipCount, importDbClipboard } from '../redux/components/db/dbSlice';


export const exportDbToLocal = async () =>
{
    const state: RootState = store.getState();
    const clipboard: Clip[] = state.db.clipboard;
    const clipCount: number = state.db.clipCount;
    console.log("EXPORTING TO LOCAL", clipboard)
    window.api.store.onReceive(writeConfigResponse, function (args)
    {
        if (args.success)
        {
            console.log("Successfully updated file", args);
        }
    })
    console.log("ONCE ENTERRRRRRRRRR")
    // window.api.store.clearRendererBindings()
    try
    {
        window.api.store.send(writeConfigRequest, "clipCount", clipCount);
    }
    catch(error)
    {
        console.log("ERROR DBTSX ", error)
    }
    try
    {
        window.api.store.send(writeConfigRequest, "clipboard", clipboard);
        // await window.api.store.send(writeConfigRequest, "clipCount", clipCount);
    }
    catch(error)
    {
        console.log("ERROR DBTSX ", error)
    }
    // window.api.store.clearRendererBindings()
}

export const importDbFromLocal = () =>
{
    window.api.store.clearRendererBindings();
    window.api.store.onReceive(readConfigResponse, function (args: any)
    {
        if (args.success)
        {
            importDbClipboard(args.value)
        }
    })
    window.api.store.send(readConfigRequest, "clipboard");

    window.api.store.clearRendererBindings();
    window.api.store.onReceive(readConfigResponse, function (args: any)
    {
        if (args.success)
        {
            importDbClipCount(args.value)
        }
    })
    window.api.store.send(readConfigRequest, "clipCount");
}

 