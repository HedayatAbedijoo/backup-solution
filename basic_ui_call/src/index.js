import { AppWebsocket, AppSignal } from "@holochain/client";

window.Buffer = require("buffer/").Buffer; // hack

class Index {
  constructor() {
    let btn = document.getElementById("btnCallZomeFn");
    btn?.addEventListener("click", (e) => this.click(e));
  }

  async click(e) {
    const appid = document.getElementById("txt_appid").value;
    const port = document.getElementById("txt_port").value;
    const fnname = document.getElementById("txt_fn").value;
    const payload = document.getElementById("txt_payload").value;

    const result = await this.call_zome_fn(port, appid, fnname, payload);

    console.log(result);
  }

  async call_zome_fn(port, appid, fnname, payload = null) {
    alert("run...");

    const appPort = 39067;
    const TIMEOUT = 12000;
    // default timeout is set to 12000
    const client = await AppWebsocket.connect(
      `ws://localhost:${appPort}`,
      12000
      // signalCb
    );
    const cellId = (
      await client.appInfo({ installed_app_id: "backup-solution" })
    ).cell_data[0].cell_id;
    //console.log(ss);
    //const cell_id = client.appInfo.cell_data[0].cell_id;
    console.log(cellId);
    console.log(cellId[1]);

    //return;
    // default timeout set here (30000) will overwrite the defaultTimeout(12000) set above
    const result = await client.callZome(
      {
        cap: null,
        cell_id: cellId,
        zome_name: "backup",
        fn_name: "mnemonic",
        provenance: cellId[1],
        payload: null,
      },
      30000
    );

    // add Payload to Param if there is a value to send to zome
    // if (payload && !/\s/.test(payload)) param.payload = payload;

    // const message = await appConnection.callZome(param);
    return result;
    // } catch (error) {
    //   return error;
    // }
  }
}

new Index();
