import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { InstalledCell, ActionHash, Record, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import { Credential } from './credential';
import '@material/mwc-button';
import '@material/mwc-textarea';

@customElement('create-credential')
export class CreateCredential extends LitElement {

  @state()
  _value: string
 | undefined;

  isCredentialValid() {
    return this._value;
  }

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async createCredential() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'dna_ssi')!;

    const credential: Credential = { 
      value: this._value!,
    };

    const record: Record = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'backup',
      fn_name: 'create_credential',
      payload: credential,
      provenance: cellData.cell_id[1]
    });

    this.dispatchEvent(new CustomEvent('credential-created', {
      composed: true,
      bubbles: true,
      detail: {
        actionHash: record.signed_action.hashed.hash
      }
    }));
  }

  render() {
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create Credential</span>

          <mwc-textarea outlined label="" @input=${(e: CustomEvent) => { this._value = (e.target as any).value;} }></mwc-textarea>

        <mwc-button 
          label="Create Credential"
          .disabled=${!this.isCredentialValid()}
          @click=${() => this.createCredential()}
        ></mwc-button>
    </div>`;
  }
}
