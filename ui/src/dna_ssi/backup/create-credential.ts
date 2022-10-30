import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import {
  InstalledCell,
  ActionHash,
  Record,
  AppWebsocket,
  InstalledAppInfo,
} from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import { Credential } from './credential';
import '@material/mwc-button';
import '@material/mwc-textarea';

@customElement('create-credential')
export class CreateCredential extends LitElement {
  @state()
  _value: string | undefined;

  @state()
  _pharase: string | undefined;

  @state()
  _credentials: Array<Credential> = [];

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  // constructor() {
  //   this._credentials = ['red', 'green', 'blue'];
  // }
  async generatePassPharase() {
    //debugger;
    const cellData = this.appInfo.cell_data.find(
      (c: InstalledCell) => c.role_id === 'dna_ssi'
    )!;
    const result = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'backup',
      fn_name: 'mnemonic',
      payload: null,
      provenance: cellData.cell_id[1],
    });
    console.log(result);
    this._pharase = result;
  }

  async get_my_credentials() {
    //debugger;
    const cellData = this.appInfo.cell_data.find(
      (c: InstalledCell) => c.role_id === 'dna_ssi'
    )!;
    const result = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'backup',
      fn_name: 'get_all_data',
      payload: { pass_phrase: this._pharase },
      provenance: cellData.cell_id[1],
    });
    console.log(result);
    // this._pharase = result;
    this._credentials = result;
  }
  async createCredential() {
    const cellData = this.appInfo.cell_data.find(
      (c: InstalledCell) => c.role_id === 'dna_ssi'
    )!;

    const credential: Credential = {
      value: this._value!,
      // pass_phrase: 'something',
    };

    const record: Record = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'backup',
      fn_name: 'create_credential',
      payload: { value: this._value, pass_phrase: this._pharase },
      // payload: credential,
      provenance: cellData.cell_id[1],
    });

    alert('Credential Saved!');

    this.dispatchEvent(
      new CustomEvent('credential-created', {
        composed: true,
        bubbles: true,
        detail: {
          actionHash: record.signed_action.hashed.hash,
        },
      })
    );
  }

  render() {
    return html` <div style="display: flex; flex-direction: column">
      <span style="font-size: 18px">Generate Pass Pharase</span>
      <mwc-textarea
        outlined
        label=""
        value="${this._pharase}"
        @input=${(e: CustomEvent) => {
          this._pharase = (e.target as any).value;
        }}
      ></mwc-textarea>
      <mwc-button
        label="Generate passpharase"
        @click=${() => this.generatePassPharase()}
      ></mwc-button>
      <br />
      <span>_____________________________</span>
      <span style="font-size: 18px">Create Credential</span>

      <mwc-textarea
        outlined
        label=""
        @input=${(e: CustomEvent) => {
          this._value = (e.target as any).value;
        }}
      ></mwc-textarea>

      <mwc-button
        label="Create Credential"
        @click=${() => this.createCredential()}
      ></mwc-button>
      <span>_____________________________</span>
      <span style="font-size: 18px">Get My Credentials</span>
      <ul>
        ${this._credentials.map(item => html`<li>${item.value}</li>`)}
      </ul>
      <mwc-button
        label="Get MY Credentials"
        @click=${() => this.get_my_credentials()}
      ></mwc-button>
    </div>`;
  }
}
