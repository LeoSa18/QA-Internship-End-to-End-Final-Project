Feature: Registration with non-numeric phone

  Scenario Outline: Registration attempt with a non-numeric phone number
    Given the user is on the home page
    When the user navigates to the registration page
    And the user submits the registration form with the following data:
      | firstName    | <firstName>    |
      | lastName     | <lastName>     |
      | dateOfBirth  | <dateOfBirth>  |
      | street       | <streetAddress>|
      | postalCode   | <postalCode>   |
      | city         | <city>         |
      | state        | <state>        |
      | country      | <country>      |
      | phone        | <phone>        |
      | email        | <email>        |
      | password     | <password>     |
    Then an error message for non-numeric phone should be displayed
    And the user should remain on the registration page

    Examples:
      | firstName | lastName | dateOfBirth | streetAddress | postalCode | city      | state | country                        | phone           | email           | password      |
      | John      | Doe      | 10/11/2003  | 123 Main St   | 12345      | Anytown   | CA    | United States of America (the) | 1234567890abc   | plant@foco.com  | Passwo4rd123! |
      | Alice     | Smith    | 21/05/1978  | 456 Oak Ave   | 54321      | Metropolis| NY    | United States of America (the) | +543512345678   | wow@super.com   | MyPa8ssw0rd!  |
