import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { decode } from '@msgpack/msgpack';
import { appInfoContext, appWebsocketContext } from '../../contexts';
import '@material/mwc-circular-progress';
let CredentialDetail = class CredentialDetail extends LitElement {
    async firstUpdated() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'dna_ssi');
        const record = await this.appWebsocket.callZome({
            cap_secret: null,
            cell_id: cellData.cell_id,
            zome_name: 'backup',
            fn_name: 'get_credential',
            payload: this.actionHash,
            provenance: cellData.cell_id[1]
        });
        if (record) {
            this._credential = decode(record.entry.Present.entry);
        }
    }
    render() {
        if (!this._credential) {
            return html `<div style="display: flex; flex: 1; align-items: center; justify-content: center">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
        }
        return html `
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Credential</span>
		  <div style="display: flex; flex-direction: column">
		    <span><strong></strong></span>
		    <span style="white-space: pre-line">${this._credential.value}</span>
		  </div>
      </div>
    `;
    }
};
__decorate([
    property()
], CredentialDetail.prototype, "actionHash", void 0);
__decorate([
    state()
], CredentialDetail.prototype, "_credential", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], CredentialDetail.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], CredentialDetail.prototype, "appInfo", void 0);
CredentialDetail = __decorate([
    customElement('credential-detail')
], CredentialDetail);
export { CredentialDetail };
//# sourceMappingURL=credential-detail.js.map