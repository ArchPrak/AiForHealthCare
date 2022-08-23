"use strict";
// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
Object.defineProperty(exports, "__esModule", { value: true });
// Import commands.js using ES2015 syntax:
require("./commands");
// Alternatively you can use CommonJS syntax:
// require('./commands')
//# sourceMappingURL=e2e.js.map

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    console.log(err);
    //cy.log(`Uncaught exception: ${err.message}`, {err, runnable})
    //Cy.log(err)
    return false
})