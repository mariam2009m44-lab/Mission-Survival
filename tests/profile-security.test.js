import test from "node:test";
import assert from "node:assert/strict";
import {webcrypto} from "node:crypto";
import {createProfileCredential,verifyProfileCredential,normalizeAccessCode} from "../src/profile-security.js";
test("profile credentials verify only the matching six-digit code",async()=>{const credential=await createProfileCredential("482916",webcrypto);assert.equal(await verifyProfileCredential("482916",credential,webcrypto),true);assert.equal(await verifyProfileCredential("111111",credential,webcrypto),false);assert.equal(await verifyProfileCredential("48291",credential,webcrypto),false);assert.equal(credential.algorithm,"PBKDF2-SHA256");assert.notEqual(credential.hash,"482916");});
test("profile credentials reject weak or malformed codes",async()=>{await assert.rejects(()=>createProfileCredential("123",webcrypto));await assert.rejects(()=>createProfileCredential("abcdef",webcrypto));});

test("Arabic-Indic and Persian digits normalize to the same six-digit access code",async()=>{
 assert.equal(normalizeAccessCode("١٢٣٤٥٦"),"123456");
 assert.equal(normalizeAccessCode("۱۲۳۴۵۶"),"123456");
 assert.equal(normalizeAccessCode(" ١٢٣٤٥٦ "),"123456");
 const credential=await createProfileCredential("١٢٣٤٥٦",webcrypto);
 assert.equal(await verifyProfileCredential("۱۲۳۴۵۶",credential,webcrypto),true);
 assert.equal(await verifyProfileCredential("654321",credential,webcrypto),false);
});
