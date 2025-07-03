Feature: Registration with invalid data

  Scenario: Attempt to register with all fields empty
    Given the user is on the home page
    When the user navigates to the registration page
    And the user submits the registration form with the following data:
      | firstName    |  |
      | lastName     |  |
      | dateOfBirth  |  |
      | street       |  |
      | postalCode   |  |
      | city         |  |
      | state        |  |
      | country      |  |
      | phone        |  |
      | email        |  |
      | password     |  |
    Then the user should remain on the registration page
    And an error message should be displayed for required fields
