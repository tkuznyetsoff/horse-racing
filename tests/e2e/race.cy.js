describe('Horse Racing Game', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows the header with title and buttons', () => {
    cy.contains('h1', 'Horse Racing');
    cy.contains('button', 'GENERATE PROGRAM');
    cy.contains('button', 'START');
  });

  it('START button is disabled before generating a program', () => {
    cy.contains('button', 'START').should('be.disabled');
  });

  it('GENERATE PROGRAM creates horse list and schedule', () => {
    cy.contains('button', 'GENERATE PROGRAM').click();

    // Horse list should show 20 horses
    cy.get('.horse-list-table tbody tr').should('have.length', 20);

    // Each horse has a name, condition, and color swatch
    cy.get('.horse-list-table tbody tr').first().within(() => {
      cy.get('td').eq(0).should('not.be.empty');
      cy.get('td').eq(1).should('not.be.empty');
      cy.get('.color-swatch').should('exist');
    });

    // Program panel should show 6 rounds
    cy.get('.program-panel .round-section').should('have.length', 6);

    // Each round should have 10 horses
    cy.get('.program-panel .round-section').each(($round) => {
      cy.wrap($round).find('.round-table tbody tr').should('have.length', 10);
    });
  });

  it('START button becomes enabled after generating program', () => {
    cy.contains('button', 'GENERATE PROGRAM').click();
    cy.contains('button', 'START').should('not.be.disabled');
  });

  it('clicking START runs the race with animated horses', () => {
    cy.contains('button', 'GENERATE PROGRAM').click();
    cy.contains('button', 'START').click();

    // Race track should show lanes
    cy.get('.track-lane').should('have.length', 10);

    // Button should show PAUSE while running
    cy.contains('button', 'PAUSE').should('exist');
  });

  it('race completes and displays results for all 6 rounds', () => {
    cy.clock();
    cy.contains('button', 'GENERATE PROGRAM').click();
    cy.contains('button', 'START').click();

    // Fast-forward through all 6 rounds using fake timers
    // Each round: ~5s of ticks + 1500ms auto-advance gap ≈ 6.5s × 6 rounds
    // Use generous amount to account for random jitter in calculateStep
    cy.tick(120000);

    cy.get('.results-panel .round-section')
      .should('have.length', 6);

    // Each result should show 10 horses in finish order
    cy.get('.results-panel .round-section').each(($result) => {
      cy.wrap($result).find('.round-table tbody tr').should('have.length', 10);
    });

    // Race status should be finished — GENERATE PROGRAM re-enabled
    cy.contains('button', 'GENERATE PROGRAM').should('not.be.disabled');
  });

  it('GENERATE PROGRAM resets everything mid-race', () => {
    cy.contains('button', 'GENERATE PROGRAM').click();
    cy.contains('button', 'START').click();

    // Wait for race to visibly start
    cy.get('.track-lane').should('have.length', 10);

    // Wait for at least one round result before regenerating
    cy.get('.results-panel .round-section', { timeout: 30000 })
      .should('have.length.gte', 1);

    // Re-generate program
    cy.contains('button', 'GENERATE PROGRAM').click();

    // Results should be cleared
    cy.get('.results-panel .round-section').should('have.length', 0);
    cy.get('.results-panel').contains('Race results will appear here.');
  });

  it('PAUSE and RESUME work correctly', () => {
    cy.contains('button', 'GENERATE PROGRAM').click();
    cy.contains('button', 'START').click();

    // Should show PAUSE
    cy.contains('button', 'PAUSE').click();

    // Should show RESUME
    cy.contains('button', 'RESUME').should('exist');

    // Resume the race
    cy.contains('button', 'RESUME').click();
    cy.contains('button', 'PAUSE').should('exist');
  });
});
