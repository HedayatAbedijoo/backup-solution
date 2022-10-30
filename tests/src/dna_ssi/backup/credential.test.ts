import test from "node:test";
import assert from "node:assert";

import { runScenario, pause } from "@holochain/tryorama";
import { ActionHash, Record } from "@holochain/client";
import { decode } from "@msgpack/msgpack";

test("create credential", async (t) => {
  await runScenario(async (scenario) => {
    console.log("hedayat");

    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + "/" + "../workdir/backup-solution.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();

    const alice_dna_ssi_cell = alice.cells.find((c) => c.role_id === "dna_ssi");
    if (!alice_dna_ssi_cell)
      throw new Error("No cell for role id dna_ssi was found");

    const bob_dna_ssi_cell = bob.cells.find((c) => c.role_id === "dna_ssi");
    if (!bob_dna_ssi_cell)
      throw new Error("No cell for role id dna_ssi was found");

    const createInput = {
      value:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec eros quis enim hendrerit aliquet.",
    };

    // Alice creates a credential
    const record: Record = await alice_dna_ssi_cell.callZome({
      zome_name: "backup",
      fn_name: "create_credential",
      payload: createInput,
    });

    const someting = await alice_dna_ssi_cell.callZome({
      zome_name: "backup",
      fn_name: "mnemonic",
    });

    assert.deepEqual(someting, 1);
  });
});
/*
test("create and read credential", async (t) => {
  await runScenario(async (scenario) => {
    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + "/" + "../workdir/backup-solution.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();

    const alice_dna_ssi_cell = alice.cells.find((c) => c.role_id === "dna_ssi");
    if (!alice_dna_ssi_cell)
      throw new Error("No cell for role id dna_ssi was found");

    const bob_dna_ssi_cell = bob.cells.find((c) => c.role_id === "dna_ssi");
    if (!bob_dna_ssi_cell)
      throw new Error("No cell for role id dna_ssi was found");

    const createInput: any = {
      value:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec eros quis enim hendrerit aliquet.",
    };

    // Alice creates a credential
    const record: Record = await alice_dna_ssi_cell.callZome({
      zome_name: "backup",
      fn_name: "create_credential",
      payload: createInput,
    });
    assert.ok(record);

    // Wait for the created entry to be propagated to the other node.
    await pause(300);

    // Bob gets the created credential
    const createReadOutput: Record = await bob_dna_ssi_cell.callZome({
      zome_name: "backup",
      fn_name: "get_credential",
      payload: record.signed_action.hashed.hash,
    });
    assert.deepEqual(
      createInput,
      decode((createReadOutput.entry as any).Present.entry) as any
    );
  });
});
test("create and update credential", async (t) => {
  await runScenario(async (scenario) => {
    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + "/" + "../workdir/backup-solution.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();

    const alice_dna_ssi_cell = alice.cells.find((c) => c.role_id === "dna_ssi");
    if (!alice_dna_ssi_cell)
      throw new Error("No cell for role id dna_ssi was found");

    const bob_dna_ssi_cell = bob.cells.find((c) => c.role_id === "dna_ssi");
    if (!bob_dna_ssi_cell)
      throw new Error("No cell for role id dna_ssi was found");

    const createInput = {
      value:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec eros quis enim hendrerit aliquet.",
    };

    // Alice creates a credential
    const record: Record = await alice_dna_ssi_cell.callZome({
      zome_name: "backup",
      fn_name: "create_credential",
      payload: createInput,
    });
    assert.ok(record);

    // Alice updates the credential
    const contentUpdate: any = {
      value:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec eros quis enim hendrerit aliquet.",
    };

    const updateInput = {
      original_action_hash: record.signed_action.hashed.hash,
      updated_credential: contentUpdate,
    };

    const updatedRecord: Record = await alice_dna_ssi_cell.callZome({
      zome_name: "backup",
      fn_name: "update_credential",
      payload: updateInput,
    });
    assert.ok(updatedRecord);

    // Wait for the updated entry to be propagated to the other node.
    await pause(300);

    // Bob gets the updated credential
    const readUpdatedOutput: Record = await bob_dna_ssi_cell.callZome({
      zome_name: "backup",
      fn_name: "get_credential",
      payload: updatedRecord.signed_action.hashed.hash,
    });
    assert.deepEqual(
      contentUpdate,
      decode((readUpdatedOutput.entry as any).Present.entry) as any
    );
  });
});
test("create and delete credential", async (t) => {
  await runScenario(async (scenario) => {
    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + "/" + "../workdir/backup-solution.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();

    const alice_dna_ssi_cell = alice.cells.find((c) => c.role_id === "dna_ssi");
    if (!alice_dna_ssi_cell)
      throw new Error("No cell for role id dna_ssi was found");

    const bob_dna_ssi_cell = bob.cells.find((c) => c.role_id === "dna_ssi");
    if (!bob_dna_ssi_cell)
      throw new Error("No cell for role id dna_ssi was found");

    const createInput = {
      value:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec eros quis enim hendrerit aliquet.",
    };

    // Alice creates a credential
    const record: Record = await alice_dna_ssi_cell.callZome({
      zome_name: "backup",
      fn_name: "create_credential",
      payload: createInput,
    });
    assert.ok(record);

    // Alice deletes the credential
    const deleteActionHash = await alice_dna_ssi_cell.callZome({
      zome_name: "backup",
      fn_name: "delete_credential",
      payload: record.signed_action.hashed.hash,
    });
    assert.ok(deleteActionHash);

    // Wait for the entry deletion to be propagated to the other node.
    await pause(300);

    // Bob tries to get the deleted credential
    const readDeletedOutput = await bob_dna_ssi_cell.callZome({
      zome_name: "backup",
      fn_name: "get_credential",
      payload: record.signed_action.hashed.hash,
    });
    assert.equal(readDeletedOutput, undefined);
  });
});
*/
