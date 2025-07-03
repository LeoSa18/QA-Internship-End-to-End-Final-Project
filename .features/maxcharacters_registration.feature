Feature: Registration with maximum characters

  Scenario Outline: Registration attempt with fields exceeding maximum allowed characters
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
    Then an error message for maximum characters should be displayed
    And the user should remain on the registration page

    Examples:
      | firstName | lastName | dateOfBirth | streetAddress | postalCode | city      | state | country                        | phone                  | email               | password      |
      | AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA | AAAAAAAAAAAAAAAAAAAAAA | 10/11/2003 | AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA | AAAAAAAAAAAA | AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA  | AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA | United States of America (the) | 12345678901112131415161718 | patopatoso@gmail.com | Passwo4rd123! |
