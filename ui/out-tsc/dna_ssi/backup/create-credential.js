import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-button';
import '@material/mwc-textarea';
let CreateCredential = class CreateCredential extends LitElement {
    constructor() {
        super(...arguments);
        this._credentials = [];
    }
    // constructor() {
    //   this._credentials = ['red', 'green', 'blue'];
    // }
    async generatePassPharase() {
        //debugger;
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'dna_ssi');
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
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'dna_ssi');
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
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'dna_ssi');
        const credential = {
            value: this._value,
            // pass_phrase: 'something',
        };
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'backup',
            fn_name: 'create_credential',
            payload: { value: this._value, pass_phrase: this._pharase },
            // payload: credential,
            provenance: cellData.cell_id[1],
        });
        alert('Credential Saved!');
        this.dispatchEvent(new CustomEvent('credential-created', {
            composed: true,
            bubbles: true,
            detail: {
                actionHash: record.signed_action.hashed.hash,
            },
        }));
    }
    render() {
        return html ` <div style="display: flex; flex-direction: column">
      <span style="font-size: 18px">Generate Pass Pharase</span>
      <mwc-textarea
        outlined
        label=""
        value="${this._pharase}"
        @input=${(e) => {
            this._pharase = e.target.value;
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
        @input=${(e) => {
            this._value = e.target.value;
        }}
      ></mwc-textarea>

      <mwc-button
        label="Create Credential"
        @click=${() => this.createCredential()}
      ></mwc-button>
      <span>_____________________________</span>
      <span style="font-size: 18px">Get My Credentials</span>
      <ul>
        ${this._credentials.map(item => html `<li>${item.value}</li>`)}
      </ul>
      <mwc-button
        label="Get MY Credentials"
        @click=${() => this.get_my_credentials()}
      ></mwc-button>
    </div>`;
    }
};
__decorate([
    state()
], CreateCredential.prototype, "_value", void 0);
__decorate([
    state()
], CreateCredential.prototype, "_pharase", void 0);
__decorate([
    state()
], CreateCredential.prototype, "_credentials", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], CreateCredential.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], CreateCredential.prototype, "appInfo", void 0);
CreateCredential = __decorate([
    customElement('create-credential')
], CreateCredential);
export { CreateCredential };
//# sourceMappingURL=create-credential.js.map