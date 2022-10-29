import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { appWebsocketContext, appInfoContext } from '../../contexts';
import '@material/mwc-button';
import '@material/mwc-textarea';
let CreateCredential = class CreateCredential extends LitElement {
    isCredentialValid() {
        return this._value;
    }
    async createCredential() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'dna_ssi');
        const credential = {
            value: this._value,
        };
        const record = await this.appWebsocket.callZome({
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
        return html `
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create Credential</span>

          <mwc-textarea outlined label="" @input=${(e) => { this._value = e.target.value; }}></mwc-textarea>

        <mwc-button 
          label="Create Credential"
          .disabled=${!this.isCredentialValid()}
          @click=${() => this.createCredential()}
        ></mwc-button>
    </div>`;
    }
};
__decorate([
    state()
], CreateCredential.prototype, "_value", void 0);
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